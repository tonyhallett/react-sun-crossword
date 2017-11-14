import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux"
import { createStore } from 'redux'

import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { DemoRouterApp,reducer } from "./router_test/DemoRouterApp"

//ReactDOM.render(
//    <CrosswordPuzzleApp/>,
//    document.getElementById("example")
//);
var anyWindow = window as any;
var store = createStore(reducer, anyWindow.__REDUX_DEVTOOLS_EXTENSION__ && anyWindow.__REDUX_DEVTOOLS_EXTENSION__());
ReactDOM.render(
    <Provider store={store}>
        <DemoRouterApp />
    </Provider>,

    document.getElementById("example")
);