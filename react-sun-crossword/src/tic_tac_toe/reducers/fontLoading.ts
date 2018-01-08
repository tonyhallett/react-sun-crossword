import { AnyAction } from 'redux'
import { FONT_LOADING, FontLoadingState } from '../webFontLoader'
export { FontLoadingState } from '../webFontLoader'

export function fontLoadingState(state: FontLoadingState = FontLoadingState.NotStarted, action: AnyAction) {
    switch (action.type) {
        case FONT_LOADING:
            return action.state as FontLoadingState;
        default:
            return state;
    }
}