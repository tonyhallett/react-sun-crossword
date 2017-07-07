"use strict";
function wordsFromSquashedWords(squashedWord, wordLengths, delimiter) {
    if (delimiter === void 0) { delimiter = " "; }
    var words = "";
    var numWords = wordLengths.length;
    var start = 0;
    for (var i = 0; i < numWords; i++) {
        var wordLength = wordLengths[i];
        var word = squashedWord.substr(start, wordLength);
        if (i !== numWords - 1) {
            word += word;
        }
        words += word;
        start += wordLength;
    }
    return words;
}
exports.wordsFromSquashedWords = wordsFromSquashedWords;
//# sourceMappingURL=stringHelpers.js.map