import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { RouterAwareApp, reducer } from "./router_test/DemoRouterApp"

import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

//ReactDOM.render(
//    <CrosswordPuzzleApp/>,
//    document.getElementById("example")
//);
var anyWindow = window as any;
const history = createHistory();
const middleware = routerMiddleware(history);//need to check how this works with the dev tools

const store = createStore(
    combineReducers({
        reducer,
        router: routerReducer
    }),
    composeWithDevTools(applyMiddleware(middleware))
    
)

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <RouterAwareApp/>
        </ConnectedRouter>
    </Provider>,

    document.getElementById("example")
);