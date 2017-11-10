import * as React from "react";
import { ICrosswordModel, ISquare, IWord, SolvingMode, Word, Clue, getClueSolution, ClueProvider } from '../models/index'
import { Crossword } from './crossword'
import { SquareProps } from "./square";
import * as KeyEvents from "../lib/key-handler"
import { SolveButton } from "./solveButton";
import { GlobalCheatButton } from "./globalCheatButton";
import { AutoSolveButton } from "./autoSolveButton";
import { TwoCol } from "./twoCol";
import { CroswordClues, ClueProps } from "./clues";
import { Lightbulbs } from "./Lighbulbs"
import { Lightbulb } from "./lightbulb";
import { recogniseMe, simpleCommandToRegExp, CommandCallbackContext, CommandState, StateCommand, StateCommandCallbackContext, CommandCallbackResponse, sentenceRegExp, SoundResponse } from "../helpers/recogniseMe";
import { numberToNumberString, numberStringToNumber } from "../helpers/numberStrings";
import { wordsFromSquashedWords } from "../helpers/stringHelpers";
import SSML = require('ssml');
import { IsOnline } from "./isOnline";
import { FlipClock24 } from "./stopwatchController";
import { ExpandableKeyboard } from "./expandableKeyboard";

interface RowColIndices {
    row: number,
    col:number
}
export enum WordSelectMode {
    select,nav,across,down
}
interface SpeechUndo {
    startingSquare: ISquare,
    wordSelectMode: WordSelectMode,
    originalGuesses:string[]
}
interface WordStateContext {
    clueSolution: string,
    identifier: string,
    clueProviderClues: ClueProviderClue[],
    squares:ISquare[]
}
//clues have italic!!!!!!!!!
interface ClueProviderClue {
    clue: string,
    format:string,
    providerName: string;
}

export interface CrosswordPuzzleProps {
    crosswordModel: ICrosswordModel
}
interface CrosswordPuzzleState {
    testCommand:string
}
export class CrosswordPuzzle extends React.Component<CrosswordPuzzleProps, CrosswordPuzzleState> {
    recognising: boolean
    solveExact: boolean;
    autoSolve: boolean;//to come as props

