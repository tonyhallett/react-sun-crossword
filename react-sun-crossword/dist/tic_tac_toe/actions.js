"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOARD_HIT_TEST = "Board_Hit_Test";
function boardHitTest(x, y) {
    return {
        type: exports.BOARD_HIT_TEST,
        x: x,
        y: y
    };
}
exports.boardHitTest = boardHitTest;
exports.BOARD_HIT_TEST_RESULT = "Board_Hit_Test_Result";
function boardHitTestResult(hit, row, column) {
    return {
        type: exports.BOARD_HIT_TEST_RESULT,
        hit: hit,
        row: row,
        column: column
    };
}
exports.boardHitTestResult = boardHitTestResult;
exports.Finished_Confirmed = "FINISHED_CONFIRMED";
exports.Play_Again = "PLAY_AGAIN";
exports.Take_Go = "TAKE_GO";
exports.Arrow_Press = "ARROW_PRESS";
var ArrowDirection;
(function (ArrowDirection) {
    ArrowDirection[ArrowDirection["Up"] = 0] = "Up";
    ArrowDirection[ArrowDirection["Down"] = 1] = "Down";
    ArrowDirection[ArrowDirection["Left"] = 2] = "Left";
    ArrowDirection[ArrowDirection["Right"] = 3] = "Right";
})(ArrowDirection = exports.ArrowDirection || (exports.ArrowDirection = {}));
function arrowPressed(direction) {
    return {
        type: exports.Arrow_Press,
        direction: direction
    };
}
exports.arrowPressed = arrowPressed;
function finishedConfirmed() {
    return {
        type: exports.Finished_Confirmed
    };
}
exports.finishedConfirmed = finishedConfirmed;
function playAgain() {
    return {
        type: exports.Play_Again
    };
}
exports.playAgain = playAgain;
function takeGo(row, column) {
    return {
        type: exports.Take_Go,
        row: row,
        column: column
    };
}
exports.takeGo = takeGo;
//# sourceMappingURL=actions.js.map