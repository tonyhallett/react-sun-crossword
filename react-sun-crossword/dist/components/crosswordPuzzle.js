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
        _this.autoSolve = true;
        return _this;
    }
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
    CrosswordPuzzle.prototype.componentWillReceiveProps = function (nextProps) {
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
                    React.createElement(lightbulb_1.Lightbulb, { on: this.props.crosswordModel.solvingMode === index_1.SolvingMode.Solving, rayColour: "yellow", onGlowColour: "yellow", text: "Solve", id: "solveBulb", bulbOuterColour: "yellow", innerGlowColour: "yellow" }))));
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