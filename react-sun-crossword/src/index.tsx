import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider, connect } from "react-redux"
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';

import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { hookOrMountActionCreator, is404Active, hooksAndMounts, routeErrorDetails, ConnectedApp, Introduction, Pathless, PathlessChild, PathlessIndex, Multiple, MultipleChild1, MultipleChild2, LeaveHookComponent, AdditionalProps, PropsFromParentParent, PropsFromParentChild, ConnectedNavigation, ReactJsonRoutePropsParamParent, ReactJsonRoutePropsParamChild, ReactJsonRoutePropsOptional, ReactJsonRoutePropsQuerySearchState, PageNotFound, GetComponentError, GetComponentComp1, GetComponentComp2, routeError, RelativeLinksChild, RelativeLinksParent, RelativeLinkParentMatched, RelativeLinkChildMatched } from "./router_test/DemoRouterApp"

import { useRouterHistory } from 'react-router'

import { createHistory } from 'history'
import { routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Router, IndexRoute, Redirect, RedirectFunction, RouteComponentProps } from "react-router";
import { RouteProps } from "react-router/lib/Route";
import { IndexRouteProps } from "react-router/lib/IndexRoute";
import { EnterHook,LeaveHook,ChangeHook, RouterState } from "react-router/lib/Router";
import { ReduxRoute,RouteWithParent } from "./router_test/routeProviders";
import { getWrappedComponentClassName, getWrapperComponentName } from "./helpers/reactHelpers";

import RelativeRouterContext from "./router_test/relativeRouteContext";


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
//declare module "react-router/lib/Route"{
//    interface RouteProps {
//        [extraProps: string]: any;
//    }
//    /*note that would need to do the same with Router if want to pass 
//    additional props to the render method

//        var propTypes = {
//        history: _propTypes.object,
//        children: _InternalPropTypes.routes,
        
//        onError: _propTypes.func,
//        onUpdate: _propTypes.func,

//        // PRIVATE: For client-side rehydration of server match.
//        matchContext: _propTypes.object

//    }
//        return render(_extends({}, props, {
//      router: this.router, ^^^^^^^ used by the RouterContext
//        var router = _extends({}, history, {
//          setRouteLeaveHook: transitionManager.listenBeforeLeavingRoute,
//          isActive: transitionManager.isActive
//        });
//      location: location, ^^^^^^^^^^^
//      routes: routes, ************* could have got them from here !!! ^^^^^^^
//      params: params, ^^^^^^
//      components: components, ^^^^^^^^
//      createElement: createElement ^^^^^^
//    }));
//    which defaults to
//    render: function render(props) {
//        return _react2.default.createElement(_RouterContext2.default, props);
//      }
//    //*****Looks like if you provide createElement it is not used unless you also provide render !
//    */
//}

const Route = RouteWithParent;
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

//#region wrapMountDispatch
interface MountDispatchFunction {
    (isMount: boolean): void;
}
interface WrapperProps {
    mountUnmount: MountDispatchFunction
}
function wrapMountDispatch<P>(Component: React.ComponentClass<P>) {

    var wrapper = class MountWrapper extends React.Component<P & WrapperProps, any>{
        static displayName = getWrapperComponentName("MountWrapper", Component);
        componentDidMount() {
            this.props.mountUnmount(true);
        }
        componentWillUnmount() {
            this.props.mountUnmount(false);
        }
        render() {
            //cast necessary for spread operator - https://github.com/Microsoft/TypeScript/issues/10727
            const { mountUnmount, ...passThroughProps } = (this as any).props;
            return <Component {...passThroughProps} />
        }
    }
    var componentName = getWrappedComponentClassName(Component);
    var connected = connect(null, (dispatch => {
        var wrapperProps: WrapperProps = {
            mountUnmount: (isMount: boolean) => {
                dispatch(hookOrMountActionCreator(isMount ? "ComponentDidMount" : "ComponentWillUnmount", { componentName: componentName }));
            }
        }
        return wrapperProps;
    }))(wrapper);
    return connected;
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

//if was to override render and not use the RouteContext then this would not even be called 
interface MountDispatchLookup {
    component: any,
    mountDispatchComponent:any
}
var mountDispatchLookups: MountDispatchLookup[] = []
function getMountDispatchComponent(component) {
    var found = false;
    var mountDispatched;
    for (var i = 0; i < mountDispatchLookups.length; i++) {
        var mountDispatchLookup = mountDispatchLookups[i];
        if (mountDispatchLookup.component === component) {
            mountDispatched = mountDispatchLookup.mountDispatchComponent;
            found = true;
            break;
        }
    }
    if (!found) {
        mountDispatched = wrapMountDispatch(component);
        mountDispatchLookups.push({ component: component, mountDispatchComponent: mountDispatched })
    }
    return mountDispatched;
}
function createElement(component, props: RouteComponentProps<any, any>) {
    return React.createElement(getMountDispatchComponent(component), props);
}
function renderRelative(props) {
    return <RelativeRouterContext {...props}/>
}
ReactDOM.render(
    <Provider store={store}>
        <RouterAny render={renderRelative} createElement={createElement} history={history} onError={(error) => {
            store.dispatch(routeError(error))
        }} onUpdate={() => { store.dispatch(hookOrMountActionCreator("OnUpdate")) }}>
            <Route routeId="App" path="/" component={ConnectedApp}>
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
                    <IndexRoute routeId="Multiple Index" components={{ child1: MultipleChild1, child2: MultipleChild2 }}/>
                </Route>
                <Redirect routeId="Redirect Component"  from="many" to="multiple" />
                <Route routeId="AdditionalProps" path="additionalProps" component={AdditionalProps} additionalProp={additionalPropsValue} />
                <Route routeId="LeaveHook" path="leaveHook" component={LeaveHookComponent}></Route>
                <Route routeId="PropsFromParent" path="propsFromParent" component={PropsFromParentParent}>
                    <IndexRoute routeId="PropsFromParent Index" component={PropsFromParentChild} />
                </Route>
                <Route routeId="HookRedirect" path="redirect" />
                <Route routeId="Navigation" component={ConnectedNavigation} path="navigation">
                    <Route routeId="NavigationParams" path="params">
                        <Route routeId="NavigationParam" path=":someParam" component={ReactJsonRoutePropsParamParent}>
                            <Route routeId="NavigationSplat" path="*MatchPart" component={ReactJsonRoutePropsParamChild} />
                        </Route>
                    </Route>
                    <Route routeId="Optional" path="(optionalPart)NotOptional" component={ReactJsonRoutePropsOptional}/>
                    <Route routeId="QuerySearchState" path="querySearchState" component={ReactJsonRoutePropsQuerySearchState}/>
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
                <Route routeId="relativeLinks" path="relativeLinks" component={RelativeLinksParent}>
                    <Route routeId="relativeLinksRelative" path="relative" component={RelativeLinkParentMatched} />
                    <Route routeId="relativeLinksChild" path="relativeLinksChild" component={RelativeLinksChild}>
                        <Route routeId="relativeLinksChildRelative" path="relative" component={RelativeLinkChildMatched}/>
                    </Route>
                </Route>
                <ReduxRoute routeId="ReduxRoute404" onEnter={onEnter} onChange={onChange} onLeave={onLeave} store={store} change={(state, route) => { route.path = state.is404Active ? "*" : "" }} path="" component={PageNotFound} />
                
            </Route>
            
            
        </RouterAny>
    </Provider>,

    document.getElementById("example")
);

