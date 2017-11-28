//import invariant from 'invariant'
var invariant=require('invariant')
import * as React from 'react'
//import createReactClass  from 'create-react-class'
var createReactClass = require('create-react-class');
import { array, func, object } from 'prop-types'

import getRouteParams from './getRouteParams'
import { ContextProvider } from './ContextUtils'
import { isReactChildren } from './RouteUtils'

const RelativeRouterContext = createReactClass({
    displayName: 'RelativeRouterContext',
    mixins:[ ContextProvider('router')],
    getDefaultProps() {
        return { createElement: React.createElement }
    },
    childContextTypes: {
        router: object.isRequired
    },

    getChildContext() {
        return {
            router: this.props.router
        }
    },
    dynamicComponents:[],
    createElementWithDynamicContext:function(component,props){
        var _this=this;
        var matchedDynamicComponent;
        for (var i = 0; i < this.dynamicComponents.length;i++){
            var dynamicComponent=this.dynamicComponents[i];
            if(dynamicComponent===component){
                matchedDynamicComponent=component;
                break;
            }
        }
        if(!matchedDynamicComponent){
            matchedDynamicComponent=component;
            var hasChildContextTypes=false;
            if(matchedDynamicComponent.childContextTypes){
                hasChildContextTypes=true;
                matchedDynamicComponent.childContextTypes.getRoutePath=func;
            }else{
                matchedDynamicComponent.childContextTypes={getRoutePath:func}
            }
            if(hasChildContextTypes){
                var getChildContext=matchedDynamicComponent.prototype.getChildContext;
                matchedDynamicComponent.prototype.getChildContext=function(){
                    var _that=this;
                    var context=getChildContext.bind(this)();
                    context.getRoutePath=function(){
                        return _this._getRoutePath(_that.props);
                    }
                }
            }else{
                matchedDynamicComponent.prototype.getChildContext=function(){
                    var _that=this;
                    return {
                        getRoutePath:function(){
                            return _this._getRoutePath(_that.props);
                        }
                    }
                }
            }
            
            this.dynamicComponents.push(matchedDynamicComponent);
        }
        return this.createElement(matchedDynamicComponent,props);
    },
    _getRoutePath:function(route){
        var routePath="";
        var first=false;
        for(var i=this.matchedRoutes.length;i!==0;i--){
            var matchedRoute=this.matchedRoutes[i];
            var path=matchedRoute.path;
            if(path){
                routePath+=path;
                if(!first){
                    routePath+="/";
                }else{
                    first=false;
                }
            }
            if(matchedRoute===route){
                break;
            }
        }
    },
    
    createElement(component, props) {
        return component == null ? null : this.props.createElement(component, props)
    },
    matchedRoutes:[],
    render() {
        const { location, routes, params, components, router } = this.props
        let element = null

        if (components) {
            //not sure if should always clear ******************************
            this.matchedRoutes=[];

            element = components.reduceRight((element, components, index) => {
                if (components == null)
                    return element // Don't create new children; use the grandchildren.

                const route = routes[index]
                this.matchedRoutes.push(route);
                const routeParams = getRouteParams(route, params)
                const props = {
                    location,
                    params,
                    route,
                    router,
                    routeParams,
                    routes
                }

                if (isReactChildren(element)) {
                    (props as any).children = element
                } else if (element) {
                    for (const prop in element)
                        if (Object.prototype.hasOwnProperty.call(element, prop))
                            props[prop] = element[prop]
                }

                if (typeof components === 'object') {
                    const elements = {}

                    for (const key in components) {
                        if (Object.prototype.hasOwnProperty.call(components, key)) {
                            // Pass through the key as a prop to createElement to allow
                            // custom createElement functions to know which named component
                            // they're rendering, for e.g. matching up to fetched data.
                            elements[key] = this.createElementWithDynamicContext(components[key], {
                                key, ...props
              })
                        }
                    }

                    return elements
                }

                return this.createElementWithDynamicContext(components, props)
            }, element)
        }

        invariant(
          element === null || element === false || React.isValidElement(element),
          'The root route must render a single element'
        )

        return element
    }

})

export default RelativeRouterContext