    speechUndos: SpeechUndo[];
    constructor(props: CrosswordPuzzleProps) {
        super(props);
        this.autoSolve = true;
        this.solveExact = false;
        this.state = { testCommand: "" };
        this.keyGuess = this.keyGuess.bind(this);
        this.backspace = this.backspace.bind(this);
    }
    componentWillReceiveProps(nextProps: CrosswordPuzzleProps) {
        this.initialize(nextProps);
    }
    componentDidMount() {
        this.initialize(this.props);
    }
    initialize(props: CrosswordPuzzleProps) {
        var crosswordModel = props.crosswordModel;
        this.ensureSelectedSquare(crosswordModel);
        //this.setUpRecognition(crosswordModel);
    }
    ensureSelectedSquare(crosswordModel: ICrosswordModel) {
        if (!crosswordModel.selectedSquare) {
            var firstSquare = crosswordModel.words[0].squares[0];
            crosswordModel.selectSquare(firstSquare);
        }
    }
    //#region recognition
    //#region recognition callbacks
    solveAny = (context: StateCommandCallbackContext) => {
        var self = this;
        var clueSolution = context.stateContext.clueSolution.toLowerCase();

        var guess = context.parameters[0];
        var guessWords = guess.split(" ");
        var solutionGuess = "";
        for (var i = 0; i < guessWords.length; i++) {
            solutionGuess += guessWords[i].toLowerCase();
        }
        var response: CommandCallbackResponse;
        if (clueSolution === solutionGuess) {
            var startingSquare = this.props.crosswordModel.selectedSquare;
            var speechUndo: SpeechUndo = {
                startingSquare: startingSquare,
                wordSelectMode: this.props.crosswordModel.selectedWord.isAcross ? WordSelectMode.across : WordSelectMode.down,
                originalGuesses: [startingSquare.guess]
            }
            var letters = clueSolution.split("");
            var numLetters = letters.length;
            for (var i = 0; i < numLetters; i++) {
                var letter = letters[i];
                self.keyGuess(letter);
                if (i < numLetters - 1) {
                    speechUndo.originalGuesses.push(this.props.crosswordModel.selectedSquare.guess);
                }
            }
            this.speechUndos.push(speechUndo);
            
            response = {
                sound: "assets/sounds/small-bell-ring.mp3"
            }
        } else {
            response = {
                sound: "assets/sounds/family-fortunes-wrong-buzzer.mp3"
            }
        }

        return response;
    }
    solution = (context: StateCommandCallbackContext) => {
        var response: CommandCallbackResponse = {
            synthesisMessage: (context.stateContext as WordStateContext).clueSolution
        }
        return response;
    }
    clues = (context: StateCommandCallbackContext) => {
        function getClueFormatSynthesis(format: string) {
            var parts = format.split(",");
            if (parts.length === 1) {
                parts = format.split("-");
            }
            var clueFormatSynthesis = "";
            for (var i = 0; i < parts.length; i++) {
                if (i !== 0) {
                    clueFormatSynthesis += ", then ";
                }
                var part = parts[i];
                var lettersPart = part === "1" ? "letter" : "letters";
                clueFormatSynthesis += parts[i] + " " + lettersPart;
            }
            return clueFormatSynthesis;
        }
        function getClueProviderSynthesis(clueProviderClue: ClueProviderClue, useClueProviderName: boolean) {
            var synthesis = useClueProviderName ? clueProviderClue.providerName + ".  " : "";
            synthesis += clueProviderClue.clue + ".  " + getClueFormatSynthesis(clueProviderClue.format) + ".  ";
            return synthesis;
        }
        var synthesisMessage: string;
        var wordContext = context.stateContext as WordStateContext;
        var cluesOrSpecificProvider = context.parameters[0].toLowerCase();
        var clueProviderClues = wordContext.clueProviderClues;

        if (cluesOrSpecificProvider === "clues") {
            var clueProvidersSynthesisMessage = "";
            for (var i = 0; i < clueProviderClues.length; i++) {
                var clueProviderClue = clueProviderClues[i];
                clueProvidersSynthesisMessage += getClueProviderSynthesis(clueProviderClue, true);
            }
            synthesisMessage = clueProvidersSynthesisMessage;
        } else {

            for (var i = 0; i < clueProviderClues.length; i++) {
                var clueProviderClue = clueProviderClues[i];
                if (clueProviderClue.providerName.toLowerCase() === cluesOrSpecificProvider) {
                    synthesisMessage = getClueProviderSynthesis(clueProviderClue, false);
                    break;
                }
            }


        }
        var response: CommandCallbackResponse = {
            synthesisMessage: synthesisMessage
        }
        return response;
    }
    letters = (context: StateCommandCallbackContext) => {
        var wordContext = context.stateContext as WordStateContext;
        var squares = wordContext.squares;
        var lettersSynthesis = "";
        var speakWord = false;//probably will not change as if incorrect and garbage then as a word cannot be understood.  if decide to speak when correct then giving the game away
        var wordSynthesis = "";

        var emptySynthesis = "Word is empty."
        var numEmptySquares = 0;
        var emptySquareSynthesis = "something";
        var synthesisMessage: string;
        var numSquares = squares.length
        for (var i = 0; i < numSquares; i++) {
            var squareGuess = squares[i].guess.toLowerCase();
            var squareIsEmpty = squareGuess === "";
            var letter = squareGuess;
            if (squareIsEmpty) {
                letter = emptySquareSynthesis;
                numEmptySquares++;
            } else {
                //of course this letter replacement may not be necessary with other voices......
                letter = squareGuess === "a" ? "eh" : squareGuess;
            }
            wordSynthesis += squareGuess;
            lettersSynthesis += " " + letter + ". ";
        }
        if (numEmptySquares === numSquares) {
            synthesisMessage = emptySynthesis
        } else {
            if (numEmptySquares === 0 && speakWord) {
                synthesisMessage = wordSynthesis
            } else {
                synthesisMessage = lettersSynthesis;
            }
        }
        return { synthesisMessage: synthesisMessage }

    }
    clueProviders = (context: StateCommandCallbackContext) => {
        var cps = this.props.crosswordModel.clueProviders;
        var synthesisMesssage = "";
        for (var i = 0; i < cps.length; i++) {
            if (i !== 0) {
                synthesisMesssage += ", ";
            }
            synthesisMesssage += cps[i].name;
        }
        return {
            synthesisMessage: synthesisMesssage
        }
    }
    //unsolved and incomplete can be refactored
    unsolvedRecognised = (context: StateCommandCallbackContext) => {
        var cw = this.props.crosswordModel;
        var cp = cw.clueProviders[0];
        var synthesis = "";
        var hasUnsolvedAcrossClues = false;
        for (var i = 0; i < cp.acrossClues.length; i++) {
            var acrossClue = cp.acrossClues[i];
            var word = acrossClue.word;
            var unsolved = !word.solved();
            if (unsolved) {
                if (hasUnsolvedAcrossClues) {
                    synthesis += ". " + acrossClue.number + " ";
                } else {
                    synthesis = "Across. " + acrossClue.number + " ";
                }

                hasUnsolvedAcrossClues = true;
            }
        }
        if (hasUnsolvedAcrossClues) {
            synthesis += ".  "
        }
        var hasUnsolvedDownClues = false;
        for (var i = 0; i < cp.downClues.length; i++) {
            var downClue = cp.downClues[i];
            var word = downClue.word;
            var unsolved = !word.solved();
            if (unsolved) {
                if (hasUnsolvedDownClues) {
                    synthesis += ", " + downClue.number;
                } else {
                    synthesis += "Down: " + downClue.number;
                }

                hasUnsolvedDownClues = true;
            }
        }
        if (hasUnsolvedAcrossClues || hasUnsolvedDownClues) {
            synthesis = "Unsolved words.  " + synthesis;
        } else {
            synthesis = "Crossword is solved";
        }
        var response: CommandCallbackResponse = {
            synthesisMessage: synthesis,
            canInterrupt: true
        }
        return response;
    }
    incompleteRecognised = (context: StateCommandCallbackContext) => {
        var cw = this.props.crosswordModel;
        var cp = cw.clueProviders[0];
        var synthesis = "";
        var hasIncompleteAcrossClues = false;
        for (var i = 0; i < cp.acrossClues.length; i++) {
            var acrossClue = cp.acrossClues[i];
            var word = acrossClue.word;
            var wordIncomplete = false;
            for (var j = 0; j < word.squares.length; j++) {
                var square = word.squares[j];
                if (square.guess === "") {
                    wordIncomplete = true;
                    break;
                }
            }
            if (wordIncomplete) {
                if (hasIncompleteAcrossClues) {
                    synthesis += ". " + acrossClue.number + " ";
                } else {
                    synthesis = "Across. " + acrossClue.number + " ";
                }

                hasIncompleteAcrossClues = true;
            }
        }
        if (hasIncompleteAcrossClues) {
            synthesis += ".  "
        }
        var hasIncompleteDownClues = false;
        for (var i = 0; i < cp.downClues.length; i++) {
            var downClue = cp.downClues[i];
            var word = downClue.word;
            var wordIncomplete = false;
            for (var j = 0; j < word.squares.length; j++) {
                var square = word.squares[j];
                if (square.guess === "") {
                    wordIncomplete = true;
                    break;
                }
            }
            if (wordIncomplete) {
                if (hasIncompleteDownClues) {
                    synthesis += ", " + downClue.number;
                } else {
                    synthesis += "Down: " + downClue.number;
                }

                hasIncompleteDownClues = true;
            }
        }
        if (hasIncompleteAcrossClues || hasIncompleteDownClues) {
            synthesis = "Incomplete words.  " + synthesis;
        } else {
            synthesis = "Crossword is solved";
        }
        var response: CommandCallbackResponse = {
            synthesisMessage: synthesis,
            canInterrupt: true
        }
        return response;
    }
    navDirectionRecognised = (context: StateCommandCallbackContext) => {
        var synthesisMessage = "No selected square to navigate from."
        if (this.props.crosswordModel.selectedSquare) {
            var direction = context.parameters[0].toLowerCase();
            var numNavs = 1;
            var numPart = context.parameters[1]
            var numPartMessage = numPart === undefined ? "" : numPart;
            synthesisMessage = direction + " " + numPartMessage;
            if (numPart) {
                numNavs = numberStringToNumber(numPart);
            }
            var navFunction: () => void;
            switch (direction) {
                case "left":
                    navFunction = this.arrowLeft;
                    break;
                case "right":
                    navFunction = this.arrowRight;
                    break;
                case "down":
                    navFunction = this.arrowDown;
                    break;
                case "up":
                    navFunction = this.arrowUp;
                    break;
            }

            for (var i = 0; i < numNavs; i++) {
                navFunction.bind(this)();
            }
            //should extract to a get letter speech method
            var currentSquareSpeech = this.props.crosswordModel.selectedSquare.guess.toLowerCase();
            currentSquareSpeech = currentSquareSpeech === "a" ? "eh" : currentSquareSpeech;
            var blankSquareSpeech = "blank";
            if (currentSquareSpeech === "") {
                currentSquareSpeech = blankSquareSpeech
            }

            synthesisMessage += " : " + currentSquareSpeech;
        }


        var response: CommandCallbackResponse = {
            synthesisMessage: synthesisMessage
        }
        return response;
    }
    spellAny = (context: StateCommandCallbackContext) => {
        var self = this;
        var startingSquare = this.props.crosswordModel.selectedSquare;
        var synthesisMessage = "No selected square";
        if (startingSquare) {
            var words = context.parameters[0].toLowerCase();

            var startingSquareGuess = startingSquare.guess;
            var originalGuesses: string[];
            var selectedWordIsAcross = this.props.crosswordModel.selectedWord.isAcross;
            var wordSelectMode = selectedWordIsAcross ? WordSelectMode.across : WordSelectMode.down;

            if (words === "delete") {
                originalGuesses = [startingSquareGuess];
                synthesisMessage = "deleted";
                self.backspace();
            } else {
                var phonetics = words.split(" ");
                synthesisMessage = "";
                originalGuesses = [startingSquareGuess];
                for (var i = 0; i < phonetics.length; i++) {
                    var word = phonetics[i];
                    var letter = word.split("")[0];
                    self.keyGuess(letter);
                    if (i < phonetics.length - 1) {
                        originalGuesses.push(this.props.crosswordModel.selectedSquare.guess);
                    }

                    letter = letter === "a" ? "eh" : letter;
                    synthesisMessage += letter + " ";
                }

            }
            this.speechUndos.push({
                originalGuesses: originalGuesses,
                startingSquare: startingSquare,
                wordSelectMode: wordSelectMode
            })
        }


        return {
            synthesisMessage: synthesisMessage
        }

    }
    undo = (context: StateCommandCallbackContext) => {
        var self = this;
        var synthesisMessage = "No speech to undo";
        if (this.speechUndos.length > 0) {
            synthesisMessage = "Undone";
            var numUndos = this.speechUndos.length;
            var speechUndo = this.speechUndos[numUndos - 1];
            this.speechUndos = this.speechUndos.slice(0, numUndos - 1);
            this.performSelection(speechUndo.startingSquare, speechUndo.wordSelectMode);

            speechUndo.originalGuesses.forEach(function (originalGuess) {
                self.keyGuess(originalGuess);
            });

        }
        return {
            synthesisMessage: synthesisMessage
        }
    }
    
