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
import { recogniseMe, simpleCommandToRegExp, Command, CommandCallbackContext } from "../helpers/recogniseMe";
import { numberToNumberString, numberStringToNumber } from "../helpers/numberStrings";
import { wordsFromSquashedWords } from "../helpers/stringHelpers";

export interface CrosswordPuzzleProps {
    crosswordModel: CrosswordModel
}
interface RowColIndices {
    row: number,
    col:number
}

export enum WordSelectMode {
    select,nav,across,down
}
interface SolveCommand extends Command {
    square: Square,
    acrossOrDownMode: WordSelectMode
}
interface SolveExactCommand extends SolveCommand {
    guess: string,
    
}
interface CrosswordPuzzleState {
    testCommand:string
}
export class CrosswordPuzzle extends React.Component<CrosswordPuzzleProps, CrosswordPuzzleState> {
    canRecognise: boolean
    solveExact: boolean;
    autoSolve: boolean;//to come as props
    commands: Command[] = []
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
        recogniseMe.trigger([this.state.testCommand], []);
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

    //speech recognition callbacks  **************************** do inline ?
    navWord = (context: CommandCallbackContext) => {
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
        var isAcross = acrossOrDown == "across" ? true : false;
        var wordSelectMode = isAcross ? WordSelectMode.across : WordSelectMode.down;
        //this is not ideal !
        var cp = this.props.crosswordModel.clueProviders[0];
        var clues = cp.downClues;
        if (isAcross) {
            clues = cp.acrossClues
        }
        var word = clues.filter(function (clue) {
            return clue.number === number.toString();
        })[0].word;

        this.performSelection(word.squares[0], wordSelectMode);
    }
    solveWordLength = (context: CommandCallbackContext) => {
        console.log("In solve word length")
        var self = this;
        var command = context.command as SolveCommand;
        this.performSelection(command.square, command.acrossOrDownMode);
        var words = context.parameters[0];
        var guess = words.replace(" ", "");
        guess.split("").forEach(function (letter) {
            self.keyGuess(null, letter);
        });

    }
    solveWordExact = (context: CommandCallbackContext) => {
        var self = this;
        var command = context.command as SolveExactCommand;
        this.performSelection(command.square, command.acrossOrDownMode);
        command.guess.split("").forEach(function (letter) {
            self.keyGuess(null, letter);
        });

    }
    navDirectionRecognised = (context: CommandCallbackContext) => {
        var direction = context.parameters[0].toLowerCase();
        switch (direction) {
            case "left":
                this.arrowLeft();
                break;
            case "right":
                this.arrowRight();
                break;
            case "down":
                this.arrowDown();
                break;
            case "up":
                this.arrowUp();
                break;
        }
    }
    //*****************************************************************

    //need to clear from before
    //LP - should consider when clearing that another comnponent may also be adding commands

