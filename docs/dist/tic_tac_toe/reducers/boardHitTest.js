"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
function boardHitTestReducer(state, action) {
    if (state === void 0) { state = { request: null, result: null }; }
    switch (action.type) {
        case actions_1.BOARD_HIT_TEST:
            return {
                request: {
                    x: action.x,
                    y: action.y
                },
                result: state.result
            };
        case actions_1.BOARD_HIT_TEST_RESULT:
            return {
                request: state.request,
                result: {
                    hit: action.hit,
                    row: action.row,
                    column: action.column
                }
            };
        default:
            return state;
    }
}
exports.boardHitTestReducer = boardHitTestReducer;
//# sourceMappingURL=boardHitTest.js.map