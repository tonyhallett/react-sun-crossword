import * as React from "react";
import { CrosswordModel, Square, IWord, SolvingMode, Word, Clue, getClueSolution, ClueProvider } from '../models/index'
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
import  SSML =require('ssml');

interface RowColIndices {
    row: number,
    col:number
}
export enum WordSelectMode {
    select,nav,across,down
}
interface WordStateContext {
    startSquare: Square,
    wordSelectMode: WordSelectMode,
    clueSolution: string,
    identifier: string,
    clueProviderClues: ClueProviderClue[],
    squares:Square[]
}
//clues have italic!!!!!!!!!
interface ClueProviderClue {
    clue: string,
    format:string,
    providerName: string;
}
//interface SolveCommand extends Command {
//    square: Square,
//    acrossOrDownMode: WordSelectMode
//}
//interface SolveExactCommand extends SolveCommand {
//    guess: string,
    
//}

export interface CrosswordPuzzleProps {
    crosswordModel: CrosswordModel
}
interface CrosswordPuzzleState {
    testCommand:string
}
export class CrosswordPuzzle extends React.Component<CrosswordPuzzleProps, CrosswordPuzzleState> {
    canRecognise: boolean
    solveExact: boolean;
    autoSolve: boolean;//to come as props
    defaultState: CommandState;
    states: CommandState[] = [];
    constructor(props: CrosswordPuzzleProps) {
        super(props);
        this.autoSolve = true;
        this.solveExact = false;
        this.state = { testCommand: "" };
    }
    componentWillReceiveProps(nextProps: CrosswordPuzzleProps) {
        this.setUpRecognition(nextProps.crosswordModel);
    }
    componentDidMount() {
        this.setUpRecognition(this.props.crosswordModel);
    }
    //to delete with state
    testCommand = () => {
        //recogniseMe.trigger([this.state.testCommand], []);

        //var ssml = new SSML();
        //var demoSpellSsml = ssml.say('Demo of spelling').say({ text: "monkey", interpretAs: "characters" }).toString();
        //console.log(demoSpellSsml);
        //speechSynthesis.speak(new SpeechSynthesisUtterance(demoSpellSsml));

        //will then need to check this idea with spelling multiple ( and with something )

        //add means 
        var rate = parseFloat(this.state.testCommand);
        console.log(rate);
        var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var text = ["eh", "bee", "see", "dee","ee", "ef","gee","aitch","eye","jay","kay","el","em","en","oh","pee","queue","are","ess","tea","you","vee","double you","ex","why","zed"];

        for (var i = 0; i < letters.length; i++) {
            var speech = new SpeechSynthesisUtterance(letters[i]);
            speech.rate = rate;
            speechSynthesis.speak(speech);
            var textSpeech = new SpeechSynthesisUtterance(text[i]);
            textSpeech.rate = rate;
            speechSynthesis.speak(textSpeech);

        }
      


    }


    _mapGrid(grid: Square[][]): SquareProps[][] {
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

    //#region recognition
    //#region old to look at again
    solveWordLength = (context: CommandCallbackContext) => {
        //console.log("In solve word length")
        //var self = this;
        //var command = context.command as SolveCommand;
        //this.performSelection(command.square, command.acrossOrDownMode);
        //var words = context.parameters[0];
        //var guess = words.replace(" ", "");
        //guess.split("").forEach(function (letter) {
        //    self.keyGuess(null, letter);
        //});

    }
    solveWordExact = (context: CommandCallbackContext) => {
        //var self = this;
        //var command = context.command as SolveExactCommand;
        //this.performSelection(command.square, command.acrossOrDownMode);
        //command.guess.split("").forEach(function (letter) {
        //    self.keyGuess(null, letter);
        //});

    }
    //#endregion

    //look at this again - should be providing in context the minimum for the commands to get what they individually need
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
        var startSquare: Square;
        var clueSolution: string;
        var squares: Square[];
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
            clueProviderClues.push({ clue: clue.text,format:clue.format, providerName: cp.name });
        }

