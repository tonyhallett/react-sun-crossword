"use strict";
//it will only be necessary to read this the once - after that will be working from IndexedDbModelProvider or JsonModelProvider
const Crossword = require("../models/index");
function ModelFromJson(json) {
    var grid = json.data.grid.map((row, rowIndex) => {
        return row.map((square, columnIndex) => {
            var crosswordSquare = { columnIndex: columnIndex, rowIndex: rowIndex, acrossWord: null, downWord: null, guess: "", letter: square.Letter, number: square.Number, selected: false, wordSelected: false, solvingMode: Crossword.SolvingMode.Guessing };
            return crosswordSquare;
        });
    });
    var crosswordWords = json.data.copy.words.map(word => {
        var isAcross = true;
        var lengthEnd;
        //"2-12", means starts on 2 finishes on 12 - length = 12-1+1
        var xParts = word.x.split("-"); //*************** X is columns
        var yParts = word.y.split("-"); //*************** Y is rows
        var x = parseInt(xParts[0]); //lowest is 1
        var start = x;
        var y = parseInt(yParts[0]);
        var lengthParts = xParts;
        if (yParts.length == 2) {
            lengthParts = yParts;
            isAcross = false;
            start = y;
        }
        lengthEnd = parseInt(lengthParts[1]);
        var length = lengthEnd - start + 1;
        var crosswordWord = new Crossword.Word();
        crosswordWord.isAcross = isAcross;
        crosswordWord.id = word.id;
        for (var i = 0; i < length; i++) {
            var crosswordSquare = grid[y - 1][x - 1];
            crosswordWord.squares.push(crosswordSquare);
            if (isAcross) {
                crosswordSquare.acrossWord = crosswordWord;
                x = x + 1;
            }
            else {
                crosswordSquare.downWord = crosswordWord;
                y = y + 1;
            }
        }
        return crosswordWord;
    });
    //at the moment it is {"name": "Cryptic","title": "Across",..} , {"name": "Cryptic", "title": "Down",..}, {"name": "Coffee time","title": "Across",},{"name": "Coffee time","title": "Down",}
    var sunCluesByProviderAndDirection = json.data.copy.clues;
    function findCrossword(id) {
        var crossword;
        for (var i = 0; i < crosswordWords.length; i++) {
            var cw = crosswordWords[i];
            if (cw.id === id) {
                crossword = cw;
                break;
            }
        }
        return crossword;
    }
    function mapClues(clues) {
        return clues.map(clue => {
            var crosswordClue = {
                format: clue.format,
                text: clue.clue,
                word: findCrossword(clue.word)
            };
            return crosswordClue;
        });
    }
    //for simplicity...
    var crosswordModel = {
        grid: grid,
        clueProviders: [{ name: "Cryptic", acrossClues: mapClues(sunCluesByProviderAndDirection[0].clues), downClues: mapClues(sunCluesByProviderAndDirection[1].clues) },
            { name: "Coffee time", acrossClues: mapClues(sunCluesByProviderAndDirection[2].clues), downClues: mapClues(sunCluesByProviderAndDirection[3].clues) }
        ]
    };
    return crosswordModel;
}
exports.ModelFromJson = ModelFromJson;
//# sourceMappingURL=SunCrosswordModelProvider.js.map