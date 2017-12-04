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
var React = require("React");
var react_router_1 = require("react-router");
var PropTypes = require("prop-types");
var reactHelpers_1 = require("../helpers/reactHelpers");
var objectAny = Object;
var _extends = objectAny.assign || function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; };
function withRelativeLink(Component) {
    var componentName = Component.displayName || Component.name || "Component";
    return _a = (function (_super) {
            __extends(RelativeLinkContextProvider, _super);
            function RelativeLinkContextProvider() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.getRoutePath = function () {
                    var routePath = "";
                    var parts = [_this.props.route.path];
                    var route = _this.props.route;
                    while (route.parentRoute) {
                        route = route.parentRoute;
                        parts.push(route.path);
                    }
                    var first = true;
                    for (var i = parts.length; i !== 0; i--) {
                        var part = parts[i - 1];
                        if (part) {
                            routePath += part;
                            if (!first) {
                                routePath += "/";
                            }
                            first = false;
                        }
                    }
                    return routePath;
                };
                return _this;
            }
            RelativeLinkContextProvider.prototype.getChildContext = function () {
                return { getRoutePath: this.getRoutePath };
            };
            RelativeLinkContextProvider.prototype.render = function () {
                return React.createElement(Component, __assign({}, this.props));
            };
            return RelativeLinkContextProvider;
        }(React.Component)),
        _a.displayName = reactHelpers_1.getWrapperComponentName("RelativeLinkContextProvider", Component),
        _a.childContextTypes = {
            getRoutePath: PropTypes.func
        },
        _a;
    var _a;
}
exports.withRelativeLink = withRelativeLink;
var RelativeLink = (function (_super) {
    __extends(RelativeLink, _super);
    function RelativeLink() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getLocation = function (location) {
            var resolvedLocation = {
                query: _this.props.query,
                search: _this.props.search,
                state: _this.props.state,
                pathname: _this.context.getRoutePath() + _this.props.relativePath
            };
            return resolvedLocation;
        };
        return _this;
    }
    RelativeLink.prototype.render = function () {
        var _a = this.props, relativePath = _a.relativePath, search = _a.search, query = _a.query, state = _a.state, children = _a.children, linkProps = __rest(_a, ["relativePath", "search", "query", "state", "children"]);
        return React.createElement(react_router_1.Link, __assign({ to: this.getLocation }, linkProps), this.props.children);
    };
    return RelativeLink;
}(React.Component));
RelativeLink.contextTypes = {
    getRoutePath: PropTypes.func
};
exports.RelativeLink = RelativeLink;
function createRoutesFromReactChildren(children, parentRoute) {
    var routes = [];
    React.Children.forEach(children, function (element) {
        var componentClass = element.type;
        var route;
        if (componentClass.createRouteFromReactElement) {
            route = componentClass.createRouteFromReactElement(element, parentRoute);
        }
        else {
            route = getRouteWithParent(element);
        }
        if (route) {
            routes.push(route);
        }
    });
    return routes;
}
function getRouteWithParent(element) {
    function createRoute(defaultProps, props) {
        return _extends({}, defaultProps, props);
    }
    var type = element.type;
    var route = createRoute(type.defaultProps, element.props);
    if (route.children) {
        var childRoutes = createRoutesFromReactChildren(route.children, route);
        for (var i = 0; i < childRoutes.length; i++) {
            childRoutes[i].parentRoute = route;
        }
        if (childRoutes.length)
            route.childRoutes = childRoutes;
        delete route.children;
    }
    return route;
}
function composeRoute() {
    var any = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        any[_i] = arguments[_i];
    }
    var args = arguments;
    var routeCallback = function (route) {
        for (var i = 0; i < args.length; i++) {
            route = args[i](route);
        }
    };
    return _a = (function (_super) {
            __extends(Route, _super);
            function Route() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Route.prototype.render = function () {
                return null;
            };
            return Route;
        }(React.Component)),
        //this will be called for each root route by RouteUtils, or any in the subtree looking no deeper than that
        _a.createRouteFromReactElement = function (element, parentRoute) {
            var route = getRouteWithParent(element);
            routeCallback(route);
            return route;
        },
        _a;
    var _a;
}
exports.RouteWithParent = composeRoute();
exports.ReduxRoute = composeRoute(function (route) {
    route.store.subscribe(function () {
        route.change(route.store.getState(), route);
    });
    return route;
});
//can get Routes by overriding the Router render method
var RouteProvider = (function (_super) {
    __extends(RouteProvider, _super);
    function RouteProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RouteProvider.prototype.render = function () {
        return null;
    };
    return RouteProvider;
}(React.Component));
RouteProvider.routes = [];
RouteProvider.createRouteFromReactElement = function (element, parentRoute) {
    var route = getRouteWithParent(element);
    if (route.routeCallback !== null) {
        route.routeCallback(route);
    }
    RouteProvider.routes.push(route);
    return route;
};
exports.RouteProvider = RouteProvider;
//# sourceMappingURL=routeProviders.js.map