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
var invariant = require('invariant');
var React = require("react");
//import createReactClass  from 'create-react-class'
var createReactClass = require('create-react-class');
var prop_types_1 = require("prop-types");
var getRouteParams_1 = require("./getRouteParams");
var ContextUtils_1 = require("./ContextUtils");
var RouteUtils_1 = require("./RouteUtils");
var RelativeRouterContext = createReactClass({
    displayName: 'RelativeRouterContext',
    mixins: [ContextUtils_1.ContextProvider('router')],
    getDefaultProps: function () {
        return { createElement: React.createElement };
    },
    childContextTypes: {
        router: prop_types_1.object.isRequired
    },
    getChildContext: function () {
        return {
            router: this.props.router
        };
    },
    dynamicComponents: [],
    createElementWithDynamicContext: function (component, props) {
        var _this = this;
        var matchedDynamicComponent;
        for (var i = 0; i < this.dynamicComponents.length; i++) {
            var dynamicComponent = this.dynamicComponents[i];
            if (dynamicComponent === component) {
                matchedDynamicComponent = component;
                break;
            }
        }
        if (!matchedDynamicComponent) {
            matchedDynamicComponent = component;
            var hasChildContextTypes = false;
            if (matchedDynamicComponent.childContextTypes) {
                hasChildContextTypes = true;
                matchedDynamicComponent.childContextTypes.getRoutePath = prop_types_1.func;
            }
            else {
                matchedDynamicComponent.childContextTypes = { getRoutePath: prop_types_1.func };
            }
            if (hasChildContextTypes) {
                var getChildContext = matchedDynamicComponent.prototype.getChildContext;
                matchedDynamicComponent.prototype.getChildContext = function () {
                    var _that = this;
                    var context = getChildContext.bind(this)();
                    context.getRoutePath = function () {
                        return _this._getRoutePath(_that.props.route);
                    };
                    return context;
                };
            }
            else {
                matchedDynamicComponent.prototype.getChildContext = function () {
                    var _that = this;
                    return {
                        getRoutePath: function () {
                            return _this._getRoutePath(_that.props.route);
                        }
                    };
                };
            }
            this.dynamicComponents.push(matchedDynamicComponent);
        }
        return this.createElement(matchedDynamicComponent, props);
    },
    _getRoutePath: function (route) {
        var routePath = "";
        var first = true;
        for (var i = this.matchedRoutes.length; i !== 0; i--) {
            var matchedRoute = this.matchedRoutes[i - 1];
            var path = matchedRoute.path;
            if (path) {
                routePath += path;
                if (!first) {
                    routePath += "/";
                }
                else {
                    first = false;
                }
            }
            if (matchedRoute === route) {
                break;
            }
        }
        return routePath;
    },
    createElement: function (component, props) {
        return component == null ? null : this.props.createElement(component, props);
    },
    matchedRoutes: [],
    render: function () {
        var _this = this;
        var _a = this.props, location = _a.location, routes = _a.routes, params = _a.params, components = _a.components, router = _a.router;
        var element = null;
        if (components) {
            //not sure if should always clear ******************************
            this.matchedRoutes = [];
            element = components.reduceRight(function (element, components, index) {
                if (components == null)
                    return element; // Don't create new children; use the grandchildren.
                var route = routes[index];
                _this.matchedRoutes.push(route);
                var routeParams = getRouteParams_1.default(route, params);
                var props = {
                    location: location,
                    params: params,
                    route: route,
                    router: router,
                    routeParams: routeParams,
                    routes: routes
                };
                if (RouteUtils_1.isReactChildren(element)) {
                    props.children = element;
                }
                else if (element) {
                    for (var prop in element)
                        if (Object.prototype.hasOwnProperty.call(element, prop))
                            props[prop] = element[prop];
                }
                if (typeof components === 'object') {
                    var elements = {};
                    for (var key in components) {
                        if (Object.prototype.hasOwnProperty.call(components, key)) {
                            // Pass through the key as a prop to createElement to allow
                            // custom createElement functions to know which named component
                            // they're rendering, for e.g. matching up to fetched data.
                            elements[key] = _this.createElementWithDynamicContext(components[key], __assign({ key: key }, props));
                        }
                    }
                    return elements;
                }
                return _this.createElementWithDynamicContext(components, props);
            }, element);
        }
        invariant(element === null || element === false || React.isValidElement(element), 'The root route must render a single element');
        return element;
    }
});
exports.default = RelativeRouterContext;
//# sourceMappingURL=relativeRouteContext.js.map