    recogniseNavigationCommands(crosswordModel:CrosswordModel) {
        this.recogniseCommand(this.getNavigationDirectionCommand());
        this.recogniseCommand(this.getNavigateToWordCommand(crosswordModel.clueProviders[0]));
    }
    recogniseSolveCommands(clueProviders:ClueProvider[]) {
        function getWordLengths(format: string) {
            var parts = format.split(",");
            if (parts.length === 1) {
                parts = format.split("-");
            }
            return parts.map(function (p) {
                return parseInt(p);
            })
        }
        //LP ( might only want to solve with one of the ClueProviders - cryptic or coffee time - through option pass in just the one
        function createSolveCommands(cps: ClueProvider[], numClueProviders: number, numClues: number, isAcross: boolean): Command[] {
            var acrossOrDownWord = isAcross ? "across" : "down";
            var wordSelectMode = isAcross ? WordSelectMode.across : WordSelectMode.down;
            var solveCommands = [];
            for (var i = 0; i < numClues; i++) {
                var formats: string[] = [];
                var clueProviderSolveCommands:Command[] = [];
                for (var j = 0; j < numClueProviders; j++) {
                    var cp = cps[j];
                    var cpClues = isAcross ? cp.acrossClues : cp.downClues;
                    var cpClue = cpClues[i];
                    var cpFormat = cpClue.format;
                    var clueProviderSolveCommand: SolveCommand;
                    if (formats.indexOf(cpFormat) === -1) {
                        formats.push(cpFormat);
                        var wordLengths = getWordLengths(cpFormat);
                        var regExprPrefix = "^" + solveWord + " " + "(?:" + cpClue.number + "|" + numberToNumberString(cpClue.number) + ")" + " " + acrossOrDownWord + " (?:with)?\\s?";
                        if (self.solveExact) {
                            var clueSolution = getClueSolution(cpClue);
                            var wordMatch = wordsFromSquashedWords(clueSolution, wordLengths)

                            var regExprString = regExprPrefix + wordMatch + "$";

                            clueProviderSolveCommand = {
                                description: "Solve exact: " + acrossOrDownWord + " " + cpClue.number,
                                regExpr: new RegExp(regExprString, "i"),
                                callback: self.solveWordExact,
                                guess: clueSolution,
                                square: null,
                                acrossOrDownMode:null

                            } as SolveCommand;
                            

                        } else {
                            //is it necessary to group the alternation ?
                            var formatsPart = "(";
                            for (var k = 0; k < wordLengths.length; k++) {
                                formatsPart += "[a-z]{" + wordLengths[k] + "}"
                                if (k !== wordLengths.length - 1) {
                                    formatsPart += " ";
                                }
                            }

                            var wordLengthRegEexp = regExprPrefix + formatsPart + ")$";
                            
                            clueProviderSolveCommand = {
                                description: "Solve word length: " + acrossOrDownWord + " " + cpClue.number,
                                regExpr: new RegExp(wordLengthRegEexp, "i"),
                                callback: self.solveWordLength,
                                acrossOrDownMode: null,
                                square:null
                            }
                        }
                        clueProviderSolveCommand.square = cpClue.word.squares[0];
                        clueProviderSolveCommand.acrossOrDownMode = wordSelectMode;
                        (clueProviderSolveCommand as any)["providerName"] = cp.name;
                        clueProviderSolveCommands.push(clueProviderSolveCommand);
                    }
                }
                if (clueProviderSolveCommands.length > 1) {
                    clueProviderSolveCommands.forEach(function (command) {
                        command.description += " " + (command as any)["providerName"];
                        solveCommands.push(command);
                    })
                } else {
                    solveCommands.push(clueProviderSolveCommands[0])
                }
                
            }
            return solveCommands;
        }
        var self = this;
        var solveWord = "(?:guess|answer|solve)";
        

        var numClueProviders = clueProviders.length;
        var numAcrossClues = clueProviders[0].acrossClues.length;
        var numDownClues = clueProviders[0].downClues.length;

        var acrossSolveCommands = createSolveCommands(clueProviders,numClueProviders,numAcrossClues, true);
        var downSolveCommands = createSolveCommands(clueProviders, numClueProviders,numDownClues, false);

        this.recogniseCommands(acrossSolveCommands.concat(downSolveCommands));
    }
    getNavigationDirectionCommand() {
        return {
            callback: this.navDirectionRecognised,
            description: "Navigation direction",
            regExpr: /^(left|right|up|down)$/
        }
        
    }
    getNavigateToWordCommand(cp:ClueProvider) {
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

        navWordCommandString += ")$"

        return {
            callback: this.navWord,
            description: "Navigate to word",
            regExpr: new RegExp(navWordCommandString, "i")
        }
        
    }
    recogniseCommands(commands: Command[]) {
        recogniseMe.addCommands(commands);
        this.commands = this.commands.concat(commands);
    }
    recogniseCommand(command: Command) {
        recogniseMe.addCommands(command);
        this.commands.push(command);
    }
    removeCommands() {
        recogniseMe.removeCommands(this.commands.map(function (command) {
            return command.description;
        }));
        this.commands = [];
    }
    resetRecognition() {
        this.removeCommands();
    }
    debugResultNoMatch() {
        //if sticking with this then can type the type
        if (!this.canRecognise) {
            //put synthesis in
            recogniseMe.addCallback("resultNoMatch", function (results: string[]) {
                console.log("Result no match*************")
                results.forEach(result => console.log(result));
                console.log("Result no match*************")
            });
        }

    }
    setUpRecognition(crosswordModel:CrosswordModel) {
        if (recogniseMe) {
            this.resetRecognition();

            this.debugResultNoMatch();//to delete later

            this.recogniseNavigationCommands(crosswordModel);
            this.recogniseSolveCommands(crosswordModel.clueProviders);
            recogniseMe.setLanguage("en-GB")
            this.canRecognise = true;
            recogniseMe.start();
        }
    }
    

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
    solveClicked = ()=>{
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

