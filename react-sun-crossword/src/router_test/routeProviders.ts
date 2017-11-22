import * as React from "React";

var objectAny = Object as any;
var _extends = objectAny.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

        if (childRoutes.length) route.childRoutes = childRoutes;

        delete route.children;

    }
    return route;

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