    navWord = (context: StateCommandCallbackContext) => {
        var numberAcrossDown = context.parameters[0]
        var split = numberAcrossDown.split(" ");
        var numberString: string;
        var acrossOrDown: string;
        if (split.length === 2) {
            var numberString = split[0];
            var acrossOrDown = split[1]
        } else {
            var numberString = split[0] + " " + split[1];
            var acrossOrDown = split[2]
        }

        acrossOrDown = acrossOrDown.toLowerCase();

        var number: number
        if (numberString.length < 3) {
            number = parseInt(numberString);
        } else {
            number = numberStringToNumber(numberString);
        }
        var numString = number.toString();
        var isAcross = acrossOrDown == "across" ? true : false;

        var wordSelectMode = isAcross ? WordSelectMode.across : WordSelectMode.down;
        var clueProviders = this.props.crosswordModel.clueProviders;

        var clueProviderClues: ClueProviderClue[] = [];
        var cp = clueProviders[0];
        var clues = cp.downClues;
        if (isAcross) {
            clues = cp.acrossClues
        }
        var clueIndex: number;
        var startSquare: ISquare;
        var clueSolution: string;
        var squares: ISquare[];
        for (var i = 0; i < clues.length; i++) {
            var clue = clues[i];
            if (clue.number === numString) {
                clueSolution = getClueSolution(clue);
                squares = clue.word.squares;

                startSquare = squares[0];
                clueIndex = i;

                clueProviderClues.push({ clue: clue.text, format: clue.format, providerName: cp.name })
                break;
            }
        }
        for (var i = 1; i < clueProviders.length; i++) {
            cp = clueProviders[i];
            clues = cp.downClues;
            if (isAcross) {
                clues = cp.acrossClues;
            }
            clue = clues[clueIndex];
            clueProviderClues.push({ clue: clue.text, format: clue.format, providerName: cp.name });
        }

        this.performSelection(startSquare, wordSelectMode);
        var wordStateContext: WordStateContext = {
            
            clueSolution: clueSolution,
            identifier: numString + " " + acrossOrDown,
            clueProviderClues: clueProviderClues,
            squares: squares

        }
        var response: CommandCallbackResponse = {
            nextStateContext: wordStateContext
        }
        return response;
    }
    //#endregion   
    //#region setup
    //#region get command states
    
