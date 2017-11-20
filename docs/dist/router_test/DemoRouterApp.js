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
//#region v3 route components
//#region link styling
//should create a hoc styled link
var linkActiveStyle = {
    color: "yellow"
};
var linkStyle = {
    margin: "5px"
};
//#endregion
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
exports.Container = Container;
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
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
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/onChange/change1" }, "On change child route 1"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/onChange/change2" }, "On change child route 2"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/navigation" }, "Nav/Matching"),
            React.createElement(ReactJsonContainer, null),
            React.createElement(Container, null, this.props.children));
    };
    return App;
}(React.Component));
exports.App = App;
function wrapMountDispatch(Component, displayName) {
    var wrapper = (function (_super) {
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
    }(React.Component));
    var connected = react_redux_1.connect(null, (function (dispatch) {
        var wrapperProps = {
            mountUnmount: function (isMount) {
                dispatch(hookOrMountActionCreator(isMount ? "ComponentDidMount" : "ComponentWillUnmount", { componentName: displayName }));
            }
        };
        return wrapperProps;
    }))(wrapper);
    connected.displayName = displayName;
    return connected;
}
//#endregion
var ReactJsonContainer = react_redux_1.connect(function (state, ownProps) {
    return {
        src: {
            hookAndMounts: hooksAndMountsSelector(state)
        }
    };
})(react_json_view_1.default);
//#region Introduction
var IntroductionComp = (function (_super) {
    __extends(IntroductionComp, _super);
    function IntroductionComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntroductionComp.prototype.render = function () {
        return "This is the introduction - the index route";
    };
    return IntroductionComp;
}(React.Component));
exports.IntroductionComp = IntroductionComp;
exports.Introduction = wrapMountDispatch(IntroductionComp, "Introduction");
//#endregion
//#region Pathless
var PathlessComp = (function (_super) {
    __extends(PathlessComp, _super);
    function PathlessComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PathlessComp.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("div", null, "This component can have a child whose path is not a subpath"),
            React.createElement(Container, null, this.props.children));
    };
    return PathlessComp;
}(React.Component));
exports.PathlessComp = PathlessComp;
exports.Pathless = wrapMountDispatch(PathlessComp, "Pathless");
var PathlessIndexComp = (function (_super) {
    __extends(PathlessIndexComp, _super);
    function PathlessIndexComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PathlessIndexComp.prototype.render = function () {
        return "This is the index route component";
    };
    return PathlessIndexComp;
}(React.Component));
exports.PathlessIndexComp = PathlessIndexComp;
exports.PathlessIndex = wrapMountDispatch(PathlessIndexComp, "PathlessIndex");
var PathlessChildComp = (function (_super) {
    __extends(PathlessChildComp, _super);
    function PathlessChildComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PathlessChildComp.prototype.render = function () {
        return "This component has been rendered without its route being a subpath";
    };
    return PathlessChildComp;
}(React.Component));
exports.PathlessChildComp = PathlessChildComp;
exports.PathlessChild = wrapMountDispatch(PathlessChildComp, "PathlessChild");
//#endregion
//#region multiple
var MultipleComp = (function (_super) {
    __extends(MultipleComp, _super);
    function MultipleComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MultipleComp.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("div", null, "This route component receives child components through a matching child route's components property"),
            React.createElement(Container, null, this.props["child1"]),
            React.createElement(Container, null, this.props["child2"]));
    };
    return MultipleComp;
}(React.Component));
exports.MultipleComp = MultipleComp;
exports.Multiple = wrapMountDispatch(MultipleComp, "Multiple");
var Child1Comp = (function (_super) {
    __extends(Child1Comp, _super);
    function Child1Comp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Child1Comp.prototype.render = function () {
        return "Child1 from Route components property";
    };
    return Child1Comp;
}(React.Component));
exports.Child1Comp = Child1Comp;
exports.Child1 = wrapMountDispatch(Child1Comp, "MultipleChild1");
var Child2Comp = (function (_super) {
    __extends(Child2Comp, _super);
    function Child2Comp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Child2Comp.prototype.render = function () {
        return "Child2 from Route components property";
    };
    return Child2Comp;
}(React.Component));
exports.Child2Comp = Child2Comp;
exports.Child2 = wrapMountDispatch(Child2Comp, "MultipleChild2");
//#endregion
//#region additional props
var AdditionalPropsComp = (function (_super) {
    __extends(AdditionalPropsComp, _super);
    function AdditionalPropsComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdditionalPropsComp.prototype.render = function () {
        var additionalProp = this.props.route.additionalProp.additional;
        return React.createElement("div", null, "Received additional prop from route " + additionalProp);
    };
    return AdditionalPropsComp;
}(React.Component));
exports.AdditionalPropsComp = AdditionalPropsComp;
exports.AdditionalProps = wrapMountDispatch(AdditionalPropsComp, "AdditionalProps");
var LeaveHookComponentComp = (function (_super) {
    __extends(LeaveHookComponentComp, _super);
    function LeaveHookComponentComp(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleCanLeave = function () {
            _this.setState(function (prevState, props) {
                return { canLeave: !prevState.canLeave };
            });
        };
        _this.state = { canLeave: false };
        return _this;
    }
    LeaveHookComponentComp.prototype.componentDidMount = function () {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    };
    LeaveHookComponentComp.prototype.routerWillLeave = function (nextLocation) {
        // return false to prevent a transition w/o prompting the user,
        // or return a string to allow the user to decide:
        // return `null` or nothing to let other hooks to be executed
        //
        // NOTE: if you return true, other hooks will not be executed!
        if (!this.state.canLeave)
            return "Please don't leave. Ok to leave, cancel to stay";
    };
    LeaveHookComponentComp.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("button", { onClick: this.toggleCanLeave }, this.state.canLeave ? "Can leave" : "Can't leave"));
    };
    return LeaveHookComponentComp;
}(React.Component));
exports.LeaveHookComponentComp = LeaveHookComponentComp;
exports.LeaveHookComponent = wrapMountDispatch(LeaveHookComponentComp, "LeaveHook");
//#endregion
//#region change component
var OnChangeComp = (function (_super) {
    __extends(OnChangeComp, _super);
    function OnChangeComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OnChangeComp.prototype.render = function () {
        return React.createElement("div", null,
            "By switching between the child routes, the onChange hook should be fired",
            React.createElement(Container, null, this.props.children));
    };
    return OnChangeComp;
}(React.Component));
exports.OnChangeComp = OnChangeComp;
exports.OnChangeComponent = wrapMountDispatch(OnChangeComp, "OnChange");
var OnChangeChild1Comp = (function (_super) {
    __extends(OnChangeChild1Comp, _super);
    function OnChangeChild1Comp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OnChangeChild1Comp.prototype.render = function () {
        return "On change child 1";
    };
    return OnChangeChild1Comp;
}(React.Component));
exports.OnChangeChild1Comp = OnChangeChild1Comp;
exports.OnChangeChild1 = wrapMountDispatch(OnChangeChild1Comp, "OnChangeChild1");
var OnChangeChild2Comp = (function (_super) {
    __extends(OnChangeChild2Comp, _super);
    function OnChangeChild2Comp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OnChangeChild2Comp.prototype.render = function () {
        return "On change child 2";
    };
    return OnChangeChild2Comp;
}(React.Component));
exports.OnChangeChild2Comp = OnChangeChild2Comp;
exports.OnChangeChild2 = wrapMountDispatch(OnChangeChild2Comp, "OnChangeChild2");
var PropsFromParentParentComp = (function (_super) {
    __extends(PropsFromParentParentComp, _super);
    function PropsFromParentParentComp(props) {
        var _this = _super.call(this, props) || this;
        _this.changeState = function () {
            _this.setState({ someState: "Change by parent" });
        };
        _this.state = { someState: "Initial from parent" };
        return _this;
    }
    PropsFromParentParentComp.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement("button", { onClick: this.changeState }, "Change state"),
            React.createElement(Container, null, React.Children.map(this.props.children, function (c) { return React.cloneElement(c, { someState: _this.state.someState }); })));
    };
    return PropsFromParentParentComp;
}(React.Component));
exports.PropsFromParentParentComp = PropsFromParentParentComp;
exports.PropsFromParentParent = wrapMountDispatch(PropsFromParentParentComp, "PropsFromParentParent");
var PropsFromParentChildComp = (function (_super) {
    __extends(PropsFromParentChildComp, _super);
    function PropsFromParentChildComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PropsFromParentChildComp.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("div", null, "this prop has come from parent:" + this.props.someState),
            React.createElement("div", null, "this prop ( location.pathname ) has come from the router: " + this.props.location.pathname));
    };
    return PropsFromParentChildComp;
}(React.Component));
exports.PropsFromParentChildComp = PropsFromParentChildComp;
exports.PropsFromParentChild = wrapMountDispatch(PropsFromParentChildComp, "PropsFromParentChild");
var NavigationComp = (function (_super) {
    __extends(NavigationComp, _super);
    function NavigationComp(props) {
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
    NavigationComp.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "params/someParamValue1/greedySplat1MatchPart" }, "Params 1"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "params/someParamValue2/greedySplat2MatchPart" }, "Params 2"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "optionalPartNotOptional" }, "Optional 1"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "NotOptional" }, "Optional 2"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "noMatchingChildRoute" }, "No matching child route"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: "/noMatchingRoute" }, "No matching route"),
            React.createElement(react_router_1.Link, { style: linkStyle, activeStyle: linkActiveStyle, to: { pathname: "querySearchState", query: "someQuery", search: "someSearch", state: { someState: this.state.someState } } }, "Query Searh State"),
            React.createElement("button", { onClick: this.doPush }, "Test push ( leave hook )"),
            React.createElement("button", { onClick: this.incrementLinkState }, "Increment link state"));
    };
    return NavigationComp;
}(React.Component));
exports.NavigationComp = NavigationComp;
exports.Navigation = wrapMountDispatch(react_redux_1.connect(null, function (dispatch) {
    var mappedDispatch = {
        navThroughDispatch: function (location) {
            dispatch(react_router_redux_1.push(location));
        }
    };
    return mappedDispatch;
})(NavigationComp), "Navigation");
function createNavigationComponent(renderFunction) {
    var Wrapper = (function (_super) {
        __extends(Wrapper, _super);
        function Wrapper() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Wrapper.prototype.render = function () {
            var details = renderFunction();
            return React.createElement("div", null, details);
        };
        return Wrapper;
    }(React.Component));
}
//endregion
//#region actions/reducers/state/selectors
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
function hooksAndMountsSelector(state) {
    return state.rootReducer.hooksAndMounts;
}
function clone(orig, blacklistedProps) {
    var newProps = {};
    Object.keys(orig).forEach(function (key) {
        if (!blacklistedProps || blacklistedProps.indexOf(key) == -1) {
            newProps[key] = orig[key];
        }
    });
    return newProps;
}
function filterComponent(component) {
    var componentName = component.displayName ? component.displayName : component.name;
    return componentName;
}
function filterComponents(components) {
    var filteredComponents = {};
    Object.keys(components).forEach(function (k) {
        var component = components[k];
        filteredComponents[k] = filterComponent(component);
    });
    return filteredComponents;
}
function filterRoute(route) {
    var filteredRoute = clone(route, ["getComponent", "getComponents", "onEnter", "onChange", "onLeave", "getChildRoutes", "getIndexRoute", "indexRoute", "childRoutes", "component", "components"]);
    if (route.component) {
        filteredRoute.component = filterComponent(route.component);
    }
    if (route.components) {
        filteredRoute.components = filterComponents(route.components);
    }
    if (route.indexRoute) {
        filteredRoute.indexRoute = filterIndexRoute(route.indexRoute);
    }
    if (route.childRoutes) {
        filteredRoute.childRoutes = filterRoutes(route.childRoutes);
    }
    return filteredRoute;
}
function filterIndexRoute(indexRoute) {
    return filterRoute(indexRoute);
}
function filterRoutes(routes) {
    return routes.map(function (route) {
        return filterRoute(route);
    });
}
function filterRouterState(routerState) {
    var components;
    var filteredState = {
        location: routerState.location,
        params: routerState.params,
        routes: filterRoutes(routerState.routes)
    };
    if (routerState.components) {
        filteredState.components = routerState.components.map(function (c) { return filterComponent(c); });
    }
    else {
        filteredState.components = routerState.components;
    }
    return filteredState;
}
function rootReducer(state, action) {
    if (state === void 0) { state = { hooksAndMounts: [] }; }
    switch (action.type) {
        case HOOK_OR_MOUNT:
            var hookOrMountAction = action;
            var details = hookOrMountAction.details;
            if (hookOrMountAction.hookOrMountType == ENTERHOOK) {
                details = { nextState: filterRouterState(details.nextState) };
            }
            else if (hookOrMountAction.hookOrMountType == LEAVEHOOK) {
                details = { prevState: filterRouterState(details.prevState) };
            }
            else if (hookOrMountAction.hookOrMountType == CHANGEHOOK) {
                details = { prevState: filterRouterState(details.prevState), nextState: filterRouterState(details.nextState) };
            }
            return {
                hooksAndMounts: state.hooksAndMounts.concat([{
                        type: hookOrMountAction.hookOrMountType,
                        details: details
                    }])
            };
        default:
            return state;
    }
}
exports.rootReducer = rootReducer;
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