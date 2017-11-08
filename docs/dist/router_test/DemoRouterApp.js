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
var react_router_dom_1 = require("react-router-dom");
var DemoRouterApp = (function (_super) {
    __extends(DemoRouterApp, _super);
    function DemoRouterApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DemoRouterApp.prototype.render = function () {
        return React.createElement(react_router_dom_1.BrowserRouter, { basename: "/react-sun-crossword" },
            React.createElement(RouterAwareApp, null));
    };
    return DemoRouterApp;
}(React.Component));
exports.DemoRouterApp = DemoRouterApp;
var RouterAwareApp = (function (_super) {
    __extends(RouterAwareApp, _super);
    function RouterAwareApp(props) {
        var _this = _super.call(this, props) || this;
        console.log("RouteAwareApp constructor");
        _this.introduction = React.createElement(Introduction, null);
        console.log("after setting introduction property");
        return _this;
    }
    RouterAwareApp.prototype.componentDidMount = function () {
        console.log("RouterAwareApp did mount");
    };
    RouterAwareApp.prototype.componentWillUnmount = function () {
        console.log("RouterAwareApp will unmount *******************");
    };
    RouterAwareApp.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            React.createElement(react_router_dom_1.Link, { to: "/" }, "Introduction"),
            React.createElement(react_router_dom_1.Link, { to: "/settings" }, "Settings"),
            React.createElement(react_router_dom_1.Link, { to: "/crossword" }, "Crossword"),
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/", render: function (props) {
                    console.log("in route render - introduction");
                    return _this.introduction;
                } }),
            React.createElement(react_router_dom_1.Route, { path: "/settings", render: function (props) {
                    console.log("in route render - settings");
                    return React.createElement(Settings, null);
                } }),
            React.createElement(react_router_dom_1.Route, { path: "/crossword", render: function (props) {
                    console.log("in route render - crossword");
                    return React.createElement(Crossword, __assign({}, props));
                } }));
    };
    return RouterAwareApp;
}(React.Component));
exports.RouterAwareApp = RouterAwareApp;
//#endregion
var Introduction = (function (_super) {
    __extends(Introduction, _super);
    function Introduction(props) {
        var _this = _super.call(this, props) || this;
        console.log("In introduction ctor");
        return _this;
    }
    Introduction.prototype.componentWillUnmount = function () {
        console.log("Introduction unmounting ************");
    };
    Introduction.prototype.componentDidMount = function () {
        console.log("Introduction did mount ");
    };
    Introduction.prototype.render = function () {
        return React.createElement("div", null, "This is an introduction");
    };
    return Introduction;
}(React.Component));
exports.Introduction = Introduction;
var DisableLink = (function (_super) {
    __extends(DisableLink, _super);
    function DisableLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DisableLink.prototype.render = function () {
        var element = this.props.enabled ? React.createElement("span", { className: "disableLinkDisabled" }, this.props.linkText) : React.createElement(react_router_dom_1.Link, { to: this.props.to, replace: this.props.replace }, this.props.linkText);
        return element;
    };
    return DisableLink;
}(React.Component));
exports.DisableLink = DisableLink;
var Settings = (function (_super) {
    __extends(Settings, _super);
    function Settings(props) {
        var _this = _super.call(this, props) || this;
        _this.stringSettingChanged = function (event) {
            var stringSetting = event.target.value;
            _this.setState({ stringSetting: stringSetting });
            if (_this.storageAvailable) {
                //Dates not parsed - there is a reviver function ....
                _this.setTypedStorageItem("stringSetting", stringSetting);
            }
        };
        console.log("In settings constructor");
        _this.storageAvailable = _this.isStorageAvailable("localStorage");
        _this.storage = window["localStorage"];
        _this.state = { storageAvailable: _this.storageAvailable, booleanSetting: _this.getTypedStorageItem("booleanSetting", false), stringSetting: _this.getTypedStorageItem("stringSetting", "Default value"), numberSetting: _this.getTypedStorageItem("numberSetting", 1) };
        return _this;
    }
    Settings.prototype.componentWillUnmount = function () {
        console.log("Settings unmounting ************");
    };
    Settings.prototype.componentDidMount = function () {
        console.log("Settings did mount ");
    };
    Settings.prototype.getTypedStorageItem = function (itemKey, defaultValue) {
        if (!this.storageAvailable) {
            return defaultValue;
        }
        var setting = this.storage.getItem(itemKey);
        if (setting != null) {
            return JSON.parse(setting);
        }
        return defaultValue;
    };
    Settings.prototype.setTypedStorageItem = function (itemKey, value) {
        this.storage.setItem(itemKey, JSON.stringify(value));
    };
    Settings.prototype.isStorageAvailable = function (type) {
        try {
            var storage = window[type], x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
    };
    //would still show settings but will note that they cannot be saved
    Settings.prototype.render = function () {
        return React.createElement("div", null,
            !this.state.storageAvailable &&
                React.createElement("div", null, "Local storage is not available in your browser, settings will not be persisted"),
            React.createElement("input", { type: "text", value: this.state.stringSetting, onChange: this.stringSettingChanged }));
    };
    return Settings;
}(React.Component));
exports.Settings = Settings;
var Crossword = (function (_super) {
    __extends(Crossword, _super);
    function Crossword(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleHasCrossword = function () {
            _this.setState(function (prevState) {
                return {
                    hasCrossword: !prevState.hasCrossword
                };
            });
        };
        _this.previousNavToCrossword = false;
        console.log("In crossword constructor");
        _this.state = { hasCrossword: false };
        return _this;
    }
    Crossword.prototype.componentDidMount = function () {
        console.log("Crossword did mount");
    };
    Crossword.prototype.componentWillUnmount = function () {
        console.log("Crossword will unmount **********************");
    };
    Crossword.prototype.render = function () {
        var _this = this;
        console.log("Render: " + this.props.location.pathname);
        if (this.props.match.isExact) {
            var redirectPath = this.props.match.url + "/chooser";
            if (this.previousNavToCrossword) {
                redirectPath = this.props.match.url + "/play";
            }
            console.log("redirecting");
            return React.createElement(react_router_dom_1.Redirect, { to: redirectPath });
        }
        return React.createElement("div", null,
            React.createElement("button", { onClick: this.toggleHasCrossword }, this.state.hasCrossword.toString()),
            React.createElement(DisableLink, { enabled: !this.state.hasCrossword, linkText: "Play", to: this.props.match.url + "/play" }),
            React.createElement(react_router_dom_1.Link, { to: this.props.match.url + "/chooser" }, "Chooser"),
            React.createElement(react_router_dom_1.Route, { path: this.props.match.url + "/play", render: function (props) {
                    if (_this.state.hasCrossword) {
                        _this.previousNavToCrossword = true;
                        return React.createElement(DemoCrossword, null);
                    }
                    return React.createElement(react_router_dom_1.Redirect, { to: _this.props.match.url + "/chooser" });
                } }),
            React.createElement(react_router_dom_1.Route, { path: this.props.match.url + "/chooser", render: function (props) {
                    _this.previousNavToCrossword = false;
                    return React.createElement(DemoCrosswordChooser, null);
                } }));
    };
    return Crossword;
}(React.Component));
exports.Crossword = Crossword;
var DemoCrosswordChooser = (function (_super) {
    __extends(DemoCrosswordChooser, _super);
    function DemoCrosswordChooser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DemoCrosswordChooser.prototype.render = function () {
        return React.createElement("div", null, "Crossword chooser to go here");
    };
    return DemoCrosswordChooser;
}(React.Component));
exports.DemoCrosswordChooser = DemoCrosswordChooser;
var DemoCrossword = (function (_super) {
    __extends(DemoCrossword, _super);
    function DemoCrossword() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DemoCrossword.prototype.render = function () {
        return React.createElement("div", null, "This is where the crossword, clues and buttons go !");
    };
    return DemoCrossword;
}(React.Component));
exports.DemoCrossword = DemoCrossword;
//# sourceMappingURL=DemoRouterApp.js.map