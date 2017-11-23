﻿import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { hookOrMountActionCreator, is404Active, hooksAndMounts, routeErrorDetails, PathSwitch, App, Introduction, Pathless, PathlessChild, PathlessIndex, Multiple, Child1, Child2, LeaveHookComponent, AdditionalProps, PropsFromParentParent, PropsFromParentChild, Navigation, ParamParent, ParamChild, Optional, QuerySearchState, PageNotFound, GetComponentError, GetComponentComp1, GetComponentComp2, routeError } from "./router_test/DemoRouterApp"

import { useRouterHistory } from 'react-router'

import { createHistory } from 'history'
import { routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Router, Route, IndexRoute, Redirect, RedirectFunction } from "react-router";
import { RouteProps } from "react-router/lib/Route";
import { IndexRouteProps } from "react-router/lib/IndexRoute";
import { EnterHook,LeaveHook,ChangeHook, RouterState } from "react-router/lib/Router";
import { ReduxRoute } from "./router_test/routeProviders";



//ReactDOM.render(
//    <CrosswordPuzzleApp/>,
//    document.getElementById("example")
//);

//#region setup
const history = useRouterHistory(createHistory)({
    basename: '/react-sun-crossword'
})

const middleware = routerMiddleware(history);

const store = createStore(
    combineReducers({
        hooksAndMounts,
        router: routerReducer,
        is404Active,
        routeErrorDetails
    }),
    composeWithDevTools(applyMiddleware(middleware))
    
)
//#endregion


//#region typings
declare module "react-router/lib/Redirect" {
    interface RedirectProps {
        [extraProps: string]: any;
    }
}
declare module "react-router/lib/IndexRoute" {
    interface IndexRouteProps {
        [extraProps: string]: any;
    }
}
declare module "react-router/lib/Route"{
    interface RouteProps {
        [extraProps: string]: any;
    }
    /*note that would need to do the same with Router if want to pass 
    additional props to the render method

        var propTypes = {
        history: _propTypes.object,
        children: _InternalPropTypes.routes,
        
        onError: _propTypes.func,
        onUpdate: _propTypes.func,

        // PRIVATE: For client-side rehydration of server match.
        matchContext: _propTypes.object

    }
        return render(_extends({}, props, {
      router: this.router, ^^^^^^^ used by the RouterContext
        var router = _extends({}, history, {
          setRouteLeaveHook: transitionManager.listenBeforeLeavingRoute,
          isActive: transitionManager.isActive
        });
      location: location, ^^^^^^^^^^^
      routes: routes, ************* could have got them from here !!! ^^^^^^^
      params: params, ^^^^^^
      components: components, ^^^^^^^^
      createElement: createElement ^^^^^^
    }));
    which defaults to
    render: function render(props) {
        return _react2.default.createElement(_RouterContext2.default, props);
      }
    //*****Looks like if you provide createElement it is not used unless you also provide render !
    */
}
var RouteAny = Route as any;
var RouterAny = Router as any;
//#endregion

//#region hooks
var onEnter: EnterHook = function routeOnEnter(nextState: RouterState, replace: RedirectFunction) {
    var nextStateLocationPathname = nextState.location.pathname;
    additionalPropsValue.additional = "have entered, nextState.location.pathname: " + nextStateLocationPathname;  

    store.dispatch(hookOrMountActionCreator("EnterHook", { nextState: nextState,routeId:this.routeId }))
    if (nextState.location.pathname == "/redirect") {
        replace("/multiple");
    }
}
var onLeave: LeaveHook = function routeOnLeave(prevState: RouterState) {
    store.dispatch(hookOrMountActionCreator("LeaveHook", { prevState: prevState, routeId: this.routeId  }))
}
var onChange: ChangeHook = function routeOnChange(prevState: RouterState, nextState: RouterState, replace: RedirectFunction) {
    store.dispatch(hookOrMountActionCreator("ChangeHook", { prevState: prevState, nextState: nextState, routeId: this.routeId  }))

}
//#endregion



//note that if want to be able to change then needs to be an object
var additionalPropsValue = { additional: "This is additional" };

//#region defaultProps for Route/IndexRoute for hooks
Route.defaultProps = {
    onEnter: onEnter,
    onLeave: onLeave,
    onChange:onChange
}
IndexRoute.defaultProps = {
    onEnter: onEnter,
    onLeave: onLeave,
    onChange: onChange
}
//#endregion
ReactDOM.render(
    <Provider store={store}>
        <RouterAny history={history} onError={(error) => {
            store.dispatch(routeError(error))
        }} onUpdate={() => { store.dispatch(hookOrMountActionCreator("OnUpdate")) }}>
            <Route routeId="App" path="/" component={App}>
                <IndexRoute routeId="App Index" component={Introduction} />
                <Route routeId="Pathless Parent" path="pathless" component={Pathless}>
                    <IndexRoute routeId="Pathless Index" component={PathlessIndex}/>
                </Route>
                <Route routeId="Pathless pathless!" component={Pathless}>
                    <Route routeId="Pathless" path="pathlessChild" component={PathlessChild} />
                </Route>
                <Route routeId="Multiple" path="multiple" component={Multiple} >
                    {/* Just to demonstrate the concept 
                        in practice there would be multiple child routes - where the matching one
                        will provide the child components
                        Also not that child routes of those child routes will provide a child component to components !
                    */}
                    <IndexRoute routeId="Multiple Index" components={{ child1: Child1, child2: Child2 }}/>
                </Route>
                <Redirect routeId="Redirect Component"  from="many" to="multiple" />
                <Route routeId="AdditionalProps" path="additionalProps" component={AdditionalProps} additionalProp={additionalPropsValue} />
                <Route routeId="LeaveHook" path="leaveHook" component={LeaveHookComponent}></Route>
                <Route routeId="PropsFromParent" path="propsFromParent" component={PropsFromParentParent}>
                    <IndexRoute routeId="PropsFromParent Index" component={PropsFromParentChild} />
                </Route>
                <Route routeId="HookRedirect" path="redirect" />
                <Route routeId="Navigation" component={Navigation} path="navigation">
                    <Route routeId="NavigationParams" path="params">
                        <Route routeId="NavigationParam" path=":someParam" component={ParamParent}>
                            <Route routeId="NavigationSplat" path="*MatchPart" component={ParamChild} />
                        </Route>
                    </Route>
                    <Route routeId="Optional" path="(optionalPart)NotOptional" component={Optional}/>
                    <Route routeId="QuerySearchState" path="querySearchState" component={QuerySearchState}/>
                </Route>
                <Route routeId="GetComponentError" path="getComponentError" component={GetComponentError}>
                    <Route routeId="GetComponent" path="getComponent" getComponent={(nextState, cb) => {
                        //this context is the route
                        if (nextState.location.state.isComponent1) {
                             cb(null,GetComponentComp1);
                        }
                        cb(null,GetComponentComp2);
                    }} />
                    <Route routeId="Error" path="error" getComponent={(nextState,cb) => {
                        cb(new Error("Error thrown by getComponent"),null);
                    }} />
                </Route>
                <ReduxRoute routeId="ReduxRoute404" onEnter={onEnter} onChange={onChange} onLeave={onLeave} store={store} change={(state, route) => { route.path = state.is404Active ? "*" : "" }} path="" component={PageNotFound} />
                
            </Route>
            
            
        </RouterAny>
    </Provider>,

    document.getElementById("example")
);