    getDefaultState(acrossClues: Clue[], downClues: Clue[]): CommandState {
        function getWordRegExpr() {
            //1 across | one down | 2 across | two across etc
            function appendWordAlternativesForAcrossOrDownClues(clues: Clue[], isAcross: boolean, command: string) {
                var acrossOrDown = isAcross ? "across" : "down";
                for (var i = 0; i < clues.length; i++) {
                    var clue = clues[i];
                    var clueNumber = numberToNumberString(clue.number);
                    command += clueNumber + " " + acrossOrDown + "|" + clue.number + " " + acrossOrDown;
                    if (i !== clues.length - 1) {
                        command += "|";
                    }
                }
                return command;
            }

            var navWordCommandString = "^(";
            navWordCommandString = appendWordAlternativesForAcrossOrDownClues(acrossClues, true, navWordCommandString);
            navWordCommandString += "|";
            navWordCommandString = appendWordAlternativesForAcrossOrDownClues(downClues, false, navWordCommandString);

            navWordCommandString += ")$";
            return new RegExp(navWordCommandString, "i");
        }
        var self = this;

        var testInterruptCommand: StateCommand = {
            name: "Test interrupt",
            regExp: /^Interrupt$/i,
            callback: function () {
                var response: CommandCallbackResponse = {
                    canInterrupt: true,
                    sound:"assets/sounds/To_Interrupt.mp3"
                }
                return response;
            }
        }
        var testCannotInterruptCommand: StateCommand = {
            name: "Test interrupt",
            regExp: /^Listen$/i,
            callback: function () {
                var response: CommandCallbackResponse = {
                    canInterrupt: false,
                    sound: "assets/sounds/Cannot_be_interrupted.mp3"
                }
                return response;
            }
        }

        var solveCommand: StateCommand = {
            name: "Click solve bulb",
            regExp: /^Solve$/i,
            callback: function () {
                self.solveClicked();
                return null;
            },
            keepState: true,

        }
        var cheatCommand: StateCommand = {
            name: "Click cheat bulb",
            regExp: /^cheat$/i,
            callback: function () {
                self.globalCheatClicked();
                return null;
            },
            keepState: true,

        }
        var navWordCommand: StateCommand = {
            name: "Navigation to word",
            regExp: getWordRegExpr(),
            callback: this.navWord,
            nextState: "Word"
        }
        var spellCommand: StateCommand = {
            name: "Spell",
            regExp: /^Spell$/i,
            nextState: "Spell",
            callback: function () { return null; }
        }
        var detailsCommand: StateCommand = {
            name: "Crossword details",
            regExp: /^details$/i,
            callback: function () {
                return null;
            },
            nextState: "Details"
        }
        var undoCommand: StateCommand = {
            name: "Undo",
            regExp: /^undo$/i,
            callback: this.undo
        }
        //testInterruptCommand, testCannotInterruptCommand,
        //
        return {
            isDefault: true,
            name: "Default",
            enter: function () { return { sound: "assets/sounds/default-state.mp3" } },
            exit: function () { console.log("Exit default state"); return null },
            commands: [ navWordCommand, detailsCommand, spellCommand, undoCommand, cheatCommand, solveCommand]
        }
    }
    getWordState(clueProviders: ClueProvider[]) {
        var self = this;

        var cluesRegExprString = "^(Clues";
        for (var i = 0; i < clueProviders.length; i++) {
            cluesRegExprString += "|" + clueProviders[i].name;
        }
        cluesRegExprString += ")$";

        var wordState: CommandState = {
            name: "Word",
            enter: function (wordContext: WordStateContext) {
                console.log("Entering the word state");
                return { synthesisMessage: wordContext.identifier };
            },
            exit: function () { console.log("Exiting the word state"); return null; },
            
            commands: [
                {
                    name: "Solution",
                    regExp: /^Solution$/i,
                    callback: this.solution,
                },

                {
                    name: "Clues",
                    regExp: new RegExp(cluesRegExprString, "i"),
                    callback: this.clues,
                },
                {
                    name: "Letters",
                    regExp: /^Letters/i,
                    callback: this.letters,
                }


            ],
            catchCommand: {
                name: "Guess",
                regExp: sentenceRegExp,
                callback: this.solveAny,
                nextState: "Default"
            }
        }
        return wordState;
    }
    getDetailsState() {
        var state: CommandState = {
            name: "Details",
            enter: function () {
                console.log("Enter details state")
                var soundResponse: SoundResponse = {
                    synthesisMessage: "Details"
                }
                return soundResponse;
            },
            commands: [
                {
                    name: "Unsolved",
                    regExp: /^unsolved$/i,
                    callback: this.unsolvedRecognised
                }, {
                    name: "Incomplete",
                    regExp: /^incomplete$/i,
                    callback: this.incompleteRecognised
                },
                {
                    name: "Clue Providers",
                    regExp: /^clue providers$/i,
                    callback: this.clueProviders
                },
            ]


        }

        return state;
    }
    getSpellState() {
        function getNavigationDirectionRegExpr() {
            var numPart = "\\s?("
            for (var i = 1; i < 13; i++) {
                numPart += i.toString() + "|" + numberToNumberString(i);
                if (i < 12) {
                    numPart += "|";
                }
            }
            numPart += ")?$"
            var regExprString = "^(left|right|up|down)" + numPart;
            return new RegExp(regExprString, "i")
        }

        
        var navDirectionCommand: StateCommand = {
            name: "Navigation direction",
            regExp: getNavigationDirectionRegExpr(),
            callback: this.navDirectionRecognised,
            keepState: true

        }
        var spellState: CommandState = {
            name: "Spell",
            enter: function () { console.log("Entering the spell state"); return { synthesisMessage: "Spelling" }; },
            exit: function () { console.log("Exiting the spell state"); return null; },
            
            commands: [
                navDirectionCommand
            ],
            catchCommand: {
                name: "Spell or delete",
                regExp: sentenceRegExp,
                callback: this.spellAny,
            }
        }
        return spellState;
    }
    //#endregion
    setUpRecognition(crosswordModel:ICrosswordModel) {
        if (recogniseMe) {
            this.speechUndos = [];
            var clueProviders = crosswordModel.clueProviders;
            recogniseMe.removeStates();
            //spellState navigation command is assuming that the crossword is 13*13 ( which it currently will always be) - later let this be dynamic based upon the crossword
            recogniseMe.addStates([this.getDefaultState(clueProviders[0].acrossClues, clueProviders[0].downClues), this.getWordState(clueProviders), this.getSpellState(), this.getDetailsState()])
            
            if (!this.recognising) {
                recogniseMe.allStatesNoMatchSoundResponse = { synthesisMessage:"I did not get that." }
                
                recogniseMe.setSkipSpeakingCommand("quiet please");
                recogniseMe.setLanguage("en-GB")
                recogniseMe.setStartStopCommands({ defaultStartStopPhrases: true, defaultStartStopSynthesis: true })
                
                recogniseMe.start();
                this.recognising = true;
            }
        }
    }
    //#endregion
    //#endregion

    
    
    
    //#region selection
    squareSelected = (rowColIndices: RowColIndices) => {
        var square=this.props.crosswordModel.grid[rowColIndices.row][rowColIndices.col]
        this.performSelection(square);
    }
    performSelection(square: ISquare, wordSelectMode = WordSelectMode.select) {
        var requiresRender = false;
        if (square.letter !== "") {
            var previousSelectedWord = this.props.crosswordModel.selectedWord;
            //leave here as _selectSquare changes
            var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
            var sameSquare = square.selected;
            if (!sameSquare) {
                this.props.crosswordModel.selectSquare(square);
                requiresRender = true;
            }
            var wordToSelect: IWord;
            if (square.acrossWord && square.downWord) {
                if (wordSelectMode == WordSelectMode.across) {
                    wordToSelect = square.acrossWord;
                } else if (wordSelectMode == WordSelectMode.down) {
                    wordToSelect = square.downWord;
                } else {
                    if (sameSquare) {
                        wordToSelect = this.props.crosswordModel.selectedWord == square.acrossWord ? square.downWord : square.acrossWord;
                    } else {
                        var determinePreference = true;
                        if (wordSelectMode === WordSelectMode.nav) {
                            if (previousSelectedSquare.acrossWord === square.acrossWord || previousSelectedSquare.downWord === square.downWord) {
                                wordToSelect = this.props.crosswordModel.selectedWord;
                                determinePreference = false;
                            }
                        }
                        if (determinePreference) {
                            wordToSelect = square.acrossWord;
                            if (square.number !== "") {
                                if (square.isStartOfWord(false)) {
                                    if (!square.isStartOfWord( true)) {
                                        wordToSelect = square.downWord;
                                    }
                                }
                            }
                        }
                    }
                }
                
            } else {
                wordToSelect = square.acrossWord ? square.acrossWord : square.downWord;
            }
            if (previousSelectedWord !== wordToSelect) {
                this.props.crosswordModel.selectWord(wordToSelect);
                requiresRender = true;
            }
        }
        if (requiresRender) {
            this.forceUpdate();
        }
    }
    //#endregion
    //#region arrow navigation
    arrowDown() {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInColumn = grid.length;//instead of recalculating - props on the model
            var nextNonBlankSquare: ISquare;
            var nextSquareRowIndex = selectedSquare.rowIndex;
            var colIndex = selectedSquare.columnIndex;
            while (!nextNonBlankSquare) {
                nextSquareRowIndex = nextSquareRowIndex == numSquaresInColumn - 1 ? 0 : nextSquareRowIndex + 1;
                var nextSquare = grid[nextSquareRowIndex][colIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, WordSelectMode.nav);
        }
    }
    arrowLeft() {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInRow = grid[0].length;//instead of recalculating - props on the model
            var nextNonBlankSquare: ISquare;
            var nextSquareColIndex = selectedSquare.columnIndex;
            var rowIndex = selectedSquare.rowIndex;
            while (!nextNonBlankSquare) {
                nextSquareColIndex = nextSquareColIndex == 0 ? numSquaresInRow - 1 : nextSquareColIndex - 1;
                var nextSquare = grid[rowIndex][nextSquareColIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, WordSelectMode.nav);
        }
    }
    arrowRight() {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInRow = grid[0].length;//instead of recalculating - props on the model
            var nextNonBlankSquare: ISquare;
            var nextSquareColIndex = selectedSquare.columnIndex;
            var rowIndex = selectedSquare.rowIndex;
            while (!nextNonBlankSquare) {
                nextSquareColIndex = nextSquareColIndex == numSquaresInRow - 1 ? 0 : nextSquareColIndex + 1;
                var nextSquare = grid[rowIndex][nextSquareColIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, WordSelectMode.nav);
        }
    }
    arrowUp() {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInColumn = grid.length;//instead of recalculating - props on the model
            var nextNonBlankSquare: ISquare;
            var nextSquareRowIndex = selectedSquare.rowIndex;
            var colIndex = selectedSquare.columnIndex;
            while (!nextNonBlankSquare) {
                nextSquareRowIndex = nextSquareRowIndex == 0 ? numSquaresInColumn - 1 : nextSquareRowIndex - 1;
                var nextSquare = grid[nextSquareRowIndex][colIndex];
                if (nextSquare.letter !== "") {
                    nextNonBlankSquare = nextSquare;
                    break;
                }
            }
            this.performSelection(nextNonBlankSquare, WordSelectMode.nav);
        }
    }

    //#endregion
    //#region key press callbacks
    arrowDownDown(evt: KeyboardEvent) {
        evt.preventDefault();
        this.arrowDown()
    }
    arrowLeftDown(evt: KeyboardEvent) {
        evt.preventDefault();
        this.arrowLeft();
    }
    arrowRightDown(evt: KeyboardEvent) {
        evt.preventDefault();
        this.arrowRight();
    }
    arrowUpDown(evt: KeyboardEvent) {
        evt.preventDefault();
        this.arrowUp();
    }

    backspace() {
        var selectedSquare = this.props.crosswordModel.selectedSquare
        if (selectedSquare) {
            var requiresRender: boolean;
            if (selectedSquare.guess !== "") {
                selectedSquare.guess = "";
                requiresRender = true;
            }
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== 0) {
                if (selectedWord.isAcross) {
                    this.arrowLeft();
                } else {
                    this.arrowUp();
                }
            } else {
                if (requiresRender) {
                    this.forceUpdate();
                }
            }
        }

    }
    keyGuess(keyValue: string) {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            var guess = keyValue.toUpperCase();
            var requiresRender: boolean;
            if (selectedSquare.guess !== guess) {
                selectedSquare.guess = guess;
                requiresRender = true;
            }

            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== selectedWord.squares.length - 1) {
                if (selectedWord.isAcross) {
                    this.arrowRight();
                } else {
                    this.arrowDown();
                }
            } else {
                if (requiresRender) {
                    this.forceUpdate();
                }
            }
        }
    }
    keyGuessEvent(event, keyValue: string) {
        this.keyGuess(keyValue);
    }

    //#endregion

    //#region auto solving
    setAutoSolve() {
        var crosswordModel = this.props.crosswordModel;
        
        if (this.autoSolve) {
            var solvedWords: IWord[] = [];
            var unsolvedWords: IWord[] = [];
            this.props.crosswordModel.words.forEach(word => {
                if (word.solved()) {
                    solvedWords.push(word);
                } else {
                    unsolvedWords.push(word);
                }
            });
            unsolvedWords.forEach(word => {
                word.squares.forEach(square => square.autoSolved = false);
            });
            solvedWords.forEach(word => {
                word.squares.forEach(square => square.autoSolved = true);
            });

        } else {
            var grid = this.props.crosswordModel.grid;
            grid.forEach(row => {
                row.forEach(square => {
                    square.autoSolved = false;
                });
            })
        }
    }
    autoSolveClicked = () => {
        this.autoSolve = !this.autoSolve;
        this.forceUpdate();
    }
    //#endregion
    //#region SolvingMode Guessing/Solving/Cheating
    solveClicked = () => {
        if (this.props.crosswordModel.solvingMode === SolvingMode.Solving) {
            this.props.crosswordModel.solvingMode = SolvingMode.Guessing;
        } else {
            this.props.crosswordModel.solvingMode = SolvingMode.Solving;
        }
        this.forceUpdate();
    }
    globalCheatClicked = () => {
        if (this.props.crosswordModel.solvingMode === SolvingMode.Cheating) {
            this.props.crosswordModel.solvingMode = SolvingMode.Guessing;
        } else {
            this.props.crosswordModel.solvingMode = SolvingMode.Cheating;
        }
        this.forceUpdate();
    }
    //#endregion
    
    clueSelected = (isAcross: boolean, wordId: number) => {
        var words = this.props.crosswordModel.words;
        var selectedWord: IWord;
        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            if (word.id == wordId) {
                selectedWord = word;
                break;
            }
        }
        
        var firstSquare = selectedWord.squares[0];
        var wordSelectMode = WordSelectMode.down;
        if (isAcross) {
            wordSelectMode = WordSelectMode.across;
        }
        this.performSelection(firstSquare, wordSelectMode)
        //want to select it and force across/down
    }


    //#region model mapping for rendered child components
    mapClues(clues: Clue[]): ClueProps[] {
        var crosswordModel = this.props.crosswordModel;
        var solvingMode = crosswordModel.solvingMode;

        return clues.map(clue => {
            var clueWord = clue.word;
            var wordSolved = clueWord.solved();
            var clueLetters = clueWord.squares.map(sq => {
                return {
                    guess: sq.guess,
                    letter: sq.letter,
                    autoSolved: sq.autoSolved,
                    solvingMode: solvingMode,
                    isSolved: wordSolved
                }
            });
            var clueProps: ClueProps = {
                clueNumber: clue.number,
                format: clue.format,
                text: clue.text,
                solvingMode: solvingMode,
                isSelected: crosswordModel.selectedWord === clue.word,
                isSolved: wordSolved,
                clueLetters: clueLetters,
                wordId: clue.word.id
            };
            return clueProps;
        });
    }

    _mapGrid(grid: ISquare[][]): SquareProps[][] {
        var self = this;
        var mappedGrid = grid.map((row, rowIndex) => {
            return row.map((square, colIndex) => {
                return {
                    identifier: { row: rowIndex, col: colIndex }, autoSolved: square.autoSolved, selected: this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: this.props.crosswordModel.solvingMode, number: square.number, letter: square.letter, guess: square.guess
                }
            });
        })
        return mappedGrid;
    }
    //#endregion

    
    
    render() {
        this.setAutoSolve();
        var squares = this._mapGrid(this.props.crosswordModel.grid);
        
        /*
        
            <AutoSolveButton isAutoSolving={this.autoSolve} clicked={this.autoSolveClicked} />
        */
        
        var leftContent =
            <div >
                <Crossword squares={squares} />
                <div>
                    <span onClick={this.globalCheatClicked}>
                        <Lightbulb on={this.props.crosswordModel.solvingMode === SolvingMode.Cheating} rayColour="red" onGlowColour="red" text="Cheat" id="cheatBulb" bulbOuterColour="red" innerGlowColour="red" />
                    </span>
                    <span onClick={this.solveClicked}>
                        <Lightbulb on={this.props.crosswordModel.solvingMode === SolvingMode.Solving} rayColour="yellow" onGlowColour="yellow" text="Solve" id="solveBulb" bulbOuterColour="yellow" innerGlowColour="yellow" />
                    </span>
                    <FlipClock24 shouldUpdateSameDuration={false} startDuration={this.props.crosswordModel.duration} />

                    <ExpandableKeyboard keyboardColour="gray" buttonBackgroundColour="orange" backspacePressed={this.backspace} keyPressed={this.keyGuess} />
                    
                   
                </div>
            </div>

        var mappedClueProviders = this.props.crosswordModel.clueProviders.map(cp => {
            return {
                name: cp.name,
                acrossClues: this.mapClues(cp.acrossClues),
                downClues: this.mapClues(cp.downClues)
            }
        });
        var rightContent = <CroswordClues clueSelected={this.clueSelected} grouping={true} clueProviders={mappedClueProviders} />
        return <TwoCol leftContent= { leftContent } rightContent= { rightContent } />
    }
}

// #region HOC keyevents for CrosswordPuzzle
var alphaKeysUpper = ["A", "B", "C", "D", "E", "F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var alphaKeysLower = alphaKeysUpper.map(u => u.toLowerCase());
var alphaKeys = alphaKeysUpper.concat(alphaKeysLower);
var alphaMatches=alphaKeys.map(alphaKey => {
    return {
        methodName: "keyGuessEvent",
        keyMatches: [alphaKey]
    }
});
var arrowMatches = [
    {
        methodName: "arrowLeftDown",
        keyMatches: ["ArrowLeft"]

    },
    {
        methodName: "arrowRightDown",
        keyMatches: ["ArrowRight"]

    },
    {
        methodName: "arrowDownDown",
        keyMatches: ["ArrowDown"]

    },
    {
        methodName: "arrowUpDown",
        keyMatches: ["ArrowUp"]

    }
]
var backspaceMatch = {
    methodName: "backspace",
    keyMatches:["Backspace"]
}
var keyMatches = arrowMatches.concat(alphaMatches);
keyMatches.push(backspaceMatch);
export var CrosswordPuzzleKeyEvents = KeyEvents.keyHandler({
    keyEventName: "keydown", keyMatches: keyMatches
})(CrosswordPuzzle);
//#endregion

