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

var store = createStore(reducer);
ReactDOM.render(
    <Provider store={store}>
        <DemoRouterApp />
    </Provider>,

    document.getElementById("example")
);