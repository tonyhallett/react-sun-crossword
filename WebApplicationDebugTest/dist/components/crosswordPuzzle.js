"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var index_1 = require("../models/index");
var crossword_1 = require("./crossword");
var KeyEvents = require("../lib/key-handler");
var twoCol_1 = require("./twoCol");
var clues_1 = require("./clues");
var lightbulb_1 = require("./lightbulb");
var recogniseMe_1 = require("../helpers/recogniseMe");
var numberStrings_1 = require("../helpers/numberStrings");
var stopwatchController_1 = require("./stopwatchController");
var expandableKeyboard_1 = require("./expandableKeyboard");
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
        //#region recognition
        //#region recognition callbacks
        _this.solveAny = function (context) {
            var self = _this;
            var clueSolution = context.stateContext.clueSolution.toLowerCase();
            var guess = context.parameters[0];
            var guessWords = guess.split(" ");
            var solutionGuess = "";
            for (var i = 0; i < guessWords.length; i++) {
                solutionGuess += guessWords[i].toLowerCase();
            }
            var response;
            if (clueSolution === solutionGuess) {
                var startingSquare = _this.props.crosswordModel.selectedSquare;
                var speechUndo = {
                    startingSquare: startingSquare,
                    wordSelectMode: _this.props.crosswordModel.selectedWord.isAcross ? WordSelectMode.across : WordSelectMode.down,
                    originalGuesses: [startingSquare.guess]
                };
                var letters = clueSolution.split("");
                var numLetters = letters.length;
                for (var i = 0; i < numLetters; i++) {
                    var letter = letters[i];
                    self.keyGuess(letter);
                    if (i < numLetters - 1) {
                        speechUndo.originalGuesses.push(_this.props.crosswordModel.selectedSquare.guess);
                    }
                }
                _this.speechUndos.push(speechUndo);
                response = {
                    sound: "assets/sounds/small-bell-ring.mp3"
                };
            }
            else {
                response = {
                    sound: "assets/sounds/family-fortunes-wrong-buzzer.mp3"
                };
            }
            return response;
        };
        _this.solution = function (context) {
            var response = {
                synthesisMessage: context.stateContext.clueSolution
            };
            return response;
        };
        _this.clues = function (context) {
            function getClueFormatSynthesis(format) {
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
            function getClueProviderSynthesis(clueProviderClue, useClueProviderName) {
                var synthesis = useClueProviderName ? clueProviderClue.providerName + ".  " : "";
                synthesis += clueProviderClue.clue + ".  " + getClueFormatSynthesis(clueProviderClue.format) + ".  ";
                return synthesis;
            }
            var synthesisMessage;
            var wordContext = context.stateContext;
            var cluesOrSpecificProvider = context.parameters[0].toLowerCase();
            var clueProviderClues = wordContext.clueProviderClues;
            if (cluesOrSpecificProvider === "clues") {
                var clueProvidersSynthesisMessage = "";
                for (var i = 0; i < clueProviderClues.length; i++) {
                    var clueProviderClue = clueProviderClues[i];
                    clueProvidersSynthesisMessage += getClueProviderSynthesis(clueProviderClue, true);
                }
                synthesisMessage = clueProvidersSynthesisMessage;
            }
            else {
                for (var i = 0; i < clueProviderClues.length; i++) {
                    var clueProviderClue = clueProviderClues[i];
                    if (clueProviderClue.providerName.toLowerCase() === cluesOrSpecificProvider) {
                        synthesisMessage = getClueProviderSynthesis(clueProviderClue, false);
                        break;
                    }
                }
            }
            var response = {
                synthesisMessage: synthesisMessage
            };
            return response;
        };
        _this.letters = function (context) {
            var wordContext = context.stateContext;
            var squares = wordContext.squares;
            var lettersSynthesis = "";
            var speakWord = false; //probably will not change as if incorrect and garbage then as a word cannot be understood.  if decide to speak when correct then giving the game away
            var wordSynthesis = "";
            var emptySynthesis = "Word is empty.";
            var numEmptySquares = 0;
            var emptySquareSynthesis = "something";
            var synthesisMessage;
            var numSquares = squares.length;
            for (var i = 0; i < numSquares; i++) {
                var squareGuess = squares[i].guess.toLowerCase();
                var squareIsEmpty = squareGuess === "";
                var letter = squareGuess;
                if (squareIsEmpty) {
                    letter = emptySquareSynthesis;
                    numEmptySquares++;
                }
                else {
                    //of course this letter replacement may not be necessary with other voices......
                    letter = squareGuess === "a" ? "eh" : squareGuess;
                }
                wordSynthesis += squareGuess;
                lettersSynthesis += " " + letter + ". ";
            }
            if (numEmptySquares === numSquares) {
                synthesisMessage = emptySynthesis;
            }
            else {
                if (numEmptySquares === 0 && speakWord) {
                    synthesisMessage = wordSynthesis;
                }
                else {
                    synthesisMessage = lettersSynthesis;
                }
            }
            return { synthesisMessage: synthesisMessage };
        };
        _this.clueProviders = function (context) {
            var cps = _this.props.crosswordModel.clueProviders;
            var synthesisMesssage = "";
            for (var i = 0; i < cps.length; i++) {
                if (i !== 0) {
                    synthesisMesssage += ", ";
                }
                synthesisMesssage += cps[i].name;
            }
            return {
                synthesisMessage: synthesisMesssage
            };
        };
        //unsolved and incomplete can be refactored
        _this.unsolvedRecognised = function (context) {
            var cw = _this.props.crosswordModel;
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
                    }
                    else {
                        synthesis = "Across. " + acrossClue.number + " ";
                    }
                    hasUnsolvedAcrossClues = true;
                }
            }
            if (hasUnsolvedAcrossClues) {
                synthesis += ".  ";
            }
            var hasUnsolvedDownClues = false;
            for (var i = 0; i < cp.downClues.length; i++) {
                var downClue = cp.downClues[i];
                var word = downClue.word;
                var unsolved = !word.solved();
                if (unsolved) {
                    if (hasUnsolvedDownClues) {
                        synthesis += ", " + downClue.number;
                    }
                    else {
                        synthesis += "Down: " + downClue.number;
                    }
                    hasUnsolvedDownClues = true;
                }
            }
            if (hasUnsolvedAcrossClues || hasUnsolvedDownClues) {
                synthesis = "Unsolved words.  " + synthesis;
            }
            else {
                synthesis = "Crossword is solved";
            }
            var response = {
                synthesisMessage: synthesis,
                canInterrupt: true
            };
            return response;
        };
        _this.incompleteRecognised = function (context) {
            var cw = _this.props.crosswordModel;
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
                    }
                    else {
                        synthesis = "Across. " + acrossClue.number + " ";
                    }
                    hasIncompleteAcrossClues = true;
                }
            }
            if (hasIncompleteAcrossClues) {
                synthesis += ".  ";
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
                    }
                    else {
                        synthesis += "Down: " + downClue.number;
                    }
                    hasIncompleteDownClues = true;
                }
            }
            if (hasIncompleteAcrossClues || hasIncompleteDownClues) {
                synthesis = "Incomplete words.  " + synthesis;
            }
            else {
                synthesis = "Crossword is solved";
            }
            var response = {
                synthesisMessage: synthesis,
                canInterrupt: true
            };
            return response;
        };
        _this.navDirectionRecognised = function (context) {
            var synthesisMessage = "No selected square to navigate from.";
            if (_this.props.crosswordModel.selectedSquare) {
                var direction = context.parameters[0].toLowerCase();
                var numNavs = 1;
                var numPart = context.parameters[1];
                var numPartMessage = numPart === undefined ? "" : numPart;
                synthesisMessage = direction + " " + numPartMessage;
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
                //should extract to a get letter speech method
                var currentSquareSpeech = _this.props.crosswordModel.selectedSquare.guess.toLowerCase();
                currentSquareSpeech = currentSquareSpeech === "a" ? "eh" : currentSquareSpeech;
                var blankSquareSpeech = "blank";
                if (currentSquareSpeech === "") {
                    currentSquareSpeech = blankSquareSpeech;
                }
                synthesisMessage += " : " + currentSquareSpeech;
            }
            var response = {
                synthesisMessage: synthesisMessage
            };
            return response;
        };
        _this.spellAny = function (context) {
            var self = _this;
            var startingSquare = _this.props.crosswordModel.selectedSquare;
            var synthesisMessage = "No selected square";
            if (startingSquare) {
                var words = context.parameters[0].toLowerCase();
                var startingSquareGuess = startingSquare.guess;
                var originalGuesses;
                var selectedWordIsAcross = _this.props.crosswordModel.selectedWord.isAcross;
                var wordSelectMode = selectedWordIsAcross ? WordSelectMode.across : WordSelectMode.down;
                if (words === "delete") {
                    originalGuesses = [startingSquareGuess];
                    synthesisMessage = "deleted";
                    self.backspace();
                }
                else {
                    var phonetics = words.split(" ");
                    synthesisMessage = "";
                    originalGuesses = [startingSquareGuess];
                    for (var i = 0; i < phonetics.length; i++) {
                        var word = phonetics[i];
                        var letter = word.split("")[0];
                        self.keyGuess(letter);
                        if (i < phonetics.length - 1) {
                            originalGuesses.push(_this.props.crosswordModel.selectedSquare.guess);
                        }
                        letter = letter === "a" ? "eh" : letter;
                        synthesisMessage += letter + " ";
                    }
                }
                _this.speechUndos.push({
                    originalGuesses: originalGuesses,
                    startingSquare: startingSquare,
                    wordSelectMode: wordSelectMode
                });
            }
            return {
                synthesisMessage: synthesisMessage
            };
        };
        _this.undo = function (context) {
            var self = _this;
            var synthesisMessage = "No speech to undo";
            if (_this.speechUndos.length > 0) {
                synthesisMessage = "Undone";
                var numUndos = _this.speechUndos.length;
                var speechUndo = _this.speechUndos[numUndos - 1];
                _this.speechUndos = _this.speechUndos.slice(0, numUndos - 1);
                _this.performSelection(speechUndo.startingSquare, speechUndo.wordSelectMode);
                speechUndo.originalGuesses.forEach(function (originalGuess) {
                    self.keyGuess(originalGuess);
                });
            }
            return {
                synthesisMessage: synthesisMessage
            };
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
            var numString = number.toString();
            var isAcross = acrossOrDown == "across" ? true : false;
            var wordSelectMode = isAcross ? WordSelectMode.across : WordSelectMode.down;
            var clueProviders = _this.props.crosswordModel.clueProviders;
            var clueProviderClues = [];
            var cp = clueProviders[0];
            var clues = cp.downClues;
            if (isAcross) {
                clues = cp.acrossClues;
            }
            var clueIndex;
            var startSquare;
            var clueSolution;
            var squares;
            for (var i = 0; i < clues.length; i++) {
                var clue = clues[i];
                if (clue.number === numString) {
                    clueSolution = index_1.getClueSolution(clue);
                    squares = clue.word.squares;
                    startSquare = squares[0];
                    clueIndex = i;
                    clueProviderClues.push({ clue: clue.text, format: clue.format, providerName: cp.name });
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
            _this.performSelection(startSquare, wordSelectMode);
            var wordStateContext = {
                clueSolution: clueSolution,
                identifier: numString + " " + acrossOrDown,
                clueProviderClues: clueProviderClues,
                squares: squares
            };
            var response = {
                nextStateContext: wordStateContext
            };
            return response;
        };
        //#endregion
        //#endregion
        //#region selection
        _this.squareSelected = function (rowColIndices) {
            var square = _this.props.crosswordModel.grid[rowColIndices.row][rowColIndices.col];
            _this.performSelection(square);
        };
        _this.autoSolveClicked = function () {
            _this.autoSolve = !_this.autoSolve;
            _this.forceUpdate();
        };
        //#endregion
        //#region SolvingMode Guessing/Solving/Cheating
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
        //#endregion
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
        _this.autoSolve = true;
        _this.solveExact = false;
        _this.state = { testCommand: "" };
        _this.keyGuess = _this.keyGuess.bind(_this);
        _this.backspace = _this.backspace.bind(_this);
        return _this;
    }
    CrosswordPuzzle.prototype.componentWillReceiveProps = function (nextProps) {
        this.initialize(nextProps);
    };
    CrosswordPuzzle.prototype.componentWillMount = function () {
        this.initialize(this.props);
    };
    CrosswordPuzzle.prototype.initialize = function (props) {
        var crosswordModel = props.crosswordModel;
        var crosswordHasGuesses = false;
        var words = crosswordModel.words;
        for (var i = 0; i < words.length; i++) {
            var squares = words[i].squares;
            var squareHasGuess = false;
            for (var j = 0; j < squares.length; j++) {
                var square = squares[j];
                if (square.guess && square.guess != "") {
                    squareHasGuess = true;
                    break;
                }
            }
            if (squareHasGuess) {
                crosswordHasGuesses = true;
                break;
            }
        }
        console.log("crossword has guesses: " + crosswordHasGuesses);
        this.ensureSelectedSquare(crosswordModel);
        //this.setUpRecognition(crosswordModel);
    };
    CrosswordPuzzle.prototype.ensureSelectedSquare = function (crosswordModel) {
        if (!crosswordModel.selectedSquare) {
            var firstWord = crosswordModel.words[0];
            crosswordModel.selectWord(firstWord);
            crosswordModel.selectSquare(firstWord.squares[0]);
        }
    };
    //#endregion   
    //#region setup
    //#region get command states
    CrosswordPuzzle.prototype.getDefaultState = function (acrossClues, downClues) {
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
            navWordCommandString = appendWordAlternativesForAcrossOrDownClues(acrossClues, true, navWordCommandString);
            navWordCommandString += "|";
            navWordCommandString = appendWordAlternativesForAcrossOrDownClues(downClues, false, navWordCommandString);
            navWordCommandString += ")$";
            return new RegExp(navWordCommandString, "i");
        }
        var self = this;
        var testInterruptCommand = {
            name: "Test interrupt",
            regExp: /^Interrupt$/i,
            callback: function () {
                var response = {
                    canInterrupt: true,
                    sound: "assets/sounds/To_Interrupt.mp3"
                };
                return response;
            }
        };
        var testCannotInterruptCommand = {
            name: "Test interrupt",
            regExp: /^Listen$/i,
            callback: function () {
                var response = {
                    canInterrupt: false,
                    sound: "assets/sounds/Cannot_be_interrupted.mp3"
                };
                return response;
            }
        };
        var solveCommand = {
            name: "Click solve bulb",
            regExp: /^Solve$/i,
            callback: function () {
                self.solveClicked();
                return null;
            },
            keepState: true,
        };
        var cheatCommand = {
            name: "Click cheat bulb",
            regExp: /^cheat$/i,
            callback: function () {
                self.globalCheatClicked();
                return null;
            },
            keepState: true,
        };
        var navWordCommand = {
            name: "Navigation to word",
            regExp: getWordRegExpr(),
            callback: this.navWord,
            nextState: "Word"
        };
        var spellCommand = {
            name: "Spell",
            regExp: /^Spell$/i,
            nextState: "Spell",
            callback: function () { return null; }
        };
        var detailsCommand = {
            name: "Crossword details",
            regExp: /^details$/i,
            callback: function () {
                return null;
            },
            nextState: "Details"
        };
        var undoCommand = {
            name: "Undo",
            regExp: /^undo$/i,
            callback: this.undo
        };
        //testInterruptCommand, testCannotInterruptCommand,
        //
        return {
            isDefault: true,
            name: "Default",
            enter: function () { return { sound: "assets/sounds/default-state.mp3" }; },
            exit: function () { console.log("Exit default state"); return null; },
            commands: [navWordCommand, detailsCommand, spellCommand, undoCommand, cheatCommand, solveCommand]
        };
    };
    CrosswordPuzzle.prototype.getWordState = function (clueProviders) {
        var self = this;
        var cluesRegExprString = "^(Clues";
        for (var i = 0; i < clueProviders.length; i++) {
            cluesRegExprString += "|" + clueProviders[i].name;
        }
        cluesRegExprString += ")$";
        var wordState = {
            name: "Word",
            enter: function (wordContext) {
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
                regExp: recogniseMe_1.sentenceRegExp,
                callback: this.solveAny,
                nextState: "Default"
            }
        };
        return wordState;
    };
    CrosswordPuzzle.prototype.getDetailsState = function () {
        var state = {
            name: "Details",
            enter: function () {
                console.log("Enter details state");
                var soundResponse = {
                    synthesisMessage: "Details"
                };
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
        };
        return state;
    };
    CrosswordPuzzle.prototype.getSpellState = function () {
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
        var navDirectionCommand = {
            name: "Navigation direction",
            regExp: getNavigationDirectionRegExpr(),
            callback: this.navDirectionRecognised,
            keepState: true
        };
        var spellState = {
            name: "Spell",
            enter: function () { console.log("Entering the spell state"); return { synthesisMessage: "Spelling" }; },
            exit: function () { console.log("Exiting the spell state"); return null; },
            commands: [
                navDirectionCommand
            ],
            catchCommand: {
                name: "Spell or delete",
                regExp: recogniseMe_1.sentenceRegExp,
                callback: this.spellAny,
            }
        };
        return spellState;
    };
    //#endregion
    CrosswordPuzzle.prototype.setUpRecognition = function (crosswordModel) {
        if (recogniseMe_1.recogniseMe) {
            this.speechUndos = [];
            var clueProviders = crosswordModel.clueProviders;
            recogniseMe_1.recogniseMe.removeStates();
            //spellState navigation command is assuming that the crossword is 13*13 ( which it currently will always be) - later let this be dynamic based upon the crossword
            recogniseMe_1.recogniseMe.addStates([this.getDefaultState(clueProviders[0].acrossClues, clueProviders[0].downClues), this.getWordState(clueProviders), this.getSpellState(), this.getDetailsState()]);
            if (!this.recognising) {
                recogniseMe_1.recogniseMe.allStatesNoMatchSoundResponse = { synthesisMessage: "I did not get that." };
                recogniseMe_1.recogniseMe.setSkipSpeakingCommand("quiet please");
                recogniseMe_1.recogniseMe.setLanguage("en-GB");
                recogniseMe_1.recogniseMe.setStartStopCommands({ defaultStartStopPhrases: true, defaultStartStopSynthesis: true });
                recogniseMe_1.recogniseMe.start();
                this.recognising = true;
            }
        }
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
                this.props.crosswordModel.selectSquare(square);
                requiresRender = true;
            }
            var wordToSelect;
            if (square.acrossWord && square.downWord) {
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
                                if (square.isStartOfWord(false)) {
                                    if (!square.isStartOfWord(true)) {
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
                this.props.crosswordModel.selectWord(wordToSelect);
                requiresRender = true;
            }
        }
        if (requiresRender) {
            this.forceUpdate();
        }
    };
    //#endregion
    //#region arrow navigation
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
    //#endregion
    //#region key press callbacks
    CrosswordPuzzle.prototype.arrowDownDown = function (evt) {
        evt.preventDefault();
        this.arrowDown();
    };
    CrosswordPuzzle.prototype.arrowLeftDown = function (evt) {
        evt.preventDefault();
        this.arrowLeft();
    };
    CrosswordPuzzle.prototype.arrowRightDown = function (evt) {
        evt.preventDefault();
        this.arrowRight();
    };
    CrosswordPuzzle.prototype.arrowUpDown = function (evt) {
        evt.preventDefault();
        this.arrowUp();
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
    CrosswordPuzzle.prototype.keyGuess = function (keyValue) {
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
    CrosswordPuzzle.prototype.keyGuessEvent = function (event, keyValue) {
        this.keyGuess(keyValue);
    };
    //#endregion
    //#region auto solving
    CrosswordPuzzle.prototype.setAutoSolve = function () {
        var crosswordModel = this.props.crosswordModel;
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
    //#region model mapping for rendered child components
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
    //#endregion
    CrosswordPuzzle.prototype.render = function () {
        var _this = this;
        this.setAutoSolve();
        var squares = this._mapGrid(this.props.crosswordModel.grid);
        /*
        
            <AutoSolveButton isAutoSolving={this.autoSolve} clicked={this.autoSolveClicked} />
        */
        var leftContent = React.createElement("div", null,
            React.createElement(crossword_1.Crossword, { squares: squares }),
            React.createElement("div", null,
                React.createElement("span", { onClick: this.globalCheatClicked },
                    React.createElement(lightbulb_1.Lightbulb, { on: this.props.crosswordModel.solvingMode === index_1.SolvingMode.Cheating, rayColour: "red", onGlowColour: "red", text: "Cheat", id: "cheatBulb", bulbOuterColour: "red", innerGlowColour: "red" })),
                React.createElement("span", { onClick: this.solveClicked },
                    React.createElement(lightbulb_1.Lightbulb, { on: this.props.crosswordModel.solvingMode === index_1.SolvingMode.Solving, rayColour: "yellow", onGlowColour: "yellow", text: "Solve", id: "solveBulb", bulbOuterColour: "yellow", innerGlowColour: "yellow" })),
                React.createElement(stopwatchController_1.FlipClock24, { shouldUpdateSameDuration: false, startDuration: this.props.crosswordModel.duration }),
                React.createElement(expandableKeyboard_1.ExpandableKeyboard, { keyboardColour: "gray", buttonBackgroundColour: "orange", backspacePressed: this.backspace, keyPressed: this.keyGuess })));
        var mappedClueProviders = this.props.crosswordModel.clueProviders.map(function (cp) {
            return {
                name: cp.name,
                acrossClues: _this.mapClues(cp.acrossClues),
                downClues: _this.mapClues(cp.downClues)
            };
        });
        var rightContent = React.createElement(clues_1.CroswordClues, { clueSelected: this.clueSelected, grouping: true, clueProviders: mappedClueProviders });
        return React.createElement(twoCol_1.TwoCol, { leftContent: leftContent, rightContent: rightContent });
    };
    return CrosswordPuzzle;
}(React.Component));
exports.CrosswordPuzzle = CrosswordPuzzle;
// #region HOC keyevents for CrosswordPuzzle
var alphaKeysUpper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var alphaKeysLower = alphaKeysUpper.map(function (u) { return u.toLowerCase(); });
var alphaKeys = alphaKeysUpper.concat(alphaKeysLower);
var alphaMatches = alphaKeys.map(function (alphaKey) {
    return {
        methodName: "keyGuessEvent",
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
//#endregion
//# sourceMappingURL=crosswordPuzzle.js.map