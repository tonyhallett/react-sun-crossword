"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var gameState_1 = require("./gameState");
var playerColours_1 = require("./playerColours");
var fontLoading_1 = require("./fontLoading");
var boardHitTest_1 = require("./boardHitTest");
__export(require("./gameState"));
__export(require("./playerColours"));
__export(require("./fontLoading"));
__export(require("./boardHitTest"));
/*
export interface ReducersMapObject {
  [key: string]: Reducer<any>;

export type Reducer<S> = (state: S, action: AnyAction) => S;
export function combineReducers<S>(reducers: ReducersMapObject): Reducer<S>;

*/
exports.reducer = redux_1.combineReducers({
    gameState: gameState_1.gameStateReducer,
    playerColours: playerColours_1.playerColours,
    fontLoadingState: fontLoading_1.fontLoadingState,
    boardHitTest: boardHitTest_1.boardHitTestReducer
});
//# sourceMappingURL=reducer.js.map