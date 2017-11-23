import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { hookOrMountActionCreator, is404Active, hooksAndMounts, routeErrorDetails, PathSwitch, App, Introduction, Pathless, PathlessChild, PathlessIndex, Multiple, Child1, Child2, LeaveHookComponent, AdditionalProps, PropsFromParentParent, PropsFromParentChild, OnChangeComponent, OnChangeChild1, OnChangeChild2, Navigation, ParamParent, ParamChild, Optional, QuerySearchState, PageNotFound, GetComponentError, GetComponentComp1, GetComponentComp2, routeError } from "./router_test/DemoRouterApp"

import { useRouterHistory } from 'react-router'

import { createHistory } from 'history'
import { routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Router, Route, IndexRoute, Redirect, RedirectFunction } from "react-router";
import { RouteProps } from "react-router/lib/Route";
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
            <Route path="/" component={App}>
                <IndexRoute component={Introduction} />
                <Route path="pathless" component={Pathless}>
                    <IndexRoute component={PathlessIndex}/>
                </Route>
                <Route component={Pathless}>
                    <Route path="pathlessChild" component={PathlessChild} />
                </Route>
                <Route path="multiple" component={Multiple} >
                    {/* Just to demonstrate the concept 
                        in practice there would be multiple child routes - where the matching one
                        will provide the child components
                        Also not that child routes of those child routes will provide a child component to components !
                    */}
                    <IndexRoute components={{ child1: Child1, child2: Child2 }}/>
                </Route>
                <Redirect  from="many" to="multiple" />
                <Route path="additionalProps" component={AdditionalProps} additionalProp={additionalPropsValue} />
                <Route path="leaveHook" component={LeaveHookComponent}></Route>
                <Route path="propsFromParent" component={PropsFromParentParent}>
                    <IndexRoute component={PropsFromParentChild} />
                </Route>
                <Route path="onChange" component={OnChangeComponent}>
                    <Route path="change1" component={OnChangeChild1} />
                    <Route  path="change2" component={OnChangeChild2} />
                </Route>
                <Route path="redirect"/>
                <Route path="navigation">
                    <Route path="params">
                        <Route path=":someParam" component={ParamParent}>
                            <Route path="*MatchPart" component={ParamChild} />
                        </Route>
                    </Route>
                    <Route path="(optionalPart)NotOptional" component={Optional}/>
                    <Route path="querySearchState" component={QuerySearchState}/>
                </Route>
                <Route path="getComponentError" component={GetComponentError}>
                    <Route path="getComponent" getComponent={(nextState, cb) => {
                        //this context is the route
                        if (nextState.location.state.isComponent1) {
                             cb(null,GetComponentComp1);
                        }
                        cb(null,GetComponentComp2);
                    }} />
                    <Route path="error" getComponent={(nextState,cb) => {
                        cb(new Error("Error thrown by getComponent"),null);
                    }} />
                </Route>
                <ReduxRoute onEnter={onEnter} onChange={onChange} onLeave={onLeave} store={store} change={(state, route) => { route.path = state.is404Active ? "*" : "" }} path="" component={PageNotFound} />
                
            </Route>
            
            
        </RouterAny>
    </Provider>,

    document.getElementById("example")
);

