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
//ReactDOM.render(
//    <CrosswordPuzzleApp/>,
//    document.getElementById("example")
//);
var anyWindow = window;
var history = react_router_1.useRouterHistory(history_1.createHistory)({
    basename: '/react-sun-crossword'
});
var middleware = react_router_redux_1.routerMiddleware(history);
var store = redux_1.createStore(redux_1.combineReducers({
    rootReducer: DemoRouterApp_1.rootReducer,
    router: react_router_redux_1.routerReducer
}), redux_devtools_extension_1.composeWithDevTools(redux_1.applyMiddleware(middleware)));
//note that if want to be able to change then needs to be an object
var additionalPropsValue = { additional: "This is additional" };
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
ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
    React.createElement(react_router_2.Router, { history: history },
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
            React.createElement(react_router_2.Route, { path: "redirect", onEnter: onEnter, onLeave: onLeave, onChange: onChange })))), document.getElementById("example"));
//# sourceMappingURL=index.js.map