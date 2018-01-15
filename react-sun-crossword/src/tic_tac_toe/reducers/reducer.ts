import { combineReducers } from 'redux'
import { gameStateReducer,GameState } from './gameState'
import { playerColours, PlayerColourState } from './playerColours'
import { fontLoadingState,FontLoadingState} from './fontLoading'
import { boardHitTestReducer, BoardHitTestState } from './boardHitTest'

export * from './gameState'
export * from './playerColours'
export * from './fontLoading'
export * from './boardHitTest'

/*
if possible rename such that:

Because combineReducers expects an object, we can put all top-level reducers into a separate file, export each reducer function, and use import * as reducers to get them as an object with their names as the keys:
import { combineReducers } from 'redux'
import * as reducers from './reducers'
const todoApp = combineReducers(reducers)

from <https://redux.js.org/docs/basics/Reducers.html>

*/

export interface TicTacToeState {
    gameState: GameState,
    fontLoadingState: FontLoadingState
    boardHitTest: BoardHitTestState,
    playerColours: PlayerColourState
}
/*
export interface ReducersMapObject {
  [key: string]: Reducer<any>;

export type Reducer<S> = (state: S, action: AnyAction) => S;
export function combineReducers<S>(reducers: ReducersMapObject): Reducer<S>;

*/

export const reducer = combineReducers<TicTacToeState>({
    gameState: gameStateReducer,
    playerColours: playerColours,
    fontLoadingState: fontLoadingState,
    boardHitTest: boardHitTestReducer

})
