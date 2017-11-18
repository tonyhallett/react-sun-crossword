import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { hookOrMountActionCreator, rootReducer, App, Introduction, Pathless, PathlessChild, PathlessIndex, Multiple, Child1, Child2, LeaveHookComponent, AdditionalProps, PropsFromParentParent, PropsFromParentChild, OnChangeComponent, OnChangeChild1, OnChangeChild2 } from "./router_test/DemoRouterApp"

import { useRouterHistory } from 'react-router'

import { createHistory } from 'history'
import { routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Router, Route, IndexRoute, Redirect, RedirectFunction } from "react-router";
import { RouteProps } from "react-router/lib/Route";
import { EnterHook,LeaveHook,ChangeHook, RouterState } from "react-router/lib/Router";

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
        rootReducer,
        router: routerReducer
    }),
    composeWithDevTools(applyMiddleware(middleware))
    
)
//note that if want to be able to change then needs to be an object
var additionalPropsValue = { additional: "This is additional" };

interface RouteAdditionalProps {
    additionalProp: typeof additionalPropsValue
}
class RouteAdditional extends React.Component<RouteAdditionalProps&RouteProps,undefined>{
    render() {
        return <Route {...this.props}/>
    }
}
type AnyFunction = (...args: any[]) => any;

var onEnter: EnterHook = function routeOnEnter(nextState: RouterState, replace: RedirectFunction, callback?: AnyFunction) {
    var nextStateLocationPathname = nextState.location.pathname;
    additionalPropsValue.additional = "have entered, nextState.location.pathname: " + nextStateLocationPathname;  
    //store.dispatch(hookOrMountActionCreator("EnterHook", { nextStateLocationPathname: nextStateLocationPathname }))

}
var onLeave: LeaveHook = function routeOnLeave(prevState: RouterState) {
    var debugThis = "debug this";
}

var onChange: ChangeHook = function routeOnChange(prevState: RouterState, nextState: RouterState, replace: RedirectFunction, callback?: AnyFunction) {
    var debugThis = "debug this";
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route  path="/" component={App}>
                <IndexRoute  component={Introduction} />
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="pathless" component={Pathless}>
                    <IndexRoute component={PathlessIndex}/>
                </Route>
                <Route  component={Pathless}>
                    <Route  path="pathlessChild" component={PathlessChild} />
                </Route>
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange}  path="multiple" component={Multiple} >
                    {/* Just to demonstrate the concept 
                        in practice there would be multiple child routes - where the matching one
                        will provide the child components
                        Also not that child routes of those child routes will provide a child component to components !
                    */}
                    <IndexRoute components={{ child1: Child1, child2: Child2 }}/>
                </Route>
                <Redirect  from="many" to="multiple" />
                <RouteAdditional onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="additionalProps" component={AdditionalProps} additionalProp={additionalPropsValue} />
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="leaveHook" component={LeaveHookComponent}></Route>
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="propsFromParent" component={PropsFromParentParent}>
                    <IndexRoute component={PropsFromParentChild} />
                </Route>
                <Route path="onChange" onChange={onChange} component={OnChangeComponent}>
                    <Route path="change1" component={OnChangeChild1} />
                    <Route path="change2" component={OnChangeChild2} />
                </Route>
               
            </Route>
        </Router>
    </Provider>,

    document.getElementById("example")
);