        this.performSelection(startSquare, wordSelectMode);
        var wordStateContext: WordStateContext = {
            startSquare: startSquare,
            wordSelectMode: wordSelectMode,
            clueSolution: clueSolution,
            identifier: numString + " " + acrossOrDown,
            clueProviderClues: clueProviderClues,
            squares:squares
            
        }
        var response: CommandCallbackResponse = {
            nextStateContext: wordStateContext
            
        }
        return response;
    }

    //to become part of spelling
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

            var currentSquareSpeech = this.props.crosswordModel.selectedSquare.guess;
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
    
    
    //to go as helper in recogniseMe
    getNoMatchSynthesisMessage(results: string[], confidences: number[], giveResultsFeedback = true, numResultsForFeedback = 1) {
        var synthesisMessage = "Speech recognition results are not understood.  ";//this is under current conditions of exact matching
        if (giveResultsFeedback) {
            synthesisMessage += "I heard, "
            for (var i = 0; i < numResultsForFeedback; i++) {
                synthesisMessage += results[i];
                if (i < numResultsForFeedback - 1) {
                    synthesisMessage += ", ";
                }
            }
            synthesisMessage += ".  ";
        }
        return synthesisMessage;
    }

    //#region spelling
    getSpellState() {//extract the regular expression string to a helper
        var spellState: CommandState={
            name: "Spell",
            enter: function () { console.log("Entering the spell state"); return { synthesisMessage:"Spelling" }; },
            exit: function () { console.log("Exiting the spell state"); return null; },
            commands: [
                {
                    name: "Spell any",
                    regExp: sentenceRegExp,
                    callback: this.spellAny,
                }
            ]
        }
        return spellState;
    }
    spellAny = (context: StateCommandCallbackContext) => {
        var self = this;
        var words = context.parameters[0].toLowerCase();
        var synthesisMessage: string;

        var speakSpelling = false;

        if (words === "delete") {
            synthesisMessage = "delete";
            self.backspace();
        } else {
            var phonetics = words.split(" ");
            synthesisMessage = "";
            phonetics.forEach(function (word) {
                var letter = word.split("")[0];
                self.keyGuess(null, letter);
                synthesisMessage += letter + " ";
            })
        }
        if (speakSpelling) {
            return {
                synthesisMessage: synthesisMessage
            }
        }
        return null;
    }
    //#endregion
    //#region word
    getWordState(clueProviders:ClueProvider[]) {
        var self = this;
        var cluesRegExprString = "^(Clues";
        for (var i = 0; i < clueProviders.length;i++){
            cluesRegExprString += "|" + clueProviders[i].name;
        }
        cluesRegExprString += ")$";
        var solveState: CommandState = {
            name: "Word",
            enter: function (wordContext: WordStateContext) {
                console.log("Entering the word state");
                return { synthesisMessage: wordContext.identifier };
            },
            exit: function () { console.log("Exiting the word state"); return null; },
            noMatch: function (results:string[],confidences:number[]) {
                //could adding to speach - Try spelling
                return {
                    synthesisMessage: self.getNoMatchSynthesisMessage(results, confidences)
                };
            },
            commands: [
                {
                    name: "Solution",
                    regExp: /^Solution$/i,
                    callback: this.solution,
                },
                
                {
                    name: "Clues",
                    regExp: new RegExp(cluesRegExprString,"i"),
                    callback: this.clues,
                },
                {
                    name: "Letters",
                    regExp: /^Letters/i,
                    callback: this.letters,
                },
                {
                    name: "Solve any",
                    regExp: sentenceRegExp,
                    callback: this.solveAny,
                    nextState: "Default"
                },

            ]
        }
        return solveState;
    }
    //if do solve where match against format - will read out the answer and not change state - see old to look at again
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
            clueSolution.split("").forEach(function (letter) {
                self.keyGuess(null, letter);
            })
            response = {
                sound: "sounds/small-bell-ring.mp3"
            }
        } else {
            response = {
                matches: false,

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
        function getClueFormatSynthesis(format:string) {
            var parts = format.split(",");
            if (parts.length === 1) {
                parts = format.split("-");
            }
            var clueFormatSynthesis = "";
            for (var i = 0; i < parts.length; i++) {
                if (i !== 0) {
                    clueFormatSynthesis += ", then ";
                }
                clueFormatSynthesis += parts[i] + " letters";
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
        //will say word if no "", no guess if all "", otherwise spell
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
            lettersSynthesis += letter + ". ";
        }
        if (numEmptySquares === 0) {
            synthesisMessage = wordSynthesis
        } else if (numEmptySquares === numSquares) {
            synthesisMessage = emptySynthesis
        } else {
            synthesisMessage = lettersSynthesis;
        }
        return {
            synthesisMessage: synthesisMessage
        }
    }
    //#endregion
    //#region details
    getDetailsState() {
        //no match and state timeout
        var state: CommandState = {
            name:"Details",
            enter: function () {
                var soundResponse: SoundResponse = {
                    synthesisMessage:"Details"
                }
                return soundResponse;
            },
            commands: [
                {
                    name: "Unsolved",
                    regExp: /^unsolved$/i,
                    callback: this.unsolvedRecognised
                },{
                    name: "Incomplete",
                    regExp: /^incomplete$/i,
                    callback: this.incompleteRecognised
                },
            ]
            
            
        }

        return state;
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
                    synthesis += ", " + acrossClue.number;
                } else {
                    synthesis = "Across: " + acrossClue.number;
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
            synthesisMessage: synthesis
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
                    synthesis += ", " + acrossClue.number;
                } else {
                    synthesis = "Across: " + acrossClue.number;
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
            synthesisMessage: synthesis
        }
        return response;
    }
    //#endregion

    getDefaultState(cp: ClueProvider) :CommandState{
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
            navWordCommandString = appendWordAlternativesForAcrossOrDownClues(cp.acrossClues, true, navWordCommandString);
            navWordCommandString += "|";
            navWordCommandString = appendWordAlternativesForAcrossOrDownClues(cp.downClues, false, navWordCommandString);

            navWordCommandString += ")$";
            return new RegExp(navWordCommandString, "i");
        }
        var self = this;

        //for the blind this information is available in details ( through exclusion of those returned )
        var clickSolveBulbCommand: StateCommand = {
            name: "Click solve bulb",
            regExp: /^Solve$/i,
            callback: function () {
                self.solveClicked();
                return null;
            },
            keepState: true,

        }
        var clickCheatBulbCommand: StateCommand = {
            name: "Click cheat bulb",
            regExp: /^cheat$/i,
            callback: function () {
                self.globalCheatClicked();
                return null;
            },
            keepState: true,

        }
        //going to go in spelling
        var navDirectionCommand: StateCommand = {
            name: "Navigation direction",
            regExp: getNavigationDirectionRegExpr(),
            callback: this.navDirectionRecognised,
            keepState:true
            
        }
        var navWordCommand: StateCommand = {
            name: "Navigation to word",
            regExp: getWordRegExpr(),
            callback: this.navWord,
            nextState:"Word"
        }
        var spellCommand: StateCommand = {
            name: "Spell",
            regExp: /^Spell$/i,
            nextState: "Spell",
            callback: function () { return null;}
        }
        var detailsCommand: StateCommand = {
            name: "Crossword details",
            regExp: /^details$/i,
            callback: function () {
                return null;
            },
            nextState:"Details"
        }
        return   {
            isDefault: true,
            name: "Default",
            enter: function () { return { sound:"sounds/default-state.mp3" } },
            exit: function () { console.log("Exit default state"); return null },
            noMatch: function (results, confidences) {
                return { synthesisMessage:self.getNoMatchSynthesisMessage(results, confidences) }
            },
            commands: [navDirectionCommand, navWordCommand, detailsCommand, spellCommand, clickCheatBulbCommand, clickSolveBulbCommand]
        }
    }

    //#region setup
    setUpRecognition(crosswordModel:CrosswordModel) {
        if (recogniseMe) {
            var clueProviders = crosswordModel.clueProviders;
            var theDefaultState = this.getDefaultState(clueProviders[0]);
            if (this.canRecognise) {
                recogniseMe.removeStates([this.defaultState.name]);
            }
            this.recogniseDefaultState(theDefaultState);
            if (this.canRecognise) {
                recogniseMe.setState(this.defaultState.name, {});
            } else {
                this.recogniseStates([this.getWordState(clueProviders), this.getSpellState(), this.getDetailsState()])
            }
            recogniseMe.setLanguage("en-GB")
            recogniseMe.setStartStopCommands({ defaultStartStopPhrases: true, defaultStartStopSynthesis:true })
            this.canRecognise = true;

            recogniseMe.start();
        }
    }
    recogniseDefaultState(defaultState: CommandState) {
        recogniseMe.addStates([defaultState]);
        this.defaultState = defaultState;
    }
    recogniseStates(states: CommandState[]) {
        recogniseMe.addStates(states);
        this.states = states;
    }
    //#endregion
    //#endregion

    _selectWord(selectedWord: IWord) { //the crosswordModel selectedWord property should deal with it - but interface 
        if (this.props.crosswordModel.selectedWord !== selectedWord) {
            if (this.props.crosswordModel.selectedWord) {
                //this._setWordSquaresSelection(this.props.crosswordModel.selectedWord, false);
                this.props.crosswordModel.selectedWord.deselect();
            }
            selectedWord.select();
            this.props.crosswordModel.selectedWord = selectedWord;
        }
    }
    //the crosswordModel selectedCell property should deal with it - but interface 
    _selectSquare(square: Square) {
        var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
        if (previousSelectedSquare) {
            previousSelectedSquare.selected = false;
        }
        square.selected = true;
        this.props.crosswordModel.selectedSquare = square;
    }
    //method of square model
    _squareIsStartOfWord(square: Square, across: boolean) {
        var word = across ? square.acrossWord : square.downWord;
        var index = word.squares.indexOf(square);
        return index === 0;
    }
    //this context lost otherwise
    squareSelected = (rowColIndices: RowColIndices) => {
        var square=this.props.crosswordModel.grid[rowColIndices.row][rowColIndices.col]
        this.performSelection(square);
    }
    performSelection(square: Square, wordSelectMode = WordSelectMode.select) {
        var requiresRender = false;
        if (square.letter !== "") {
            var previousSelectedWord = this.props.crosswordModel.selectedWord;
            //leave here as _selectSquare changes
            var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
            var sameSquare = square.selected;
            if (!sameSquare) {
                this._selectSquare(square);
                requiresRender = true;
            }
            var wordToSelect: IWord;
            if (square.acrossWord !== null && square.downWord !== null) {
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
                                if (this._squareIsStartOfWord(square, false)) {
                                    if (!this._squareIsStartOfWord(square, true)) {
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
                this._selectWord(wordToSelect);
                requiresRender = true;
            }
        }
        if (requiresRender) {
            this.forceUpdate();
        }
    }
    arrowDownDown(evt: KeyboardEvent) {
        evt.preventDefault();
        this.arrowDown()
    }
    arrowDown() {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInColumn = grid.length;//instead of recalculating - props on the model
            var nextNonBlankSquare: Square;
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
    arrowLeftDown(evt: KeyboardEvent) {
        evt.preventDefault();
        this.arrowLeft();
    }
    arrowLeft() {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInRow = grid[0].length;//instead of recalculating - props on the model
            var nextNonBlankSquare: Square;
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
    arrowRightDown(evt: KeyboardEvent) {
        evt.preventDefault();
        this.arrowRight();
    }
    arrowRight() {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInRow = grid[0].length;//instead of recalculating - props on the model
            var nextNonBlankSquare: Square;
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
    arrowUpDown(evt: KeyboardEvent) {
        evt.preventDefault();
        this.arrowUp();
    }
    arrowUp() {
        var crosswordModel = this.props.crosswordModel
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid
            var numSquaresInColumn = grid.length;//instead of recalculating - props on the model
            var nextNonBlankSquare: Square;
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
    keyGuess(event, keyValue: string) {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            var guess = keyValue.toUpperCase();
            var requiresRender: boolean;
            if (selectedSquare.guess !== guess) {
                selectedSquare.guess = guess;
                requiresRender = true;
            }
            
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== selectedWord.squares.length-1) {
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
    setAutoSolve() {
        var crosswordModel = this.props.crosswordModel;
        //given that autoSolve is unrelated to a specific crossword
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
    autoSolveClicked = () => {
        this.autoSolve = !this.autoSolve;
        this.forceUpdate();
    }
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

    testCommandChanged = (evt) => {
        this.setState({ testCommand: evt.target.value })
    }
    
    render() {
        this.setAutoSolve();
        var squares = this._mapGrid(this.props.crosswordModel.grid);
        var mappedClueProviders = this.props.crosswordModel.clueProviders.map(cp => {
            return {
                name: cp.name,
                acrossClues: this.mapClues(cp.acrossClues),
                downClues: this.mapClues(cp.downClues)
            }
        });
        /*
        <SolveButton  isSolving={this.props.crosswordModel.solvingMode === SolvingMode.Solving} clicked={this.solveClicked} />
            <GlobalCheatButton isCheating={this.props.crosswordModel.solvingMode === SolvingMode.Cheating} clicked={this.globalCheatClicked} />
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
                </div>
                <input type="text" onChange={this.testCommandChanged} value={this.state.testCommand} />
                <button onClick={this.testCommand}>Test command</button>
                
            </div>
        
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
        methodName: "keyGuess",
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

