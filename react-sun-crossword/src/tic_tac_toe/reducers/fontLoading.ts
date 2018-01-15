import { AnyAction, Reducer } from 'redux'
import { FONT_LOADING, FontLoadingState, FontLoadingAction } from '../webFontLoader'


export { FontLoadingState } from '../webFontLoader'

//demonstration of default Reducer typing - does not ensure that action.state is correct
//as the Reducer will be called for all actions 
//export type Reducer<S> = (state: S, action: AnyAction) => S;

//could use something like type TypedActionReducer<S,A extends AnyAction>=(state:S,action:A)=>S
//if were to be only using payload of a single action ( although this would suggest that the function would only be called with that action )
export const fontLoadingState: Reducer<FontLoadingState> = function fontLoadingState(state = FontLoadingState.NotStarted, action) {
    switch (action.type) {
        case FONT_LOADING:
            return action.state;
        default:
            return state;
    }
}




