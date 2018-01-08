﻿import { TicTacToeState, Player } from "./reducer";

export function getCurrentPlayerColour(state: TicTacToeState) {
    var currentPlayer = state.currentPlayer;
    return currentPlayer === Player.X ? state.xColour : state.oColour;
}