"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reducer_1 = require("./reducers/reducer");
function getCurrentPlayerColour(state) {
    var currentPlayer = state.gameState.currentPlayer;
    return currentPlayer === reducer_1.Player.X ? state.playerColours.xColour : state.playerColours.oColour;
}
exports.getCurrentPlayerColour = getCurrentPlayerColour;
//# sourceMappingURL=connectHelpers.js.map