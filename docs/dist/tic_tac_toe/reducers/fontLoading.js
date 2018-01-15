"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webFontLoader_1 = require("../webFontLoader");
var webFontLoader_2 = require("../webFontLoader");
exports.FontLoadingState = webFontLoader_2.FontLoadingState;
//demonstration of default Reducer typing - does not ensure that action.state is correct
//as the Reducer will be called for all actions 
//export type Reducer<S> = (state: S, action: AnyAction) => S;
//could use something like type TypedActionReducer<S,A extends AnyAction>=(state:S,action:A)=>S
//if were to be only using payload of a single action ( although this would suggest that the function would only be called with that action )
exports.fontLoadingState = function fontLoadingState(state, action) {
    if (state === void 0) { state = webFontLoader_1.FontLoadingState.NotStarted; }
    switch (action.type) {
        case webFontLoader_1.FONT_LOADING:
            return action.state;
        default:
            return state;
    }
};
//# sourceMappingURL=fontLoading.js.map