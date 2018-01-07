"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = "Player";
exports.won = "Won";
exports.lost = "Lost";
exports.drawn = "Drawn";
exports.playAgainText = "Play again";
exports.nought = "O";
exports.cross = "X";
exports.gameDrawn = "Game drawn";
exports.wonMessage = exports.won + " !";
var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var toOptimise = [exports.player, exports.won, exports.lost, exports.drawn, exports.playAgainText, exports.nought, exports.cross, exports.gameDrawn].concat(numbers);
var fontLetters = "";
toOptimise.forEach(function (word) {
    for (var i = 0; i < word.length; i++) {
        var letter = word[i];
        if (letter !== " ") {
            if (fontLetters.indexOf(letter) === -1) {
                fontLetters += letter;
            }
        }
    }
});
exports.letters = fontLetters;
//# sourceMappingURL=textStrings.js.map