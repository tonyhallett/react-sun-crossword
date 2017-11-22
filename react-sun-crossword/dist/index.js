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
    routeErrorDetails: DemoRouterApp_1.routeErrorDetails
}), redux_devtools_extension_1.composeWithDevTools(redux_1.applyMiddleware(middleware)));
var RouteAdditional = (function (_super) {
    __extends(RouteAdditional, _super);
    function RouteAdditional() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RouteAdditional.prototype.render = function () {
        return React.createElement(react_router_2.Route, __assign({}, this.props));
    };
    return RouteAdditional;
}(React.Component));
var RouteAny = react_router_2.Route;
var RouterAny = react_router_2.Router;
//#endregion
//#region hooks
var onEnter = function routeOnEnter(nextState, replace) {
    var nextStateLocationPathname = nextState.location.pathname;
    additionalPropsValue.additional = "have entered, nextState.location.pathname: " + nextStateLocationPathname;
    store.dispatch(DemoRouterApp_1.hookOrMountActionCreator("EnterHook", { nextState: nextState }));
    if (nextState.location.pathname == "/redirect") {
        replace("/multiple");
    }
};
var onLeave = function routeOnLeave(prevState) {
    store.dispatch(DemoRouterApp_1.hookOrMountActionCreator("LeaveHook", { prevState: prevState }));
};
var onChange = function routeOnChange(prevState, nextState, replace) {
    store.dispatch(DemoRouterApp_1.hookOrMountActionCreator("ChangeHook", { prevState: prevState, nextState: nextState }));
};
//#endregion
//note that if want to be able to change then needs to be an object
var additionalPropsValue = { additional: "This is additional" };
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(RouterAny, { history: history, onError: function (error) {
            store.dispatch(DemoRouterApp_1.routeError(error));
        }, onUpdate: function () { store.dispatch(DemoRouterApp_1.hookOrMountActionCreator("OnUpdate")); } },
        React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "/", component: DemoRouterApp_1.App },
            React.createElement(react_router_2.IndexRoute, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, component: DemoRouterApp_1.Introduction }),
            React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "pathless", component: DemoRouterApp_1.Pathless },
                React.createElement(react_router_2.IndexRoute, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, component: DemoRouterApp_1.PathlessIndex })),
            React.createElement(react_router_2.Route, { component: DemoRouterApp_1.Pathless },
                React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "pathlessChild", component: DemoRouterApp_1.PathlessChild })),
            React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "multiple", component: DemoRouterApp_1.Multiple },
                React.createElement(react_router_2.IndexRoute, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, components: { child1: DemoRouterApp_1.Child1, child2: DemoRouterApp_1.Child2 } })),
            React.createElement(react_router_2.Redirect, { from: "many", to: "multiple" }),
            React.createElement(RouteAdditional, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "additionalProps", component: DemoRouterApp_1.AdditionalProps, additionalProp: additionalPropsValue }),
            React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "leaveHook", component: DemoRouterApp_1.LeaveHookComponent }),
            React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "propsFromParent", component: DemoRouterApp_1.PropsFromParentParent },
                React.createElement(react_router_2.IndexRoute, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, component: DemoRouterApp_1.PropsFromParentChild })),
            React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "onChange", component: DemoRouterApp_1.OnChangeComponent },
                React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "change1", component: DemoRouterApp_1.OnChangeChild1 }),
                React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "change2", component: DemoRouterApp_1.OnChangeChild2 })),
            React.createElement(react_router_2.Route, { path: "redirect", onEnter: onEnter, onLeave: onLeave, onChange: onChange }),
            React.createElement(react_router_2.Route, { path: "navigation", onEnter: onEnter, onLeave: onLeave, onChange: onChange, component: DemoRouterApp_1.Navigation },
                React.createElement(react_router_2.Route, { path: "params" },
                    React.createElement(react_router_2.Route, { path: ":someParam", onEnter: onEnter, onLeave: onLeave, onChange: onChange, component: DemoRouterApp_1.ParamParent },
                        React.createElement(react_router_2.Route, { path: "*MatchPart", onEnter: onEnter, onLeave: onLeave, onChange: onChange, component: DemoRouterApp_1.ParamChild }))),
                React.createElement(react_router_2.Route, { path: "(optionalPart)NotOptional", onEnter: onEnter, onLeave: onLeave, onChange: onChange, component: DemoRouterApp_1.Optional }),
                React.createElement(react_router_2.Route, { path: "querySearchState", onEnter: onEnter, onLeave: onLeave, onChange: onChange, component: DemoRouterApp_1.QuerySearchState })),
            React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "getComponentError", component: DemoRouterApp_1.GetComponentError },
                React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "getComponent", getComponent: function (nextState, cb) {
                        //this context is the route
                        if (nextState.location.state.isComponent1) {
                            cb(null, DemoRouterApp_1.GetComponentComp1);
                        }
                        cb(null, DemoRouterApp_1.GetComponentComp2);
                    } }),
                React.createElement(react_router_2.Route, { onEnter: onEnter, onLeave: onLeave, onChange: onChange, path: "error", getComponent: function (nextState, cb) {
                        cb(new Error("Error thrown by getComponent"), null);
                    } })),
            React.createElement(routeProviders_1.ReduxRoute, { store: store, change: function (state, route) { route.path = state.is404Active ? "*" : ""; }, path: "", component: DemoRouterApp_1.PageNotFound })))), document.getElementById("example"));
//# sourceMappingURL=index.js.map