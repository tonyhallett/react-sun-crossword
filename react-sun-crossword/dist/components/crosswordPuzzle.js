"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var index_1 = require("../models/index");
var crossword_1 = require("./crossword");
var KeyEvents = require("../lib/key-handler");
var twoCol_1 = require("./twoCol");
var clues_1 = require("./clues");
var lightbulb_1 = require("./lightbulb");
var recogniseMe_1 = require("../helpers/recogniseMe");
//import { recogniseMe, simpleCommandToRegExp, Command, CommandCallbackContext, CommandState } from "../helpers/recogniseMe";
var numberStrings_1 = require("../helpers/numberStrings");
var WordSelectMode;
(function (WordSelectMode) {
    WordSelectMode[WordSelectMode["select"] = 0] = "select";
    WordSelectMode[WordSelectMode["nav"] = 1] = "nav";
    WordSelectMode[WordSelectMode["across"] = 2] = "across";
    WordSelectMode[WordSelectMode["down"] = 3] = "down";
})(WordSelectMode = exports.WordSelectMode || (exports.WordSelectMode = {}));
var CrosswordPuzzle = (function (_super) {
    __extends(CrosswordPuzzle, _super);
    function CrosswordPuzzle(props) {
        var _this = _super.call(this, props) || this;
        _this.states = [];
        //to delete with state
        _this.testCommand = function () {
            recogniseMe_1.recogniseMe.trigger([_this.state.testCommand], []);
        };
        _this.navWord = function (context) {
            var numberAcrossDown = context.parameters[0];
            var split = numberAcrossDown.split(" ");
            var numberString;
            var acrossOrDown;
            if (split.length === 2) {
                var numberString = split[0];
                var acrossOrDown = split[1];
            }
            else {
                var numberString = split[0] + " " + split[1];
                var acrossOrDown = split[2];
            }
            acrossOrDown = acrossOrDown.toLowerCase();
            var number;
            if (numberString.length < 3) {
                number = parseInt(numberString);
            }
            else {
                number = numberStrings_1.numberStringToNumber(numberString);
            }
            var isAcross = acrossOrDown == "across" ? true : false;
            var wordSelectMode = isAcross ? WordSelectMode.across : WordSelectMode.down;
            //this is not ideal !
            var cp = _this.props.crosswordModel.clueProviders[0];
            var clues = cp.downClues;
            if (isAcross) {
                clues = cp.acrossClues;
            }
            var clue = clues.filter(function (clue) {
                return clue.number === number.toString();
            })[0];
            var word = clue.word;
            var startSquare = word.squares[0];
            _this.performSelection(startSquare, wordSelectMode);
            var response = {
                nextStateContext: {
                    startSquare: startSquare,
                    wordSelectMode: wordSelectMode,
                    clueSolution: index_1.getClueSolution(clue)
                }
            };
            return response;
        }; //done
        _this.solveWordLength = function (context) {
            //console.log("In solve word length")
            //var self = this;
            //var command = context.command as SolveCommand;
            //this.performSelection(command.square, command.acrossOrDownMode);
            //var words = context.parameters[0];
            //var guess = words.replace(" ", "");
            //guess.split("").forEach(function (letter) {
            //    self.keyGuess(null, letter);
            //});
        };
        _this.solveWordExact = function (context) {
            //var self = this;
            //var command = context.command as SolveExactCommand;
            //this.performSelection(command.square, command.acrossOrDownMode);
            //command.guess.split("").forEach(function (letter) {
            //    self.keyGuess(null, letter);
            //});
        };
        _this.spellAny = function (context) {
            var self = _this;
            var phonetics = context.parameters[0].split(" ");
            phonetics.forEach(function (word) {
                self.keyGuess(null, word.split("")[0]);
            });
            return null;
        };
        _this.solveAny = function (context) {
            var self = _this;
            //if get right will probably want to exit the state - would need to set on the command
            var clueSolution = context.stateContext.clueSolution.toLowerCase();
            var guess = context.parameters[0];
            var guessWords = guess.split(" ");
            var solutionGuess = "";
            for (var i = 0; i < guessWords.length; i++) {
                solutionGuess += guessWords[i].toLowerCase();
            }
            if (clueSolution === solutionGuess) {
                clueSolution.split("").forEach(function (letter) {
                    self.keyGuess(null, letter);
                });
                return null;
            }
            var response = {
                matches: false
            };
            return response;
        };
        //done
        _this.navDirectionRecognised = function (context) {
            var direction = context.parameters[0].toLowerCase();
            var numNavs = 1;
            var numPart = context.parameters[1];
            if (numPart) {
                numNavs = numberStrings_1.numberStringToNumber(numPart);
            }
            var navFunction;
            switch (direction) {
                case "left":
                    navFunction = _this.arrowLeft;
                    break;
                case "right":
                    navFunction = _this.arrowRight;
                    break;
                case "down":
                    navFunction = _this.arrowDown;
                    break;
                case "up":
                    navFunction = _this.arrowUp;
                    break;
            }
            for (var i = 0; i < numNavs; i++) {
                navFunction.bind(_this)();
            }
            return null;
        };
        //this context lost otherwise
        _this.squareSelected = function (rowColIndices) {
            var square = _this.props.crosswordModel.grid[rowColIndices.row][rowColIndices.col];
            _this.performSelection(square);
        };
        _this.solveClicked = function () {
            if (_this.props.crosswordModel.solvingMode === index_1.SolvingMode.Solving) {
                _this.props.crosswordModel.solvingMode = index_1.SolvingMode.Guessing;
            }
            else {
                _this.props.crosswordModel.solvingMode = index_1.SolvingMode.Solving;
            }
            _this.forceUpdate();
        };
        _this.globalCheatClicked = function () {
            if (_this.props.crosswordModel.solvingMode === index_1.SolvingMode.Cheating) {
                _this.props.crosswordModel.solvingMode = index_1.SolvingMode.Guessing;
            }
            else {
                _this.props.crosswordModel.solvingMode = index_1.SolvingMode.Cheating;
            }
            _this.forceUpdate();
        };
        _this.autoSolveClicked = function () {
            _this.autoSolve = !_this.autoSolve;
            _this.forceUpdate();
        };
        _this.clueSelected = function (isAcross, wordId) {
            var words = _this.props.crosswordModel.words;
            var selectedWord;
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
            _this.performSelection(firstSquare, wordSelectMode);
            //want to select it and force across/down
        };
        _this.testCommandChanged = function (evt) {
            _this.setState({ testCommand: evt.target.value });
        };
        _this.autoSolve = true;
        _this.solveExact = false;
        _this.state = { testCommand: "" };
        return _this;
    }
    CrosswordPuzzle.prototype.componentWillReceiveProps = function (nextProps) {
        this.setUpRecognition(nextProps.crosswordModel);
    };
    CrosswordPuzzle.prototype.componentDidMount = function () {
        this.setUpRecognition(this.props.crosswordModel);
    };
    CrosswordPuzzle.prototype._mapGrid = function (grid) {
        var _this = this;
        var self = this;
        var mappedGrid = grid.map(function (row, rowIndex) {
            return row.map(function (square, colIndex) {
                return {
                    identifier: { row: rowIndex, col: colIndex }, autoSolved: square.autoSolved, selected: _this.squareSelected, isSelected: square.selected, isWordSelected: square.wordSelected, solvingMode: _this.props.crosswordModel.solvingMode, number: square.number, letter: square.letter, guess: square.guess
                };
            });
        });
        return mappedGrid;
    };
    CrosswordPuzzle.prototype.recogniseSolveCommands = function (clueProviders) {
        //function getWordLengths(format: string) {
        //    var parts = format.split(",");
        //    if (parts.length === 1) {
        //        parts = format.split("-");
        //    }
        //    return parts.map(function (p) {
        //        return parseInt(p);
        //    })
        //}
        ////LP ( might only want to solve with one of the ClueProviders - cryptic or coffee time - through option pass in just the one
        //function createSolveCommands(cps: ClueProvider[], numClueProviders: number, numClues: number, isAcross: boolean): Command[] {
        //    var acrossOrDownWord = isAcross ? "across" : "down";
        //    var wordSelectMode = isAcross ? WordSelectMode.across : WordSelectMode.down;
        //    var solveCommands = [];
        //    for (var i = 0; i < numClues; i++) {
        //        var formats: string[] = [];
        //        var clueProviderSolveCommands:Command[] = [];
        //        for (var j = 0; j < numClueProviders; j++) {
        //            var cp = cps[j];
        //            var cpClues = isAcross ? cp.acrossClues : cp.downClues;
        //            var cpClue = cpClues[i];
        //            var cpFormat = cpClue.format;
        //            var clueProviderSolveCommand: SolveCommand;
        //            if (formats.indexOf(cpFormat) === -1) {
        //                formats.push(cpFormat);
        //                var wordLengths = getWordLengths(cpFormat);
        //                var regExprPrefix = "^" + solveWord + " " + "(?:" + cpClue.number + "|" + numberToNumberString(cpClue.number) + ")" + " " + acrossOrDownWord + " (?:with)?\\s?";
        //                if (self.solveExact) {
        //                    var clueSolution = getClueSolution(cpClue);
        //                    var wordMatch = wordsFromSquashedWords(clueSolution, wordLengths)
        //                    var regExprString = regExprPrefix + wordMatch + "$";
        //                    clueProviderSolveCommand = {
        //                        description: "Solve exact: " + acrossOrDownWord + " " + cpClue.number,
        //                        regExpr: new RegExp(regExprString, "i"),
        //                        callback: self.solveWordExact,
        //                        guess: clueSolution,
        //                        square: null,
        //                        acrossOrDownMode:null
        //                    } as SolveCommand;
        //                } else {
        //                    //is it necessary to group the alternation ?
        //                    var formatsPart = "(";
        //                    for (var k = 0; k < wordLengths.length; k++) {
        //                        formatsPart += "[a-z]{" + wordLengths[k] + "}"
        //                        if (k !== wordLengths.length - 1) {
        //                            formatsPart += " ";
        //                        }
        //                    }
        //                    var wordLengthRegEexp = regExprPrefix + formatsPart + ")$";
        //                    clueProviderSolveCommand = {
        //                        description: "Solve word length: " + acrossOrDownWord + " " + cpClue.number,
        //                        regExpr: new RegExp(wordLengthRegEexp, "i"),
        //                        callback: self.solveWordLength,
        //                        acrossOrDownMode: null,
        //                        square:null
        //                    }
        //                }
        //                clueProviderSolveCommand.square = cpClue.word.squares[0];
        //                clueProviderSolveCommand.acrossOrDownMode = wordSelectMode;
        //                (clueProviderSolveCommand as any)["providerName"] = cp.name;
        //                clueProviderSolveCommands.push(clueProviderSolveCommand);
        //            }
        //        }
        //        if (clueProviderSolveCommands.length > 1) {
        //            clueProviderSolveCommands.forEach(function (command) {
        //                command.description += " " + (command as any)["providerName"];
        //                solveCommands.push(command);
        //            })
        //        } else {
        //            solveCommands.push(clueProviderSolveCommands[0])
        //        }
        //    }
        //    return solveCommands;
        //}
        //var self = this;
        //var solveWord = "(?:guess|answer|solve)";
        //var numClueProviders = clueProviders.length;
        //var numAcrossClues = clueProviders[0].acrossClues.length;
        //var numDownClues = clueProviders[0].downClues.length;
        //var acrossSolveCommands = createSolveCommands(clueProviders,numClueProviders,numAcrossClues, true);
        //var downSolveCommands = createSolveCommands(clueProviders, numClueProviders,numDownClues, false);
        //this.recogniseCommands(acrossSolveCommands.concat(downSolveCommands));
    };
    CrosswordPuzzle.prototype.recogniseDefaultState = function (defaultState) {
        recogniseMe_1.recogniseMe.addStates([defaultState]);
        this.defaultState = defaultState;
    };
    CrosswordPuzzle.prototype.recogniseStates = function (states) {
        recogniseMe_1.recogniseMe.addStates(states);
        this.states = states;
    };
    CrosswordPuzzle.prototype.resetRecognition = function () {
        //this.removeCommands(); - to redo
    };
    CrosswordPuzzle.prototype.getSpellState = function () {
        var spellState = {
            name: "Spell",
            stateTimeout: 7000,
            enter: function () { console.log("Entering the spell state"); return null; },
            exit: function () { console.log("Exiting the spell state"); return null; },
            commands: [
                {
                    name: "Spell any",
                    regExp: /^((?:[a-z]+\s?)+)$/i,
                    callback: this.spellAny,
                }
            ]
        };
        return spellState;
    };
    CrosswordPuzzle.prototype.getSolveState = function () {
        var solveState = {
            name: "Solve",
            stateTimeout: 7000,
            enter: function () { console.log("Entering the solve state"); return null; },
            exit: function () { console.log("Exiting the solve state"); return null; },
            noMatch: function () { console.log("No match in the solve state"); return null; },
            commands: [
                {
                    name: "Solve any",
                    regExp: /^((?:[a-z]+\s?)+)$/i,
                    callback: this.solveAny,
                    nextState: "Default"
                }
            ]
        };
        return solveState;
    };
    CrosswordPuzzle.prototype.getDefaultState = function (cp) {
        function getNavigationDirectionRegExpr() {
            var numPart = "\\s?(";
            for (var i = 1; i < 13; i++) {
                numPart += i.toString() + "|" + numberStrings_1.numberToNumberString(i);
                if (i < 12) {
                    numPart += "|";
                }
            }
            numPart += ")?$";
            var regExprString = "^(left|right|up|down)" + numPart;
            return new RegExp(regExprString, "i");
        }
        function getWordRegExpr() {
            //1 across | one down | 2 across | two across etc
            function appendWordAlternativesForAcrossOrDownClues(clues, isAcross, command) {
                var acrossOrDown = isAcross ? "across" : "down";
                for (var i = 0; i < clues.length; i++) {
                    var clue = clues[i];
                    var clueNumber = numberStrings_1.numberToNumberString(clue.number);
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
        var clickSolveBulbCommand = {
            name: "Click solve bulb",
            regExp: /^Solve$/i,
            callback: function () {
                self.solveClicked();
                return null;
            },
            keepState: true,
        };
        var clickCheatBulbCommand = {
            name: "Click cheat bulb",
            regExp: /^cheat$/i,
            callback: function () {
                self.globalCheatClicked();
                return null;
            },
            keepState: true,
        };
        var navDirectionCommand = {
            name: "Navigation direction",
            regExp: getNavigationDirectionRegExpr(),
            callback: this.navDirectionRecognised,
            keepState: true
        };
        var navWordCommand = {
            name: "Navigation to word",
            regExp: getWordRegExpr(),
            callback: this.navWord,
            nextState: "Solve"
        };
        var spellCommand = {
            name: "Spell",
            regExp: /^Spell$/i,
            nextState: "Spell",
            callback: function () { return null; }
        };
        return {
            isDefault: true,
            name: "Default",
            enter: function () { console.log("Enter default state"); return null; },
            exit: function () { console.log("Exit default state"); return null; },
            noMatch: function () { return { sound: "sounds/family-fortunes-wrong-buzzer.mp3" }; },
            commands: [navDirectionCommand, navWordCommand, spellCommand, clickCheatBulbCommand, clickSolveBulbCommand]
        };
    };
    CrosswordPuzzle.prototype.debugResultNoMatch = function () {
        if (!this.canRecognise) {
            //if sticking with this then can type the type arg
            recogniseMe_1.recogniseMe.addCallback("resultNoMatch", function (results) {
                console.log("Result no match*************");
                results.forEach(function (result) { return console.log(result); });
                console.log("Result no match*************");
            });
        }
    };
    CrosswordPuzzle.prototype.setUpRecognition = function (crosswordModel) {
        if (recogniseMe_1.recogniseMe) {
            //this.resetRecognition();
            this.debugResultNoMatch(); //to delete later
            this.recogniseDefaultState(this.getDefaultState(crosswordModel.clueProviders[0]));
            this.recogniseStates([this.getSolveState(), this.getSpellState()]);
            recogniseMe_1.recogniseMe.setLanguage("en-GB");
            this.canRecognise = true;
            recogniseMe_1.recogniseMe.start();
        }
    };
    CrosswordPuzzle.prototype._selectWord = function (selectedWord) {
        if (this.props.crosswordModel.selectedWord !== selectedWord) {
            if (this.props.crosswordModel.selectedWord) {
                //this._setWordSquaresSelection(this.props.crosswordModel.selectedWord, false);
                this.props.crosswordModel.selectedWord.deselect();
            }
            selectedWord.select();
            this.props.crosswordModel.selectedWord = selectedWord;
        }
    };
    //the crosswordModel selectedCell property should deal with it - but interface 
    CrosswordPuzzle.prototype._selectSquare = function (square) {
        var previousSelectedSquare = this.props.crosswordModel.selectedSquare;
        if (previousSelectedSquare) {
            previousSelectedSquare.selected = false;
        }
        square.selected = true;
        this.props.crosswordModel.selectedSquare = square;
    };
    //method of square model
    CrosswordPuzzle.prototype._squareIsStartOfWord = function (square, across) {
        var word = across ? square.acrossWord : square.downWord;
        var index = word.squares.indexOf(square);
        return index === 0;
    };
    CrosswordPuzzle.prototype.performSelection = function (square, wordSelectMode) {
        if (wordSelectMode === void 0) { wordSelectMode = WordSelectMode.select; }
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
            var wordToSelect;
            if (square.acrossWord !== null && square.downWord !== null) {
                if (wordSelectMode == WordSelectMode.across) {
                    wordToSelect = square.acrossWord;
                }
                else if (wordSelectMode == WordSelectMode.down) {
                    wordToSelect = square.downWord;
                }
                else {
                    if (sameSquare) {
                        wordToSelect = this.props.crosswordModel.selectedWord == square.acrossWord ? square.downWord : square.acrossWord;
                    }
                    else {
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
            }
            else {
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
    };
    CrosswordPuzzle.prototype.arrowDownDown = function (evt) {
        evt.preventDefault();
        this.arrowDown();
    };
    CrosswordPuzzle.prototype.arrowDown = function () {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInColumn = grid.length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
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
    };
    CrosswordPuzzle.prototype.arrowLeftDown = function (evt) {
        evt.preventDefault();
        this.arrowLeft();
    };
    CrosswordPuzzle.prototype.arrowLeft = function () {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInRow = grid[0].length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
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
    };
    CrosswordPuzzle.prototype.arrowRightDown = function (evt) {
        evt.preventDefault();
        this.arrowRight();
    };
    CrosswordPuzzle.prototype.arrowRight = function () {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInRow = grid[0].length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
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
    };
    CrosswordPuzzle.prototype.arrowUpDown = function (evt) {
        evt.preventDefault();
        this.arrowUp();
    };
    CrosswordPuzzle.prototype.arrowUp = function () {
        var crosswordModel = this.props.crosswordModel;
        var selectedSquare = crosswordModel.selectedSquare;
        if (selectedSquare) {
            var grid = crosswordModel.grid;
            var numSquaresInColumn = grid.length; //instead of recalculating - props on the model
            var nextNonBlankSquare;
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
    };
    CrosswordPuzzle.prototype.backspace = function () {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            var requiresRender;
            if (selectedSquare.guess !== "") {
                selectedSquare.guess = "";
                requiresRender = true;
            }
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== 0) {
                if (selectedWord.isAcross) {
                    this.arrowLeft();
                }
                else {
                    this.arrowUp();
                }
            }
            else {
                if (requiresRender) {
                    this.forceUpdate();
                }
            }
        }
    };
    CrosswordPuzzle.prototype.keyGuess = function (event, keyValue) {
        var selectedSquare = this.props.crosswordModel.selectedSquare;
        if (selectedSquare) {
            var guess = keyValue.toUpperCase();
            var requiresRender;
            if (selectedSquare.guess !== guess) {
                selectedSquare.guess = guess;
                requiresRender = true;
            }
            var selectedWord = this.props.crosswordModel.selectedWord;
            if (selectedWord.squares.indexOf(selectedSquare) !== selectedWord.squares.length - 1) {
                if (selectedWord.isAcross) {
                    this.arrowRight();
                }
                else {
                    this.arrowDown();
                }
            }
            else {
                if (requiresRender) {
                    this.forceUpdate();
                }
            }
        }
    };
    CrosswordPuzzle.prototype.setAutoSolve = function () {
        var crosswordModel = this.props.crosswordModel;
        //given that autoSolve is unrelated to a specific crossword
        if (this.autoSolve) {
            var solvedWords = [];
            var unsolvedWords = [];
            this.props.crosswordModel.words.forEach(function (word) {
                if (word.solved()) {
                    solvedWords.push(word);
                }
                else {
                    unsolvedWords.push(word);
                }
            });
            unsolvedWords.forEach(function (word) {
                word.squares.forEach(function (square) { return square.autoSolved = false; });
            });
            solvedWords.forEach(function (word) {
                word.squares.forEach(function (square) { return square.autoSolved = true; });
            });
        }
        else {
            var grid = this.props.crosswordModel.grid;
            grid.forEach(function (row) {
                row.forEach(function (square) {
                    square.autoSolved = false;
                });
            });
        }
    };
    CrosswordPuzzle.prototype.mapClues = function (clues) {
        var crosswordModel = this.props.crosswordModel;
        var solvingMode = crosswordModel.solvingMode;
        return clues.map(function (clue) {
            var clueWord = clue.word;
            var wordSolved = clueWord.solved();
            var clueLetters = clueWord.squares.map(function (sq) {
                return {
                    guess: sq.guess,
                    letter: sq.letter,
                    autoSolved: sq.autoSolved,
                    solvingMode: solvingMode,
                    isSolved: wordSolved
                };
            });
            var clueProps = {
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
    };
    CrosswordPuzzle.prototype.render = function () {
        var _this = this;
        this.setAutoSolve();
        var squares = this._mapGrid(this.props.crosswordModel.grid);
        var mappedClueProviders = this.props.crosswordModel.clueProviders.map(function (cp) {
            return {
                name: cp.name,
                acrossClues: _this.mapClues(cp.acrossClues),
                downClues: _this.mapClues(cp.downClues)
            };
        });
        /*
        <SolveButton  isSolving={this.props.crosswordModel.solvingMode === SolvingMode.Solving} clicked={this.solveClicked} />
            <GlobalCheatButton isCheating={this.props.crosswordModel.solvingMode === SolvingMode.Cheating} clicked={this.globalCheatClicked} />
            <AutoSolveButton isAutoSolving={this.autoSolve} clicked={this.autoSolveClicked} />
        */
        var leftContent = React.createElement("div", null,
            React.createElement(crossword_1.Crossword, { squares: squares }),
            React.createElement("div", null,
                React.createElement("span", { onClick: this.globalCheatClicked },
                    React.createElement(lightbulb_1.Lightbulb, { on: this.props.crosswordModel.solvingMode === index_1.SolvingMode.Cheating, rayColour: "red", onGlowColour: "red", text: "Cheat", id: "cheatBulb", bulbOuterColour: "red", innerGlowColour: "red" })),
                React.createElement("span", { onClick: this.solveClicked },
                    React.createElement(lightbulb_1.Lightbulb, { on: this.props.crosswordModel.solvingMode === index_1.SolvingMode.Solving, rayColour: "yellow", onGlowColour: "yellow", text: "Solve", id: "solveBulb", bulbOuterColour: "yellow", innerGlowColour: "yellow" }))),
            React.createElement("input", { type: "text", onChange: this.testCommandChanged, value: this.state.testCommand }),
            React.createElement("button", { onClick: this.testCommand }, "Test command"));
        var rightContent = React.createElement(clues_1.CroswordClues, { clueSelected: this.clueSelected, grouping: true, clueProviders: mappedClueProviders });
        return React.createElement(twoCol_1.TwoCol, { leftContent: leftContent, rightContent: rightContent });
    };
    return CrosswordPuzzle;
}(React.Component));
exports.CrosswordPuzzle = CrosswordPuzzle;
var alphaKeysUpper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var alphaKeysLower = alphaKeysUpper.map(function (u) { return u.toLowerCase(); });
var alphaKeys = alphaKeysUpper.concat(alphaKeysLower);
var alphaMatches = alphaKeys.map(function (alphaKey) {
    return {
        methodName: "keyGuess",
        keyMatches: [alphaKey]
    };
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
];
var backspaceMatch = {
    methodName: "backspace",
    keyMatches: ["Backspace"]
};
var keyMatches = arrowMatches.concat(alphaMatches);
keyMatches.push(backspaceMatch);
exports.CrosswordPuzzleKeyEvents = KeyEvents.keyHandler({
    keyEventName: "keydown", keyMatches: keyMatches
})(CrosswordPuzzle);
//# sourceMappingURL=crosswordPuzzle.js.map