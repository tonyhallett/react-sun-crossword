import * as React from "React";
import * as ReactDOM from "react-dom";
import { RouteComponentProps, Link } from "react-router";
import * as PropTypes from 'prop-types';
import { HTMLProps, CSSProperties } from "React";
import { LocationDescriptor, LocationDescriptorObject } from "history";

var objectAny = Object as any;
var _extends = objectAny.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function createRoutesFromReactChildren(children, parentRoute) {
    var routes = [];

    React.Children.forEach(children, function (element) {
        routes.push(getRoute(element));
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
            //use this this.props.route
            return "TBD";
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
export class ReduxRoute extends React.Component<any, any>{
    static createRouteFromReactElement = function (element, parentRoute?) {
        var route = getRoute(element);
        route.store.subscribe(() => {
            route.change(route.store.getState(), route);
        });
        return route;
    }
    render() {
        return null;
    }
}
export class RouteProvider extends React.Component<any, any>{
    static routes = []
    static createRouteFromReactElement = function (element, parentRoute?) {
        var route = getRoute(element);
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
