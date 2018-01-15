"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var reducer_1 = require("./tic_tac_toe/reducers/reducer");
var storage_1 = require("./helpers/storage");
var webFontLoader_1 = require("./tic_tac_toe/webFontLoader");
var textStrings = require("./tic_tac_toe/textStrings");
var fontFamilies = require("./tic_tac_toe/fontFamilies");
var react_redux_1 = require("react-redux");
var ticTacToeApp_1 = require("./tic_tac_toe/ticTacToeApp");
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
var store = storage_1.createLocalStorageStore(reducer_1.reducer, function (s) {
    s.fontLoadingState = webFontLoader_1.FontLoadingState.NotStarted;
    s.boardHitTest = { request: null, result: null };
    return s;
});
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(webFontLoader_1.ConnectedWebFontLoader, { config: { google: { families: [fontFamilies.textFontFamily, fontFamilies.noughtCrossFontFamily], text: textStrings.letters } } },
        React.createElement(ticTacToeApp_1.ConnectedTicTacToeApp, { minimumLoadingIndicator: 2000 }))), document.getElementById("example"));
//# sourceMappingURL=index.js.map