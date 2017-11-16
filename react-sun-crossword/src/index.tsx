import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { reducer, App, Introduction, Pathless, PathlessChild, PathlessIndex } from "./router_test/DemoRouterApp"

import { useRouterHistory } from 'react-router'

import { createHistory } from 'history'
import {  routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Router, Route, IndexRoute } from "react-router";

//ReactDOM.render(
//    <CrosswordPuzzleApp/>,
//    document.getElementById("example")
//);
var anyWindow = window as any;
const history = useRouterHistory(createHistory)({
    basename: '/react-sun-crossword'
})

const middleware = routerMiddleware(history);

const store = createStore(
    combineReducers({
        reducer,
        router: routerReducer
    }),
    composeWithDevTools(applyMiddleware(middleware))
    
)

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Introduction} />
                <Route path="pathless" component={Pathless}>
                    <IndexRoute component={PathlessIndex}/>
                </Route>
                <Route component={Pathless}>
                    <Route path="pathlessChild" component={PathlessChild} />
                </Route>

            </Route>
        </Router>
    </Provider>,

    document.getElementById("example")
);