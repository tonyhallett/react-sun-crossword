import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { reducer, App, Introduction, Pathless, PathlessChild, PathlessIndex, Multiple, Child1, Child2, LeaveHook, AdditionalProps, PropsFromParentParent, PropsFromParentChild } from "./router_test/DemoRouterApp"

import { useRouterHistory } from 'react-router'

import { createHistory } from 'history'
import {  routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Router, Route, IndexRoute, Redirect } from "react-router";
import { RouteProps } from "react-router/lib/Route";

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
var additionalPropsValue = "This is additional";

interface RouteAdditionalProps {
    additionalProp:string
}
class RouteAdditional extends React.Component<RouteAdditionalProps&RouteProps,undefined>{
    render() {
        return <Route {...this.props}/>
    }
}

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
                <Route onEnter={() => additionalPropsValue="have entered multiple"} path="multiple" component={Multiple} >
                    {/* Just to demonstrate the concept 
                        in practice there would be multiple child routes - where the matching one
                        will provide the child components
                        Also not that child routes of those child routes will provide a child component to components !
                    */}
                    <IndexRoute components={{ child1: Child1, child2: Child2 }}/>
                </Route>
                <Redirect from="many" to="multiple" />
                <RouteAdditional path="additionalProps" component={AdditionalProps} additionalProp={additionalPropsValue} />
                <Route path="leaveHook" component={LeaveHook}></Route>
                <Route path="propsFromParent" component={PropsFromParentParent}>
                    <IndexRoute component={PropsFromParentChild} />
                </Route>
                    
               
            </Route>
        </Router>
    </Provider>,

    document.getElementById("example")
);