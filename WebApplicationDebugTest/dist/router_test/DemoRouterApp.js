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
var react_router_1 = require("react-router");
var react_router_2 = require("react-router");
var react_redux_1 = require("react-redux");
var react_json_view_1 = require("react-json-view");
var react_router_redux_1 = require("react-router-redux");
var Modal = require("react-modal"); //https://github.com/reactjs/react-modal/issues/497
var routeProviders_1 = require("./routeProviders");
var reactHelpers_1 = require("../helpers/reactHelpers");
react_json_view_1.default.displayName = "ReactJsonView";
//#endregion
//#endregion
//#region js helpers
function clone(orig, blacklistedProps) {
    var newProps = {};
    Object.keys(orig).forEach(function (key) {
        if (!blacklistedProps || blacklistedProps.indexOf(key) == -1) {
            newProps[key] = orig[key];
        }
    });
    return newProps;
}
//#endregion
//#region v3 route components
//#region link styling
//should create a hoc styled link
var linkActiveStyle = {
    color: "yellow"
};
var linkStyle = {
    margin: "5px"
};
var StyledLink = (function (_super) {
    __extends(StyledLink, _super);
    function StyledLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StyledLink.prototype.render = function () {
        return React.createElement(react_router_1.Link, __assign({ style: linkStyle, activeStyle: linkActiveStyle }, this.props), this.props.children);
    };
    return StyledLink;
}(React.Component));
var RelativeLinksParent = (function (_super) {
    __extends(RelativeLinksParent, _super);
    function RelativeLinksParent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RelativeLinksParent.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement(routeProviders_1.RelativeLink, { relativePath: "relative", activeStyle: linkActiveStyle, style: linkStyle }, "Relative"),
            React.createElement(Container, null, this.props.children));
    };
    return RelativeLinksParent;
}(React.Component));
exports.RelativeLinksParent = RelativeLinksParent;
var RelativeLinksChild = (function (_super) {
    __extends(RelativeLinksChild, _super);
    function RelativeLinksChild() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RelativeLinksChild.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement(routeProviders_1.RelativeLink, { relativePath: "relative", activeStyle: linkActiveStyle, style: linkStyle }, "Relative"),
            React.createElement(Container, null, this.props.children));
    };
    return RelativeLinksChild;
}(React.Component));
exports.RelativeLinksChild = RelativeLinksChild;
//export const WithRelativeLinksParent = withRelativeLink(wrapMountDispatch(RelativeLinksParent));
//export const WithRelativeLinksChild = withRelativeLink(wrapMountDispatch(RelativeLinksChild));
//export const WithRelativeLinksParent = withRelativeLink(RelativeLinksParent);
//export const WithRelativeLinksChild = withRelativeLink(RelativeLinksChild);
var RelativeLinkParentMatched = (function (_super) {
    __extends(RelativeLinkParentMatched, _super);
    function RelativeLinkParentMatched() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RelativeLinkParentMatched.prototype.render = function () {
        return React.createElement("div", null, "Relative link matched from parent");
    };
    return RelativeLinkParentMatched;
}(React.Component));
exports.RelativeLinkParentMatched = RelativeLinkParentMatched;
var RelativeLinkChildMatched = (function (_super) {
    __extends(RelativeLinkChildMatched, _super);
    function RelativeLinkChildMatched() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RelativeLinkChildMatched.prototype.render = function () {
        return React.createElement("div", null, "Relative link matched from child");
    };
    return RelativeLinkChildMatched;
}(React.Component));
exports.RelativeLinkChildMatched = RelativeLinkChildMatched;
//export const MountDispatchRelativeLinkParentMatched = wrapMountDispatch(RelativeLinkParentMatched);
//export const MountDispatchRelativeLinkChildMatched = wrapMountDispatch(RelativeLinkChildMatched);
//#endregion
//#region actions/reducers/state/selectors
//#region toggle
var TOGGLE_404_ACTIVE = "TOGGLE_404_ACTIVE";
//action creator
function toggle404Active() {
    return {
        type: TOGGLE_404_ACTIVE
    };
}
function is404Active(state, action) {
    if (state === void 0) { state = false; }
    if (action.type == TOGGLE_404_ACTIVE) {
        return !state;
    }
    return state;
}
exports.is404Active = is404Active;
function is404ActiveSelector(state) {
    return state.is404Active;
}
//#endregion
//#region errors
var TOGGLE_HANDLE_ROUTE_ERROR = "TOGGLE_HANDLE_ROUTE_ERROR";
var ROUTE_ERROR = "ROUTE_ERROR";
var CLEAR_ROUTE_ERROR = "CLEAR_ROUTE_ERROR";
function toggleHandleRouteError() {
    var action = {
        type: TOGGLE_HANDLE_ROUTE_ERROR,
    };
    return action;
}
function handleRouteError(state, action) {
    if (state === void 0) { state = false; }
    if (action.type === TOGGLE_HANDLE_ROUTE_ERROR) {
        return !state;
    }
    return state;
}
exports.handleRouteError = handleRouteError;
function routeError(error) {
    var action = {
        type: ROUTE_ERROR,
        error: error
    };
    return action;
}
exports.routeError = routeError;
function clearRouteError() {
    var action = {
        type: CLEAR_ROUTE_ERROR,
    };
    return action;
}
function routeErrorDetails(state, action) {
    if (state === void 0) { state = ""; }
    switch (action.type) {
        case ROUTE_ERROR:
            return action.error.message;
        case CLEAR_ROUTE_ERROR:
            return "";
        default:
            return state;
    }
}
exports.routeErrorDetails = routeErrorDetails;
function routeErrorSelector(state) {
    return state.routeErrorDetails;
}
function handleRouteErrorSelector(state) {
    return state.handleRouteError;
}
exports.handleRouteErrorSelector = handleRouteErrorSelector;
//#endregion
//#region hookOrMount
var HOOK_OR_MOUNT = "HOOK_OR_MOUNT";
//note that this does not agree with flux standard actions
function hookOrMountActionCreator(type, details) {
    return {
        type: HOOK_OR_MOUNT,
        hookOrMountType: type,
        details: details
    };
}
exports.hookOrMountActionCreator = hookOrMountActionCreator;
var ENTERHOOK = "EnterHook";
var LEAVEHOOK = "LeaveHook";
var CHANGEHOOK = "ChangeHook";
var ONUPDATE = "OnUpdate";
function hooksAndMountsSelector(state) {
    return state.hooksAndMounts;
}
function mapComponentName(component) {
    if (component === null) {
        return "null";
    }
    if (component === undefined) {
        return "undefined";
    }
    var componentName = component.displayName ? component.displayName : component.name;
    return componentName;
}
function mapComponents(components) {
    var filteredComponents = {};
    Object.keys(components).forEach(function (k) {
        var component = components[k];
        filteredComponents[k] = mapComponentName(component);
    });
    return filteredComponents;
}
function mapRoute(route) {
    //could have used object destructuring and ...rest
    var mappedRoute = clone(route, ["parentRoute", "getComponent", "getComponents", "onEnter", "onChange", "onLeave", "getChildRoutes", "getIndexRoute", "indexRoute", "childRoutes", "component", "components"]);
    if (route.component) {
        mappedRoute.component = mapComponentName(route.component);
    }
    if (route.components) {
        mappedRoute.components = mapComponents(route.components);
    }
    if (route.indexRoute) {
        mappedRoute.indexRoute = mapIndexRoute(route.indexRoute);
    }
    if (route.childRoutes) {
        mappedRoute.childRoutes = mapRoutes(route.childRoutes);
    }
    return mappedRoute;
}
function mapIndexRoute(indexRoute) {
    return mapRoute(indexRoute);
}
function mapRoutes(routes) {
    return routes.map(function (route) {
        return mapRoute(route);
    });
}
function mapRouterState(routerState) {
    var mappedState = {
        location: cloneLocation(routerState.location),
        params: routerState.params,
        routes: mapRoutes(routerState.routes)
    };
    if (routerState.components) {
        mappedState.components = routerState.components.map(function (c) { return mapComponentName(c); });
    }
    else {
        mappedState.components = routerState.components;
    }
    return mappedState;
}
function hooksAndMounts(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case HOOK_OR_MOUNT:
            var hookOrMountAction = action;
            var details = hookOrMountAction.details;
            if (hookOrMountAction.hookOrMountType == ENTERHOOK) {
                details = { routeId: details.routeId, nextState: mapRouterState(details.nextState) };
            }
            else if (hookOrMountAction.hookOrMountType == LEAVEHOOK) {
                details = { routeId: details.routeId, prevState: mapRouterState(details.prevState) };
            }
            else if (hookOrMountAction.hookOrMountType == CHANGEHOOK) {
                details = { routeId: details.routeId, prevState: mapRouterState(details.prevState), nextState: mapRouterState(details.nextState) };
            }
            var newHookOrMountDetail;
            if (details) {
                newHookOrMountDetail = {
                    type: hookOrMountAction.hookOrMountType,
                    details: details
                };
            }
            else {
                newHookOrMountDetail = {
                    type: hookOrMountAction.hookOrMountType,
                };
            }
            return state.concat([newHookOrMountDetail]);
        default:
            return state;
    }
}
exports.hooksAndMounts = hooksAndMounts;
//#endregion
//#region layout components
var Container = (function (_super) {
    __extends(Container, _super);
    function Container() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Container.prototype.render = function () {
        return React.createElement("div", { style: { padding: "10px", borderStyle: "solid", borderColor: "green", borderWidth: "2px" } }, this.props.children);
    };
    return Container;
}(React.Component));
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("div", null, "This is the app, has children from sub routes including the index route"),
            React.createElement(react_router_2.IndexLink, { style: linkStyle, activeStyle: linkActiveStyle, to: "/" }, "Introduction"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/pathless" }, "Pathless root"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/pathlessChild" }, "Pathless"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/multiple" }, "Multiple"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/many" }, "Redirected"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/redirect" }, "Redirect in hook"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/additionalProps" }, "Additional props"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/leaveHook" }, "Leave hook"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/propsFromParent" }, "Props from parent"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/navigation" }, "Nav/Matching"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/getComponentError" }, "GetComponent/Error"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/relativeLinks" }, "Relative links"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/relativeLinks/relativeLinksChild" }, "Relative Links Child"),
            React.createElement(ReactJsonContainer, null),
            React.createElement(Modal, { isOpen: this.props.routeErrorDetails !== "", onRequestClose: function () { _this.props.clearRouteError(); } },
                React.createElement("div", null,
                    React.createElement("div", null, "There has been an error !!!"),
                    React.createElement("div", null, this.props.routeErrorDetails))),
            React.createElement(Container, null, this.props.children));
    };
    return App;
}(React.Component));
exports.ConnectedApp = react_redux_1.connect(function (state) {
    return {
        routeErrorDetails: routeErrorSelector(state)
    };
}, (function (dispatch) {
    return {
        clearRouteError: function () {
            dispatch(clearRouteError());
        }
    };
}))(App);
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
                dispatch(hookOrMountActionCreator(isMount ? "ComponentDidMount" : "ComponentWillUnmount", { componentName: componentName }));
            }
        };
        return wrapperProps;
    }))(wrapper);
    return connected;
    var _a;
}
var ReactJsonContainer = react_redux_1.connect(function (state) {
    return {
        src: {
            hookAndMounts: hooksAndMountsSelector(state)
        }
    };
})(react_json_view_1.default);
//#endregion
//#region Introduction
var Introduction = (function (_super) {
    __extends(Introduction, _super);
    function Introduction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Introduction.prototype.render = function () {
        return React.createElement("div", null, "This is the introduction - the index route");
    };
    return Introduction;
}(React.Component));
exports.Introduction = Introduction;
//export const MountDispatchIntroduction = wrapMountDispatch(Introduction);
//#endregion
//#region Pathless
var Pathless = (function (_super) {
    __extends(Pathless, _super);
    function Pathless() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pathless.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("div", null, "This component can have a child whose path is not a subpath"),
            React.createElement(Container, null, this.props.children));
    };
    return Pathless;
}(React.Component));
exports.Pathless = Pathless;
//export const MountDispatchPathless = wrapMountDispatch(Pathless);
var PathlessIndex = (function (_super) {
    __extends(PathlessIndex, _super);
    function PathlessIndex() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PathlessIndex.prototype.render = function () {
        return "This is the index route component";
    };
    return PathlessIndex;
}(React.Component));
exports.PathlessIndex = PathlessIndex;
//export const MountDispatchPathlessIndex = wrapMountDispatch(PathlessIndex);
var PathlessChild = (function (_super) {
    __extends(PathlessChild, _super);
    function PathlessChild() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PathlessChild.prototype.render = function () {
        return "This component has been rendered without its route being a subpath";
    };
    return PathlessChild;
}(React.Component));
exports.PathlessChild = PathlessChild;
//export const MountDispatchPathlessChild = wrapMountDispatch(PathlessChild);
//#endregion
//#region multiple
var Multiple = (function (_super) {
    __extends(Multiple, _super);
    function Multiple() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Multiple.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("div", null, "This route component receives child components through a matching child route's components property"),
            React.createElement(Container, null, this.props["child1"]),
            React.createElement(Container, null, this.props["child2"]));
    };
    return Multiple;
}(React.Component));
exports.Multiple = Multiple;
//export const MountDispatchMultiple = wrapMountDispatch(Multiple);
var MultipleChild1 = (function (_super) {
    __extends(MultipleChild1, _super);
    function MultipleChild1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MultipleChild1.prototype.render = function () {
        return "Child1 from Route components property";
    };
    return MultipleChild1;
}(React.Component));
exports.MultipleChild1 = MultipleChild1;
//export const MountDispatchMultipleChild1 = wrapMountDispatch(MultipleChild1);
var MultipleChild2 = (function (_super) {
    __extends(MultipleChild2, _super);
    function MultipleChild2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MultipleChild2.prototype.render = function () {
        return "Child2 from Route components property";
    };
    return MultipleChild2;
}(React.Component));
exports.MultipleChild2 = MultipleChild2;
//export const MountDispatchMultipleChild2 = wrapMountDispatch(MultipleChild2);
//#endregion
//#region additional props
var AdditionalProps = (function (_super) {
    __extends(AdditionalProps, _super);
    function AdditionalProps() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdditionalProps.prototype.render = function () {
        var additionalProp = this.props.route.additionalProp.additional;
        return React.createElement("div", null, "Received additional prop from route " + additionalProp);
    };
    return AdditionalProps;
}(React.Component));
exports.AdditionalProps = AdditionalProps;
var LeaveHookComponent = (function (_super) {
    __extends(LeaveHookComponent, _super);
    function LeaveHookComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleCanLeave = function () {
            _this.setState(function (prevState, props) {
                return { canLeave: !prevState.canLeave };
            });
        };
        _this.state = { canLeave: false };
        return _this;
    }
    LeaveHookComponent.prototype.componentDidMount = function () {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    };
    LeaveHookComponent.prototype.routerWillLeave = function (nextLocation) {
        // return false to prevent a transition w/o prompting the user,
        // or return a string to allow the user to decide:
        // return `null` or nothing to let other hooks to be executed
        //
        // NOTE: if you return true, other hooks will not be executed!
        if (!this.state.canLeave)
            return "Please don't leave. Ok to leave, cancel to stay";
    };
    LeaveHookComponent.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("button", { onClick: this.toggleCanLeave }, this.state.canLeave ? "Can leave" : "Can't leave"));
    };
    return LeaveHookComponent;
}(React.Component));
exports.LeaveHookComponent = LeaveHookComponent;
var PropsFromParentParent = (function (_super) {
    __extends(PropsFromParentParent, _super);
    function PropsFromParentParent(props) {
        var _this = _super.call(this, props) || this;
        _this.changeState = function () {
            _this.setState({ someState: "Change by parent" });
        };
        _this.state = { someState: "Initial from parent" };
        return _this;
    }
    PropsFromParentParent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("button", { onClick: this.changeState }, "Change state"),
            React.createElement(Container, null, React.Children.map(this.props.children, function (c) { return React.cloneElement(c, { someState: _this.state.someState }); })));
    };
    return PropsFromParentParent;
}(React.Component));
exports.PropsFromParentParent = PropsFromParentParent;
//export const MountDispatchPropsFromParentParent = wrapMountDispatch(PropsFromParentParent);
var PropsFromParentChild = (function (_super) {
    __extends(PropsFromParentChild, _super);
    function PropsFromParentChild() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PropsFromParentChild.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("div", null, "this prop has come from parent:" + this.props.someState),
            React.createElement("div", null, "this prop ( location.pathname ) has come from the router: " + this.props.location.pathname));
    };
    return PropsFromParentChild;
}(React.Component));
exports.PropsFromParentChild = PropsFromParentChild;
var Navigation = (function (_super) {
    __extends(Navigation, _super);
    function Navigation(props) {
        var _this = _super.call(this, props) || this;
        _this.doPush = function () {
            _this.props.navThroughDispatch("/leaveHook");
        };
        _this.incrementLinkState = function () {
            _this.setState(function (prevState) {
                return { someState: prevState.someState + 1 };
            });
        };
        _this.state = { someState: 0 };
        return _this;
    }
    Navigation.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("div", null, "Matching"),
                React.createElement("br", null),
                React.createElement("div", null,
                    React.createElement("div", null, "Params"),
                    React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/navigation/params/someParamValue1/greedySplat1MatchPart" }, "Params 1"),
                    React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/navigation/params/someParamValue2/greedySplat2MatchPart" }, "Params 2")),
                React.createElement("div", null,
                    React.createElement("div", null, "Optional"),
                    React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/navigation/optionalPartNotOptional" }, "Optional 1"),
                    React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/navigation/NotOptional" }, "Optional 2"))),
            React.createElement("br", null),
            React.createElement("div", null, "--------------------------"),
            React.createElement("br", null),
            React.createElement("div", null,
                React.createElement("div", null, "No match"),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/navigation/noMatchingChildRoute" }, "No matching child route"),
                React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/noMatchingRoute" }, "No matching route"),
                React.createElement("br", null),
                React.createElement("button", { onClick: this.props.toggle404Active }, this.props.is404Active ? "Deactivate 404" : "Activate 404")),
            React.createElement("br", null),
            React.createElement("div", null, "--------------------------"),
            React.createElement("br", null),
            React.createElement("div", null,
                React.createElement("div", null, "Query/Search & State"),
                React.createElement("br", null),
                React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: { pathname: "/navigation/querySearchState", search: "?someSearch", state: { someState: this.state.someState } } }, "Search + State"),
                React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: { pathname: "/navigation/querySearchState", query: { someQuery1: "someQuery1Value", someQuery2: "someQuery2Value" }, state: { someState: this.state.someState } } }, "Query + State"),
                React.createElement("button", { onClick: this.incrementLinkState }, "Increment link state")),
            React.createElement("br", null),
            React.createElement("div", null, "--------------------------"),
            React.createElement("br", null),
            React.createElement("button", { onClick: this.doPush }, "Test push ( leave hook )"),
            React.createElement("br", null),
            React.createElement("div", null, "--------------------------"),
            React.createElement("br", null),
            React.createElement(Container, null, this.props.children));
    };
    return Navigation;
}(React.Component));
//export const MountDispatchNavigation = wrapMountDispatch(connect(
//    (routerAppState: RouterAppState) => {
//        var stateToProps:NavigationStateToProps= {
//            is404Active: is404ActiveSelector(routerAppState)
//        }
//        return stateToProps;
//    },
//    (dispatch) => {
//        var mappedDispatch: NavigationDispatchProps = {
//            navThroughDispatch: function (location: LocationDescriptor) {
//                dispatch(push(location));
//            },
//            toggle404Active: function () {
//                dispatch(toggle404Active());
//            }
//        }
//        return mappedDispatch;
//})(Navigation));
exports.ConnectedNavigation = react_redux_1.connect(function (routerAppState) {
    var stateToProps = {
        is404Active: is404ActiveSelector(routerAppState)
    };
    return stateToProps;
}, function (dispatch) {
    var mappedDispatch = {
        navThroughDispatch: function (location) {
            dispatch(react_router_redux_1.push(location));
        },
        toggle404Active: function () {
            dispatch(toggle404Active());
        }
    };
    return mappedDispatch;
})(Navigation);
function cloneLocation(location) {
    var clonedLocation = clone(location, []);
    clonedLocation.query = clone(location.query, []);
    return clonedLocation;
}
function createNavigationComponent(Component) {
    //var MountDispatchComponent = wrapMountDispatch(Component);
    var wrapper = (_a = (function (_super) {
            __extends(ReactJsonRoutePropsWrapper, _super);
            function ReactJsonRoutePropsWrapper() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ReactJsonRoutePropsWrapper.prototype.render = function () {
                var location = cloneLocation(this.props.location);
                //<MountDispatchComponent {...this.props} />
                return React.createElement("div", null,
                    React.createElement(Component, __assign({}, this.props)),
                    React.createElement(react_json_view_1.default, { src: { location: location, params: this.props.params, routeParams: this.props.routeParams } }));
            };
            return ReactJsonRoutePropsWrapper;
        }(React.Component)),
        //static displayName = getWrapperComponentName("ReactJsonRoutePropsWrapper", MountDispatchComponent);
        _a.displayName = reactHelpers_1.getWrapperComponentName("ReactJsonRoutePropsWrapper", Component),
        _a);
    return wrapper;
    var _a;
}
var PageNotFound = (function (_super) {
    __extends(PageNotFound, _super);
    function PageNotFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PageNotFound.prototype.render = function () {
        return React.createElement("div", null, "Page Not Found");
    };
    return PageNotFound;
}(React.Component));
exports.PageNotFound = PageNotFound;
var ParamParent = (function (_super) {
    __extends(ParamParent, _super);
    function ParamParent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParamParent.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("div", null, "ParamParent"),
            React.createElement(Container, null, this.props.children));
    };
    return ParamParent;
}(React.Component));
var ParamChild = (function (_super) {
    __extends(ParamChild, _super);
    function ParamChild() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParamChild.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("div", null, "ParamChild"));
    };
    return ParamChild;
}(React.Component));
var Optional = (function (_super) {
    __extends(Optional, _super);
    function Optional() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Optional.prototype.render = function () {
        return React.createElement("div", null, "Optional");
    };
    return Optional;
}(React.Component));
var QuerySearchState = (function (_super) {
    __extends(QuerySearchState, _super);
    function QuerySearchState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuerySearchState.prototype.render = function () {
        return React.createElement("div", null, "Query Search State");
    };
    return QuerySearchState;
}(React.Component));
var GetComponentError = (function (_super) {
    __extends(GetComponentError, _super);
    function GetComponentError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetComponentError.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("div", null, "The link below is to a route that provides the component using the getComponent method."),
            React.createElement("div", null, "To demonstrate that the component is provided lazily use the two links below which provide state that getComponent uses to determine the component"),
            React.createElement(StyledLink, { to: { pathname: "/getComponentError/getComponent", state: { isComponent1: true } } }, "Choose component 1"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: { pathname: "/getComponentError/getComponent", state: { isComponent1: false } } }, "Choose component 2"),
            React.createElement("br", null),
            React.createElement("div", null, "The Router also allow for handling of errors - such as those thrown by getComponent"),
            React.createElement("div", null, "The link below is matched by a route that will throw from getComponent"),
            React.createElement(react_router_1.Link, { to: "/getComponentError/error" }, "Throw"),
            React.createElement("div", null, "Use the button below to toggle adding a handler"),
            React.createElement("button", { onClick: function () { _this.props.toggleHandleRouterError(); } }, this.props.handleRouterError ? "Remove handler" : "Add handler"),
            React.createElement(Container, null, this.props.children));
    };
    return GetComponentError;
}(React.Component));
exports.ConnectedGetComponentError = react_redux_1.connect(function (state) {
    return {
        handleRouterError: handleRouteErrorSelector(state)
    };
}, function (dispatch) {
    return {
        toggleHandleRouterError: function () {
            dispatch(toggleHandleRouteError());
        }
    };
})(GetComponentError);
var GetComponentComp1 = (function (_super) {
    __extends(GetComponentComp1, _super);
    function GetComponentComp1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetComponentComp1.prototype.render = function () {
        return React.createElement("div", null, "Component 1");
    };
    return GetComponentComp1;
}(React.Component));
exports.GetComponentComp1 = GetComponentComp1;
var GetComponentComp2 = (function (_super) {
    __extends(GetComponentComp2, _super);
    function GetComponentComp2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetComponentComp2.prototype.render = function () {
        return React.createElement("div", null, "Component 2");
    };
    return GetComponentComp2;
}(React.Component));
exports.GetComponentComp2 = GetComponentComp2;
exports.ReactJsonRoutePropsParamParent = createNavigationComponent(ParamParent);
exports.ReactJsonRoutePropsParamChild = createNavigationComponent(ParamChild);
exports.ReactJsonRoutePropsOptional = createNavigationComponent(Optional);
exports.ReactJsonRoutePropsQuerySearchState = createNavigationComponent(QuerySearchState);
//#region demo action
var DEMO_CHANGE_STRING = "DEMO_CHANGE_STRING";
function changeDemoStateStringAction(newString) {
    return {
        type: DEMO_CHANGE_STRING,
        text: newString
    };
}
exports.changeDemoStateStringAction = changeDemoStateStringAction;
//#endregion
function reducer(state, action) {
    if (state === void 0) { state = { demoValue: "", someOtherValue: 9 }; }
    switch (action.type) {
        case DEMO_CHANGE_STRING:
            return {
                demoValue: action.text,
                someOtherValue: state.someOtherValue
            };
        default:
            return state;
    }
}
exports.reducer = reducer;
var DemoPresentationComponent = (function (_super) {
    __extends(DemoPresentationComponent, _super);
    function DemoPresentationComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { inputValue: "" };
        return _this;
    }
    DemoPresentationComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("button", { onClick: function () { _this.props.demoDispatchAction(_this.state.inputValue); } }, "Dispatch action"),
            React.createElement("div", null, this.props.demoValue),
            React.createElement("input", { type: "text", value: this.state.inputValue, onChange: function (evt) { return _this.setState({ inputValue: evt.target.value }); } }));
    };
    return DemoPresentationComponent;
}(React.Component));
//#region connected component
var mapDispatchToProps = function (dispatch) {
    var dispatchToProps = {
        demoDispatchAction: function (newValue) {
            dispatch(changeDemoStateStringAction(newValue));
        }
    };
    return dispatchToProps;
};
//selector
var getDemoStateProps = function (state) {
    var demoState = {
        demoValue: state.demoValue
    };
    return demoState;
};
var mapStateToProps = function (state) {
    return getDemoStateProps(state);
};
exports.ConnectedDemoPresentationComponent = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(DemoPresentationComponent);
//#endregion
//#endregion
//#region original route components
//#region v4 DisableLink
//interface DisableProps {
//    enabled: boolean
//    linkText: string
//}
//interface DisableLinkProps extends LinkProps, DisableProps { }
//export class DisableLink extends React.Component<DisableLinkProps, undefined> {
//    render() {
//        var element = this.props.enabled ? <span className="disableLinkDisabled">{this.props.linkText}</span> : <Link to={this.props.to} replace={this.props.replace}>{this.props.linkText}</Link>
//        return element;
//    }
//}
//#endregion
//export class Introduction extends React.Component<RouteComponentProps<any>, undefined> {
//    constructor(props) {
//        super(props);
//    }
//    render() {
//        return <div>This is an introduction</div>
//    }
//}
////could read the type and provide the appropriate ui
////interface Setting {
////    defaultValue: any,
////    label: string,
////    id:string
////}
//interface SettingsState {
//    storageAvailable: boolean,
//    booleanSetting: boolean,
//    stringSetting: string,
//    numberSetting: number
//}
//export class Settings extends React.Component<undefined, SettingsState> {
//    storage: Storage;
//    storageAvailable: boolean;
//    constructor(props:any) {
//        super(props);
//        this.storageAvailable = this.isStorageAvailable("localStorage");
//        this.storage = window["localStorage"];
//        this.state={ storageAvailable: this.storageAvailable, booleanSetting: this.getTypedStorageItem("booleanSetting", false), stringSetting: this.getTypedStorageItem("stringSetting", "Default value"), numberSetting: this.getTypedStorageItem("numberSetting", 1) };
//    }
//    getTypedStorageItem(itemKey: string, defaultValue: any): any {
//        if (!this.storageAvailable) {
//            return defaultValue;
//        }
//        var setting = this.storage.getItem(itemKey);
//        if (setting != null) {
//            return JSON.parse(setting);
//        }
//        return defaultValue;
//    }
//    setTypedStorageItem(itemKey: string, value: any) {
//        this.storage.setItem(itemKey, JSON.stringify(value));
//    }
//    isStorageAvailable(type) {
//        try {
//            var storage = window[type],
//                x = '__storage_test__';
//            storage.setItem(x, x);
//            storage.removeItem(x);
//            return true;
//        }
//        catch (e) {
//            return e instanceof DOMException && (
//                // everything except Firefox
//                e.code === 22 ||
//                // Firefox
//                e.code === 1014 ||
//                // test name field too, because code might not be present
//                // everything except Firefox
//                e.name === 'QuotaExceededError' ||
//                // Firefox
//                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
//                // acknowledge QuotaExceededError only if there's something already stored
//                storage.length !== 0;
//        }
//    }
//    stringSettingChanged = (event) => {
//        var stringSetting = event.target.value;
//        this.setState({ stringSetting: stringSetting });
//        if (this.storageAvailable) {
//            //Dates not parsed - there is a reviver function ....
//            this.setTypedStorageItem("stringSetting", stringSetting);
//        }
//    }
//    render() {
//        return <div>
//            {!this.state.storageAvailable &&
//                <div>Local storage is not available in your browser, settings will not be persisted</div>
//            }
//            <input type="text" value={this.state.stringSetting} onChange={this.stringSettingChanged}/>
//        </div>
//    }
//}
//interface CrosswordState {
//    hasCrossword: boolean,
//}
//interface IgnoreParams {
//}
////var crosswordState = { hasCrossword: false, previousNavToCrossword:false };
//interface NavState {
//    hasCrossword: boolean,
//    previousNavToCrossword:boolean
//}
//export class Crossword extends React.Component<RouteComponentProps<IgnoreParams>, CrosswordState> {
//    navState :NavState
//    constructor(props) {
//        super(props);
//        //will state be null if not set ? or {}
//        this.navState = props.location.state ? props.location.state : {
//            hasCrossword: false,
//            previousNavToCrossword: false
//        }
//        this.state = { hasCrossword: this.navState.hasCrossword };
//    }
//    updateNavState() {
//        //this.props.match.url is incorrect - does not show the search !
//        var url = this.props.location.pathname + this.props.location.search;
//        window.setTimeout(() => {
//            this.props.history.replace(url, this.navState);
//        },0)
//    }
//    toggleHasCrossword = () => {
//        this.setState((prevState) => {
//            var hasCrossword = !prevState.hasCrossword;
//            this.navState.hasCrossword = hasCrossword;
//            this.updateNavState();
//            return {
//                hasCrossword: hasCrossword
//            }
//        });
//    }
//    getChooserSearch = () => {
//        return "?chooser";
//    }
//    getPlaySearch = () => {
//        return "?play";
//    }
//    //need to check the differece between match url and path !
//    getNonExactElement = () => {
//        if (this.props.location.search==this.getPlaySearch())
//        {
//            if (this.state.hasCrossword) {
//                if (!this.navState.previousNavToCrossword) {
//                    this.navState.previousNavToCrossword = true;
//                    this.updateNavState();
//                }
//                return <DemoCrossword />
//            }
//            return <Redirect to={{ pathname: this.props.match.url, search: this.getChooserSearch() }} />
//        } else if (this.props.location.search == this.getChooserSearch()) {
//            if (this.navState.previousNavToCrossword) {
//                this.navState.previousNavToCrossword = false;
//                this.updateNavState();
//            }
//            return <DemoCrosswordChooser />
//        } else {
//            //should redirect to bad path ?
//            return null;
//        }
//    }
//    render() {
//        console.log("Render: " + this.props.location.pathname);
//        //search could be null or undefined ?
//        //match.isExact is returning true when have the query string which is not specified in the link !!!
//        if (this.props.location.pathname === "/crossword" && this.props.location.search == "") {
//            console.log("redirecting");
//            //will this replace the state !!!!!!??????
//            //
//            return <Redirect to={{ pathname: this.props.match.url,search:this.navState.previousNavToCrossword ? this.getChooserSearch() : this.getPlaySearch() }} />
//        }
//        //if I remove Route will I get the re-render when redirect
//        return <div>
//            <button onClick={this.toggleHasCrossword}>{this.state.hasCrossword.toString()}</button>
//            <DisableNavLink activeStyle={navLinkActiveStyle} enabled={!this.state.hasCrossword} linkText="Play" to={{ pathname: this.props.match.url, search:"?play"}} />
//            <NavLink activeStyle={navLinkActiveStyle} to={{ pathname: this.props.match.url, search: "?chooser" }}>Chooser</NavLink>
//            {this.getNonExactElement()}
//        </div>
//    }
//}
//export class DemoCrosswordChooser extends React.Component<undefined, undefined> {
//    render() {
//        return <div>Crossword chooser to go here</div>
//    }
//}
//export class DemoCrossword extends React.Component<undefined, undefined> {
//    render() {
//        return <div>This is where the crossword, clues and buttons go !</div>
//    }
//}
//#endregion
//# sourceMappingURL=DemoRouterApp.js.map