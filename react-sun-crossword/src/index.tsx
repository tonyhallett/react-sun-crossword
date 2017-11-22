import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { hookOrMountActionCreator, rootReducer,PathSwitch, App, Introduction, Pathless, PathlessChild, PathlessIndex, Multiple, Child1, Child2, LeaveHookComponent, AdditionalProps, PropsFromParentParent, PropsFromParentChild, OnChangeComponent, OnChangeChild1, OnChangeChild2, Navigation, ParamParent, ParamChild, Optional, QuerySearchState, PageNotFound } from "./router_test/DemoRouterApp"

import { useRouterHistory } from 'react-router'

import { createHistory } from 'history'
import { routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Router, Route, IndexRoute, Redirect, RedirectFunction } from "react-router";
import { RouteProps } from "react-router/lib/Route";
import { EnterHook,LeaveHook,ChangeHook, RouterState } from "react-router/lib/Router";

var objectAny = Object as any;
var _extends = objectAny.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };


class RouteProvider extends React.Component<any, any>{
    static routes = []
    static createRouteFromReactElement = function (element, parentRoute?) {
        function createRoute(defaultProps, props) {
            return _extends({}, defaultProps, props);

        }
        var type = element.type;
        var route = createRoute(type.defaultProps, element.props);

        if (route.children) {
            var childRoutes = RouteProvider.createRoutesFromReactChildren(route.children, route);

            if (childRoutes.length) route.childRoutes = childRoutes;

            delete route.children;

        }
        if (element.props.routeCallback) {
            element.props.routeCallback(route);
        }
        RouteProvider.routes.push(route);
        return route;
    }
    static createRoutesFromReactChildren = function createRoutesFromReactChildren(children, parentRoute) {
        var routes = [];

        React.Children.forEach(children, function (element) {
            routes.push(RouteProvider.createRouteFromReactElement(element));
        });

        return routes;
    }
    render() {
        return null;
    }
}


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

var route404;
var onEnter: EnterHook = function routeOnEnter(nextState: RouterState, replace: RedirectFunction) {
    //will probably change this - will use the redux store and have the RouteProvider connect to the store
    if (nextState.location.pathname.indexOf("toggle404")!==-1) {
        
        if (route404.path == "*") {
            route404.path = "";
        } else {
            route404.path = "*";
        }
        replace(nextState.location.state);
    }
    var nextStateLocationPathname = nextState.location.pathname;
    
    
    additionalPropsValue.additional = "have entered, nextState.location.pathname: " + nextStateLocationPathname;  

    store.dispatch(hookOrMountActionCreator("EnterHook", { nextState: nextState }))
    if (nextState.location.pathname == "/redirect") {
        replace("/multiple");
    }
}
var onLeave: LeaveHook = function routeOnLeave(prevState: RouterState) {
    store.dispatch(hookOrMountActionCreator("LeaveHook", { prevState: prevState }))
}

var onChange: ChangeHook = function routeOnChange(prevState: RouterState, nextState: RouterState, replace: RedirectFunction) {
    store.dispatch(hookOrMountActionCreator("ChangeHook", { prevState:prevState,nextState:nextState }))

}
var route404;



var RouteAny = Route as any;
var RouterAny = Router as any;
ReactDOM.render(
    <Provider store={store}>
        <RouterAny history={history} >
            <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="/" component={App}>
                <IndexRoute onEnter={onEnter} onLeave={onLeave} onChange={onChange} component={Introduction} />
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="toggle404"/>
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="pathless" component={Pathless}>
                    <IndexRoute onEnter={onEnter} onLeave={onLeave} onChange={onChange} component={PathlessIndex}/>
                </Route>
                <Route component={Pathless}>
                    <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange}  path="pathlessChild" component={PathlessChild} />
                </Route>
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="multiple" component={Multiple} >
                    {/* Just to demonstrate the concept 
                        in practice there would be multiple child routes - where the matching one
                        will provide the child components
                        Also not that child routes of those child routes will provide a child component to components !
                    */}
                    <IndexRoute onEnter={onEnter} onLeave={onLeave} onChange={onChange} components={{ child1: Child1, child2: Child2 }}/>
                </Route>
                <Redirect  from="many" to="multiple" />
                <RouteAdditional onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="additionalProps" component={AdditionalProps} additionalProp={additionalPropsValue} />
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="leaveHook" component={LeaveHookComponent}></Route>
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="propsFromParent" component={PropsFromParentParent}>
                    <IndexRoute onEnter={onEnter} onLeave={onLeave} onChange={onChange} component={PropsFromParentChild} />
                </Route>
                <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="onChange" component={OnChangeComponent}>
                    <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="change1" component={OnChangeChild1} />
                    <Route onEnter={onEnter} onLeave={onLeave} onChange={onChange} path="change2" component={OnChangeChild2} />
                </Route>
                <Route path="redirect" onEnter={onEnter} onLeave={onLeave} onChange={onChange} />
                <Route path="navigation" onEnter={onEnter} onLeave={onLeave} onChange={onChange} component={Navigation}>
                    <Route path="params">
                        <Route path=":someParam" onEnter={onEnter} onLeave={onLeave} onChange={onChange} component={ParamParent}>
                            <Route path="*MatchPart" onEnter={onEnter} onLeave={onLeave} onChange={onChange} component={ParamChild} />
                        </Route>
                    </Route>
                    <Route path="(optionalPart)NotOptional" onEnter={onEnter} onLeave={onLeave} onChange={onChange} component={Optional}/>
                    <Route path="querySearchState" onEnter={onEnter} onLeave={onLeave} onChange={onChange} component={QuerySearchState}/>
                      

                </Route>
                <RouteProvider routeCallback={(route) => { route404 = route; }} path="" component={PageNotFound} />
            </Route>
            
            
        </RouterAny>
    </Provider>,

    document.getElementById("example")
);

//<RouteProvider path="*" is404={true} component={PageNotFound} />