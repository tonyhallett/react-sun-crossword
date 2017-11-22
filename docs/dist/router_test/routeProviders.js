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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("React");
var objectAny = Object;
var _extends = objectAny.assign || function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; };
function createRoutesFromReactChildren(children, parentRoute) {
    var routes = [];
    React.Children.forEach(children, function (element) {
        routes.push(RouteProvider.createRouteFromReactElement(element));
    });
    return routes;
}
function getRoute(element) {
    function createRoute(defaultProps, props) {
        return _extends({}, defaultProps, props);
    }
    var type = element.type;
    var route = createRoute(type.defaultProps, element.props);
    if (route.children) {
        var childRoutes = createRoutesFromReactChildren(route.children, route);
        if (childRoutes.length)
            route.childRoutes = childRoutes;
        delete route.children;
    }
    return route;
}
var ReduxRoute = (function (_super) {
    __extends(ReduxRoute, _super);
    function ReduxRoute() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReduxRoute.prototype.render = function () {
        return null;
    };
    return ReduxRoute;
}(React.Component));
ReduxRoute.createRouteFromReactElement = function (element, parentRoute) {
    var route = getRoute(element);
    route.store.subscribe(function () {
        route.change(route.store.getState(), route);
    });
    return route;
};
exports.ReduxRoute = ReduxRoute;
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
    var route = getRoute(element);
    if (route.routeCallback !== null) {
        route.routeCallback(route);
    }
    RouteProvider.routes.push(route);
    return route;
};
exports.RouteProvider = RouteProvider;
//# sourceMappingURL=routeProviders.js.map