import * as React from "React";
import * as ReactDOM from "react-dom";
import { RouteComponentProps, Link } from "react-router";
import * as PropTypes from 'prop-types';
import { HTMLProps, CSSProperties } from "React";
import { LocationDescriptor, LocationDescriptorObject } from "history";
import { RouteProps } from "react-router/lib/Route";

var objectAny = Object as any;
var _extends = objectAny.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function createRoutesFromReactChildren(children, parentRoute) {
    var routes = [];

    React.Children.forEach(children, function (element) {
        routes.push(getRouteWithParent(element));
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
        if (childRoutes.length) route.childRoutes = childRoutes;

        delete route.children;

    }
    return route;

}

interface RelativeLinkProviderContext {
    getRoutePath:()=>string
}
export function withRelativeLink<P>(Component: React.ComponentClass<P>):any {
    
    return  class RelativeLinkContextProvider extends React.Component<RouteComponentProps<any, any> & P, undefined>{
        static displayName = "RelativeLinkContextProvider(" + Component.displayName + ")";
        static childContextTypes = {
            getRoutePath: PropTypes.func
        }

        getRoutePath = () => {
            var routePath = "";
            var parts = [this.props.route.path];
            var route = this.props.route;
            while (route.parent) {
                route = route.parent;
                parts.push(route.path);
            }
            for (var i = parts.length - 1; i!==0; i--){
                var part = parts[i];
                if (part) {
                    routePath += part;
                    if (i !== 0) {
                        routePath+="/"
                    }
                }
            }
            return routePath;
        }
        getChildContext(): RelativeLinkProviderContext {
            return { getRoutePath: this.getRoutePath }
        }
        render() {
            return <Component {...this.props}/>
        }
    }
}
interface RelativeLinkProps extends HTMLProps<any> {
    onlyActiveOnIndex?: boolean;
    activeClassName?: string;
    activeStyle?: CSSProperties;

    relativePath:string
    search?: string;
    query?: string;
    state?: any;
}
export class RelativeLink extends React.Component<RelativeLinkProps, any>{
    static contextTypes = {
        getRoutePath: PropTypes.func
    }
    getLocation = (location: any):LocationDescriptor => {
        var resolvedLocation: LocationDescriptorObject = {
            query: this.props.query,
            search: this.props.search,
            state: this.props.state,
            pathname: this.context.getRoutePath() + this.props.relativePath
        }
        return resolvedLocation;
    }
    render() {
        var { relativePath, search, query, state, children, ...linkProps } = this.props;
        return <Link to={this.getLocation} {...linkProps}>{this.props.children}</Link>
    }
}

declare module "react-router/lib/Route" {
    interface RouteProps {
        [extraProps: string]: any;
    }
}
interface RouteCallback {
    (route:RouteProps):RouteProps
}
//display name ? why is args not typed
function composeRoute(...any: RouteCallback[]): React.ComponentClass<RouteProps>{
    var args = arguments;
    var routeCallback = function (route) {
        
        for (var i = 0; i < args.length; i++) {
            route = args[i](route);
        }
    }
    return class Route extends React.Component<RouteProps,undefined> {
        //this will be called for each root route by RouteUtils, or any in the subtree looking no deeper than that
        static createRouteFromReactElement = function (element, parentRoute) {
            function addChildRoutes(route, routes) {
                var childRoutes = route.childRoutes ? route.childRoutes : [];
                childRoutes.forEach(r => {
                    routes.push(r);
                    addChildRoutes(r,routes);
                });
            }
            var routes = []

            var route = getRouteWithParent(element);
            routes.push(route)
            addChildRoutes(route, routes);

            routes.forEach(r => routeCallback(r));
            
            return route;
        }
        render() {
            return null;
        }
    }

}
export const RouteWithParent = composeRoute();
export const ReduxRoute = composeRoute(route => {
    route.store.subscribe(() => {
        route.change(route.store.getState(), route);
    });
    return route;
})
//export class ReduxRoute extends React.Component<any, any>{
//    static createRouteFromReactElement = function (element, parentRoute?) {
//        var route = getRouteWithParent(element);
//        route.store.subscribe(() => {
//            route.change(route.store.getState(), route);
//        });
//        return route;
//    }
//    render() {
//        return null;
//    }
//}

//can get Routes by overriding the Router render method

export class RouteProvider extends React.Component<any, any>{
    static routes = []
    static createRouteFromReactElement = function (element, parentRoute?) {
        var route = getRouteWithParent(element);
        if (route.routeCallback !== null) {
            route.routeCallback(route);
        }
        RouteProvider.routes.push(route);
        return route;
    }

    render() {
        return null;
    }
}
