import { AnyAction } from 'redux';
import { BOARD_HIT_TEST, BOARD_HIT_TEST_RESULT } from "../actions";

export interface BoardHitTestReq {
    x: number, y: number
}
export interface BoardHitTestRes {
    hit: boolean,
    row: number,
    column: number
}
export interface BoardHitTestState {
    request: BoardHitTestReq,
    result: BoardHitTestRes
}
export function boardHitTestReducer(state: BoardHitTestState = { request: null, result: null }, action: AnyAction) {
    switch (action.type) {
        case BOARD_HIT_TEST:
            return {
                        request: {
                            x: action.x,
                            y: action.y
                        },
                        result: state.result
                    }
    
            
        case BOARD_HIT_TEST_RESULT:
            return  {
                        request: state.request,
                        result: {
                            hit: action.hit,
                            row: action.row,
                            column: action.column
                        }
                    }
        default:
            return state;
            
    }
}
