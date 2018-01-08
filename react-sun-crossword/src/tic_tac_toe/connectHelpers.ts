import { TicTacToeState, Player } from "./reducer";

export function getCurrentPlayerColour(state: TicTacToeState) {
    var currentPlayer = state.gameState.currentPlayer;
    return currentPlayer === Player.X ? state.playerColours.xColour : state.playerColours.oColour;
}