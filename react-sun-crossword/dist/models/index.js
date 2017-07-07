"use strict";
var SolvingMode;
(function (SolvingMode) {
    SolvingMode[SolvingMode["Guessing"] = 0] = "Guessing";
    SolvingMode[SolvingMode["Solving"] = 1] = "Solving";
    SolvingMode[SolvingMode["Cheating"] = 2] = "Cheating";
})(SolvingMode = exports.SolvingMode || (exports.SolvingMode = {}));
var Word = (function () {
    function Word() {
        this.squares = [];
    }
    Word.prototype._setSolvingMode = function (solvingMode) {
        this.squares.forEach(function (square) { return square.solvingMode = solvingMode; });
        this.solvingMode = solvingMode;
    };
    Word.prototype.solved = function () {
        var isSolved = true;
        for (var i = 0; i < this.squares.length; i++) {
            var square = this.squares[i];
            if (square.guess !== square.letter) {
                isSolved = false;
                break;
            }
        }
        return isSolved;
    };
    Word.prototype._setSelectionState = function (selected) {
        this.squares.forEach(function (square) { return square.wordSelected = selected; });
        this.selected = selected;
    };
    Word.prototype.select = function () {
        this._setSelectionState(true);
    };
    Word.prototype.deselect = function () {
        this._setSelectionState(false);
    };
    return Word;
}());
exports.Word = Word;
function ConvertCrosswordModelToJson(crosswordModel) {
    //dates different types
    var grid = crosswordModel.grid.map(function (row) {
        return row.map(function (square) {
            var jsonSquare = {
                autoSolved: square.autoSolved,
                guess: square.guess,
                letter: square.letter,
                number: square.number,
                selected: square.selected,
                wordSelected: square.wordSelected,
                solvingMode: square.solvingMode
            };
            return jsonSquare;
        });
    });
    var words = crosswordModel.words.map(function (word) {
        var jsonWord = {
            id: word.id,
            isAcross: word.isAcross,
            selected: word.selected,
            solvingMode: word.solvingMode,
            length: word.length,
            x: word.x,
            y: word.y
        };
        return jsonWord;
    });
    function mapClues(clues) {
        return clues.map(function (clue) {
            var jsonClue = {
                format: clue.format,
                number: clue.number,
                text: clue.text,
                wordId: clue.wordId
            };
            return jsonClue;
        });
    }
    var clueProviders = crosswordModel.clueProviders.map(function (cp) {
        var jsonClueProvider = {
            name: cp.name,
            acrossClues: mapClues(cp.acrossClues),
            downClues: mapClues(cp.downClues)
        };
        return jsonClueProvider;
    });
    var crosswordModelJson = {
        datePublished: crosswordModel.datePublished.toString(),
        dateStarted: crosswordModel.dateStarted.toString(),
        duration: crosswordModel.duration,
        id: crosswordModel.id,
        solvingMode: crosswordModel.solvingMode,
        title: crosswordModel.title,
        grid: grid,
        words: words,
        clueProviders: clueProviders
    };
    return crosswordModelJson;
}
exports.ConvertCrosswordModelToJson = ConvertCrosswordModelToJson;
function ConvertCrosswordJsonToModel(crosswordJson) {
    var dateStarted = crosswordJson.dateStarted ? new Date(crosswordJson.dateStarted) : null;
    var crosswordModel = {
        dateStarted: dateStarted,
        duration: crosswordJson.duration,
        id: crosswordJson.id,
        datePublished: new Date(crosswordJson.datePublished),
        title: crosswordJson.title,
        selectedSquare: null,
        selectedWord: null,
        solvingMode: crosswordJson.solvingMode,
        words: null,
        clueProviders: null,
        grid: null
    };
    var selectedSquare = null;
    var grid = crosswordJson.grid.map(function (row, rowIndex) {
        return row.map(function (square, columnIndex) {
            var crosswordSquare = {
                autoSolved: square.autoSolved,
                columnIndex: columnIndex,
                rowIndex: rowIndex,
                acrossWord: null,
                downWord: null,
                guess: square.guess,
                letter: square.letter,
                number: square.number,
                selected: square.selected,
                wordSelected: square.wordSelected,
                solvingMode: SolvingMode.Guessing
            };
            if (crosswordSquare.selected) {
                selectedSquare = crosswordSquare;
            }
            return crosswordSquare;
        });
    });
    var selectedWord = null;
    var crosswordWords = crosswordJson.words.map(function (jsonWord) {
        var word = new Word();
        word.id = jsonWord.id;
        word.isAcross = jsonWord.isAcross;
        word.length = jsonWord.length;
        word.selected = jsonWord.selected;
        if (word.selected) {
            selectedWord = word;
        }
        word.solvingMode = jsonWord.solvingMode;
        word.x = jsonWord.x;
        word.y = jsonWord.y;
        var x = word.x;
        var y = word.y;
        for (var i = 0; i < word.length; i++) {
            var crosswordSquare = grid[y - 1][x - 1];
            word.squares.push(crosswordSquare);
            if (word.isAcross) {
                crosswordSquare.acrossWord = word;
                x = x + 1;
            }
            else {
                crosswordSquare.downWord = word;
                y = y + 1;
            }
        }
        return word;
    });
    crosswordModel.words = crosswordWords;
    crosswordModel.selectedWord = selectedWord;
    crosswordModel.selectedSquare = selectedSquare;
    crosswordModel.grid = grid;
    function findWord(wordId) {
        var word;
        for (var i = 0; i < crosswordWords.length; i++) {
            word = crosswordWords[i];
            if (word.id === wordId) {
                break;
            }
        }
        return word;
    }
    function mapClues(clues) {
        return clues.map(function (jsonClue) {
            var clue = {
                format: jsonClue.format,
                number: jsonClue.number,
                text: jsonClue.text,
                wordId: jsonClue.wordId,
                word: findWord(jsonClue.wordId)
            };
            return clue;
        });
    }
    crosswordModel.clueProviders = crosswordJson.clueProviders.map(function (cp) {
        return {
            name: cp.name,
            acrossClues: mapClues(cp.acrossClues),
            downClues: mapClues(cp.downClues)
        };
    });
    //console.log(crosswordModel);
    return crosswordModel;
}
exports.ConvertCrosswordJsonToModel = ConvertCrosswordJsonToModel;
function getClueSolution(clue) {
    var clueSolution = "";
    var squares = clue.word.squares;
    squares.forEach(function (sq) {
        clueSolution += sq.letter;
    });
    return clueSolution;
}
exports.getClueSolution = getClueSolution;
//# sourceMappingURL=index.js.map