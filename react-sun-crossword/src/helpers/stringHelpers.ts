export function wordsFromSquashedWords(squashedWord: string, wordLengths: number[], delimiter = " "): string {
    var words = "";
    var numWords = wordLengths.length;
    var start = 0;
    for (var i = 0; i < numWords; i++) {
        var wordLength = wordLengths[i];
        var word = squashedWord.substr(start, wordLength);
        if (i !== numWords - 1) {
            word += word;
        }
        words+= word;
        start += wordLength;
    }
    return words;
}