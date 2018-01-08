import * as React from "react";
import * as ReactDOM from "react-dom";

import { reducer } from './tic_tac_toe/reducer'
import { createLocalStorageStore } from "./helpers/storage"

import { ConnectedWebFontLoader, FontLoadingState } from './tic_tac_toe/webFontLoader'
import * as textStrings from './tic_tac_toe/textStrings'
import * as fontFamilies from './tic_tac_toe/fontFamilies'


import { Provider } from "react-redux"
//need applyMiddleware ?
import { applyMiddleware } from 'redux'
//to be wired up
import { composeWithDevTools } from 'redux-devtools-extension';

import { ConnectedTicTacToeApp } from "./tic_tac_toe/ticTacToeApp";


//#region hoc code for wrapping an html element
//interface WithStyleProps {
//    props: {
//        style: React.CSSProperties
//    }
//}
//function withSpinAxes(type: string, props: any,children:any) {
   
//    var squareSpin={
//        '25%': {
//            transform: "perspective(100px) rotateX(180deg) rotateY(0)"
//        },
//        '50%': {
//            transform: "perspective(100px) rotateX(180deg) rotateY(180deg)"
//        },
//        '75%': {
//            transform: "perspective(100px) rotateX(0) rotateY(180deg)"
//        },
//        '100%': {
//            transform: "perspective(100px) rotateX(0) rotateY(0)"
//        }
//    }
//    var spinAxes = class extends React.Component<WithStyleProps, undefined>{
//        render() {
//            var existingStyle = props.style;
//            props.style = [existingStyle, { animationName: Radium.keyframes(squareSpin) }]
//            return React.createElement(type,props,children)
//        }
//    }
//    return Radium(spinAxes);
//}

//#region Spinning div
//var spinningDivProps = {
//    style:
//    {
//        width: 100, height: 100, backgroundColor: "white", textAlign: "center", verticalAlign: "center",
//        animationDuration: "3000ms",
//        fontSize: 90, padding: 5,
//        animationTimingFunction: "cubic-bezier(0.09, 0.57, 0.49, 0.9)",
//        animationIterationCount: "infinite"
//    } as React.CSSProperties
//}
//const SpinningDivX: any = withSpinAxes("div", spinningDivProps, cross);
//const SpinningDivO: any = withSpinAxes("div", spinningDivProps, nought);
//#endregion
//#endregion


var store = createLocalStorageStore(reducer, (s) => {
    s.fontLoadingState = FontLoadingState.NotStarted;
    s.boardHitTest = { request: null, result: null };
    return s;
});
ReactDOM.render(
    <Provider store={store}>
        <ConnectedWebFontLoader config={{ google: { families: [fontFamilies.textFontFamily, fontFamilies.noughtCrossFontFamily], text: textStrings.letters } }}>
            <ConnectedTicTacToeApp minimumLoadingIndicator={2000} />
        </ConnectedWebFontLoader>
    </Provider>,

    document.getElementById("example")
);
