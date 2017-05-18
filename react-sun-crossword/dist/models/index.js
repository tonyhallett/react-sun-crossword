"use strict";
var SolvingMode;
(function (SolvingMode) {
    SolvingMode[SolvingMode["Guessing"] = 0] = "Guessing";
    SolvingMode[SolvingMode["Solving"] = 1] = "Solving";
    SolvingMode[SolvingMode["Cheating"] = 2] = "Cheating";
})(SolvingMode = exports.SolvingMode || (exports.SolvingMode = {}));
class Word {
    constructor() {
        this.squares = [];
        this.solvingMode = SolvingMode.Guessing;
    }
    _setSolvingMode(solvingMode) {
        this.squares.forEach(square => square.solvingMode = solvingMode);
        this.solvingMode = solvingMode;
    }
    solved() {
        var isSolved = true;
        for (var i = 0; i < this.squares.length; i++) {
            var square = this.squares[i];
            if (square.guess !== square.letter) {
                isSolved = false;
                break;
            }
        }
        return isSolved;
    }
    //cheat() {
    //    this._setSolvingMode(SolvingMode.Cheating);
    //}
    //uncheat() {
    //    this._setSolvingMode(SolvingMode.Guessing);
    //}
    //solve() {
    //    this._setSolvingMode(SolvingMode.Solving);
    //}
    //unsolve() {
    //    this._setSolvingMode(SolvingMode.Guessing);
    //}
    _setSelectionState(selected) {
        this.squares.forEach(square => square.wordSelected = selected);
        this.selected = selected;
    }
    select() {
        this._setSelectionState(true);
    }
    deselect() {
        this._setSelectionState(false);
    }
}
exports.Word = Word;
//# sourceMappingURL=index.js.map