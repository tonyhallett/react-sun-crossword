export const player = "Player";
export const won = "Won";
export const lost = "Lost";
export const drawn = "Drawn";
export const playAgainText = "Play again"
export const nought = "O";
export const cross = "X";
export const gameDrawn = "Game drawn";
export const wonMessage = won + " !";

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
var toOptimise = [player, won, lost, drawn, playAgainText, nought, cross, gameDrawn].concat(numbers);
var fontLetters = "";
toOptimise.forEach(word => {
    for (var i = 0; i < word.length; i++) {
        var letter = word[i];
        if (letter !== " ") {
            if (fontLetters.indexOf(letter) === -1) {
                fontLetters += letter;
            }
        }

    }
})
export const letters = fontLetters;