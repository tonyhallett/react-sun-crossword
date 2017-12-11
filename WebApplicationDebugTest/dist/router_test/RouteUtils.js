"use strict";
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
function isValidChild(object) {
    return object == null || React.isValidElement(object);
}
function isReactChildren(object) {
    return isValidChild(object) || (Array.isArray(object) && object.every(isValidChild));
}
exports.isReactChildren = isReactChildren;
function createRoute(defaultProps, props) {
    return __assign({}, defaultProps, props);
}
function createRouteFromReactElement(element) {
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
exports.createRouteFromReactElement = createRouteFromReactElement;
/**
 * Creates and returns a routes object from the given ReactChildren. JSX
 * provides a convenient way to visualize how routes in the hierarchy are
 * nested.
 *
 *   import { Route, createRoutesFromReactChildren } from 'react-router'
 *
 *   const routes = createRoutesFromReactChildren(
 *     <Route component={App}>
 *       <Route path="home" component={Dashboard}/>
 *       <Route path="news" component={NewsFeed}/>
 *     </Route>
 *   )
 *
 * Note: This method is automatically used when you provide <Route> children
 * to a <Router> component.
 */
function createRoutesFromReactChildren(children, parentRoute) {
    var routes = [];
    React.Children.forEach(children, function (element) {
        if (React.isValidElement(element)) {
            // Component classes may have a static create* method.
            if (element.type.createRouteFromReactElement) {
                var route = element.type.createRouteFromReactElement(element, parentRoute);
                if (route)
                    routes.push(route);
            }
            else {
                routes.push(createRouteFromReactElement(element));
            }
        }
    });
    return routes;
}
exports.createRoutesFromReactChildren = createRoutesFromReactChildren;
/**
 * Creates and returns an array of routes from the given object which
 * may be a JSX route, a plain object route, or an array of either.
 */
function createRoutes(routes) {
    if (isReactChildren(routes)) {
        routes = createRoutesFromReactChildren(routes);
    }
    else if (routes && !Array.isArray(routes)) {
        routes = [routes];
    }
    return routes;
}
exports.createRoutes = createRoutes;
//# sourceMappingURL=RouteUtils.js.map