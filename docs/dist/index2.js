"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var redux_devtools_extension_1 = require("redux-devtools-extension");
var DemoRouterApp_1 = require("./router_test/DemoRouterApp");
var react_router_1 = require("react-router");
var history_1 = require("history");
var react_router_redux_1 = require("react-router-redux");
var react_router_2 = require("react-router");
var routeProviders_1 = require("./router_test/routeProviders");
var reactHelpers_1 = require("./helpers/reactHelpers");
var relativeRouteContext_1 = require("./router_test/relativeRouteContext");
//ReactDOM.render(
//    <CrosswordPuzzleApp/>,
//    document.getElementById("example")
//);
//#region setup
var history = react_router_1.useRouterHistory(history_1.createHistory)({
    basename: '/react-sun-crossword'
});
var middleware = react_router_redux_1.routerMiddleware(history);
var store = redux_1.createStore(redux_1.combineReducers({
    hooksAndMounts: DemoRouterApp_1.hooksAndMounts,
    router: react_router_redux_1.routerReducer,
    is404Active: DemoRouterApp_1.is404Active,
    routeErrorDetails: DemoRouterApp_1.routeErrorDetails,
    handleRouteError: DemoRouterApp_1.handleRouteError
}), redux_devtools_extension_1.composeWithDevTools(redux_1.applyMiddleware(middleware)));
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
var Route = routeProviders_1.RouteWithParent;
//#endregion
//#region hooks
var onEnter = function routeOnEnter(nextState, replace) {
    var nextStateLocationPathname = nextState.location.pathname;
    additionalPropsValue.additional = "have entered, nextState.location.pathname: " + nextStateLocationPathname;
    store.dispatch(DemoRouterApp_1.hookOrMountActionCreator("EnterHook", { nextState: nextState, routeId: this.routeId }));
    if (nextState.location.pathname == "/redirect") {
        replace("/multiple");
    }
};
var onLeave = function routeOnLeave(prevState) {
    store.dispatch(DemoRouterApp_1.hookOrMountActionCreator("LeaveHook", { prevState: prevState, routeId: this.routeId }));
};
var onChange = function routeOnChange(prevState, nextState, replace) {
    store.dispatch(DemoRouterApp_1.hookOrMountActionCreator("ChangeHook", { prevState: prevState, nextState: nextState, routeId: this.routeId }));
};
function wrapMountDispatch(Component) {
    var wrapper = (_a = (function (_super) {
            __extends(MountWrapper, _super);
            function MountWrapper() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MountWrapper.prototype.componentDidMount = function () {
                this.props.mountUnmount(true);
            };
            MountWrapper.prototype.componentWillUnmount = function () {
                this.props.mountUnmount(false);
            };
            MountWrapper.prototype.render = function () {
                //cast necessary for spread operator - https://github.com/Microsoft/TypeScript/issues/10727
                var _a = this.props, mountUnmount = _a.mountUnmount, passThroughProps = __rest(_a, ["mountUnmount"]);
                return React.createElement(Component, __assign({}, passThroughProps));
            };
            return MountWrapper;
        }(React.Component)),
        _a.displayName = reactHelpers_1.getWrapperComponentName("MountWrapper", Component),
        _a);
    var componentName = reactHelpers_1.getWrappedComponentClassName(Component);
    var connected = react_redux_1.connect(null, (function (dispatch) {
        var wrapperProps = {
            mountUnmount: function (isMount) {
                dispatch(DemoRouterApp_1.hookOrMountActionCreator(isMount ? "ComponentDidMount" : "ComponentWillUnmount", { componentName: componentName }));
            }
        };
        return wrapperProps;
    }))(wrapper);
    return connected;
    var _a;
}
//#endregion
//note that if want to be able to change then needs to be an object
var additionalPropsValue = { additional: "This is additional" };
//#region defaultProps for Route/IndexRoute for hooks
Route.defaultProps = {
    onEnter: onEnter,
    onLeave: onLeave,
    onChange: onChange
};
react_router_2.IndexRoute.defaultProps = {
    onEnter: onEnter,
    onLeave: onLeave,
    onChange: onChange
};
//#endregion
function routeErrorHandler(error) {
    store.dispatch(DemoRouterApp_1.routeError(error));
    return;
}
var ConnectedRouter = react_redux_1.connect(function (state) {
    var shouldHandleRouterError = DemoRouterApp_1.handleRouteErrorSelector(state);
    var handler = shouldHandleRouterError ? routeErrorHandler : null;
    return {
        onError: handler
    };
})(react_router_2.Router); //typing workaround
var mountDispatchLookups = [];
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
        mountDispatchLookups.push({ component: component, mountDispatchComponent: mountDispatched });
    }
    return mountDispatched;
}
function createElement(component, props) {
    return React.createElement(getMountDispatchComponent(component), props);
}
function renderRelative(props) {
    return React.createElement(relativeRouteContext_1.default, __assign({}, props));
}
var router;
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(ConnectedRouter, { ref: function (r) { router = r; }, render: renderRelative, createElement: createElement, history: history, onUpdate: function () { store.dispatch(DemoRouterApp_1.hookOrMountActionCreator("OnUpdate")); } },
        React.createElement(Route, { routeId: "App", path: "/", component: DemoRouterApp_1.ConnectedApp },
            React.createElement(react_router_2.IndexRoute, { routeId: "App Index", component: DemoRouterApp_1.Introduction }),
            React.createElement(Route, { routeId: "Pathless Parent", path: "pathless", component: DemoRouterApp_1.Pathless },
                React.createElement(react_router_2.IndexRoute, { routeId: "Pathless Index", component: DemoRouterApp_1.PathlessIndex })),
            React.createElement(Route, { routeId: "Pathless pathless!", component: DemoRouterApp_1.Pathless },
                React.createElement(Route, { routeId: "Pathless", path: "pathlessChild", component: DemoRouterApp_1.PathlessChild })),
            React.createElement(Route, { routeId: "Multiple", path: "multiple", component: DemoRouterApp_1.Multiple },
                React.createElement(react_router_2.IndexRoute, { routeId: "Multiple Index", components: { child1: DemoRouterApp_1.MultipleChild1, child2: DemoRouterApp_1.MultipleChild2 } })),
            React.createElement(react_router_2.Redirect, { routeId: "Redirect Component", from: "many", to: "multiple" }),
            React.createElement(Route, { routeId: "AdditionalProps", path: "additionalProps", component: DemoRouterApp_1.AdditionalProps, additionalProp: additionalPropsValue }),
            React.createElement(Route, { routeId: "LeaveHook", path: "leaveHook", component: DemoRouterApp_1.LeaveHookComponent }),
            React.createElement(Route, { routeId: "PropsFromParent", path: "propsFromParent", component: DemoRouterApp_1.PropsFromParentParent },
                React.createElement(react_router_2.IndexRoute, { routeId: "PropsFromParent Index", component: DemoRouterApp_1.PropsFromParentChild })),
            React.createElement(Route, { routeId: "HookRedirect", path: "redirect" }),
            React.createElement(Route, { routeId: "Navigation", component: DemoRouterApp_1.ConnectedNavigation, path: "navigation" },
                React.createElement(Route, { routeId: "NavigationParams", path: "params" },
                    React.createElement(Route, { routeId: "NavigationParam", path: ":someParam", component: DemoRouterApp_1.ReactJsonRoutePropsParamParent },
                        React.createElement(Route, { routeId: "NavigationSplat", path: "*MatchPart", component: DemoRouterApp_1.ReactJsonRoutePropsParamChild }))),
                React.createElement(Route, { routeId: "Optional", path: "(optionalPart)NotOptional", component: DemoRouterApp_1.ReactJsonRoutePropsOptional }),
                React.createElement(Route, { routeId: "QuerySearchState", path: "querySearchState", component: DemoRouterApp_1.ReactJsonRoutePropsQuerySearchState })),
            React.createElement(Route, { routeId: "GetComponentError", path: "getComponentError", component: DemoRouterApp_1.ConnectedGetComponentError },
                React.createElement(Route, { routeId: "GetComponent", path: "getComponent", getComponent: function (nextState, cb) {
                        //this context is the route
                        if (nextState.location.state.isComponent1) {
                            cb(null, DemoRouterApp_1.GetComponentComp1);
                        }
                        cb(null, DemoRouterApp_1.GetComponentComp2);
                    } }),
                React.createElement(Route, { routeId: "Error", path: "error", getComponent: function (nextState, cb) {
                        cb(new Error("Error thrown by getComponent"), null);
                    } })),
            React.createElement(Route, { routeId: "relativeLinks", path: "relativeLinks", component: DemoRouterApp_1.RelativeLinksParent },
                React.createElement(Route, { routeId: "relativeLinksRelative", path: "relative", component: DemoRouterApp_1.RelativeLinkParentMatched }),
                React.createElement(Route, { routeId: "relativeLinksChild", path: "relativeLinksChild", component: DemoRouterApp_1.RelativeLinksChild },
                    React.createElement(Route, { routeId: "relativeLinksChildRelative", path: "relative", component: DemoRouterApp_1.RelativeLinkChildMatched }))),
            React.createElement(routeProviders_1.ReduxRoute, { routeId: "ReduxRoute404", onEnter: onEnter, onChange: onChange, onLeave: onLeave, store: store, change: function (state, route) { route.path = state.is404Active ? "*" : ""; }, path: "", component: DemoRouterApp_1.PageNotFound })))), document.getElementById("example"));
//# sourceMappingURL=index2.js.map