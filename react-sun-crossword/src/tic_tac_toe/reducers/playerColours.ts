import { AnyAction } from 'redux'
export interface PlayerColourState {
    xColour: string
    oColour: string
}
export function playerColours(state: PlayerColourState = { oColour: "yellow", xColour: "rgb(255, 51, 153)" }, action: AnyAction) {
    //no actions at the moment
    return state;
}