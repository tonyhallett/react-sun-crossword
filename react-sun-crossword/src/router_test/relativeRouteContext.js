'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _propTypes = require('prop-types');

var _getRouteParams = require('./getRouteParams');

var _getRouteParams2 = _interopRequireDefault(_getRouteParams);

var _ContextUtils = require('./ContextUtils');

var _RouteUtils = require('./RouteUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import * as PropTypes from 'prop-types';

/**
 * A <RouterContext> renders the component tree for a given router state
 * and sets the history object and the current location in context.
 */
var RouterContext = (0, _createReactClass2.default)({
    displayName: 'RouterContext',

    mixins: [(0, _ContextUtils.ContextProvider)('router')],

    propTypes: {
        router: _propTypes.object.isRequired,
        location: _propTypes.object.isRequired,
        routes: _propTypes.array.isRequired,
        params: _propTypes.object.isRequired,
        components: _propTypes.array.isRequired,
        createElement: _propTypes.func.isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            createElement: _react2.default.createElement
        };
    },


    childContextTypes: {
        router: _propTypes.object.isRequired
    },

    getChildContext: function getChildContext() {
        return {
            router: this.props.router
        };
    },
    createElement: function createElement(component, props) {
        return component == null ? null : this.props.createElement(component, props);
    },
    creatElementWithDynamicContext:function(component,props){
        var _this=this;
        var matchedDynamicComponent;
        for(var i=0;i<this.dynamicComponents.length,i++){
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
                matchedDynamicComponent.childContextTypes.getRoutePath=PropTypes.func;//********** NEED PROPTYPES
            }else{
                matchedDynamicComponent.childContextTypes={getRoutePath:PropTypes.func}//********* NEED PROPTYPES
            }
            if(hasChildContextTypes){
                var getChildContext=matchedDynamicComponent.prototype.getChildContext;
                matchedDynamicComponent.prototype.getChildContext=function(){
                    var context=getChildContext();
                    context.getRoutePath=function(){
                        return _this._getRoutePath(this.props);//NOT SURE IF THIS IS POSSIBLE - CAN YOU GO OFF THE PROTOTYPE AGAIN ?
                    }
                }
            }else{
                matchedDynamicComponent.prototype.getChildContext=function(){
                    return {
                        getRoutePath:function(){
                            return _this._getRoutePath(this.props);//NOT SURE IF THIS IS POSSIBLE - CAN YOU GO OFF THE PROTOTYPE AGAIN ?
                        }
                    }
                }
            }
            
            this.dynamicComponents.push(matchedDynamicComponent);
        }
        return this.createElement(matchedDynamicComponent,props);
    },
    _getRoutePath:function(route){

    },
    dynamicComponents:[],
    render: function render() {
        var _this = this;

        var _props = this.props,
            location = _props.location,
            routes = _props.routes,
            params = _props.params,
            components = _props.components,
            router = _props.router;

        var element = null;

        if (components) {
            element = components.reduceRight(function (element, components, index) {
                if (components == null) return element; // Don't create new children; use the grandchildren.

                var route = routes[index];
                var routeParams = (0, _getRouteParams2.default)(route, params);
                var props = {
                    location: location,
                    params: params,
                    route: route,
                    router: router,
                    routeParams: routeParams,
                    routes: routes
                };

                if ((0, _RouteUtils.isReactChildren)(element)) {
                    props.children = element;
                } else if (element) {
                    for (var prop in element) {
                        if (Object.prototype.hasOwnProperty.call(element, prop)) props[prop] = element[prop];
                    }
                }

                if ((typeof components === 'undefined' ? 'undefined' : _typeof(components)) === 'object') {
                    var elements = {};

                    for (var key in components) {
                        if (Object.prototype.hasOwnProperty.call(components, key)) {
                            // Pass through the key as a prop to createElement to allow
                            // custom createElement functions to know which named component
                            // they're rendering, for e.g. matching up to fetched data.
                            elements[key] = _this.creatElementWithDynamicContext(components[key], _extends({
                                key: key
                            }, props));
                        }
                    }

                    return elements;
                }

                return _this.creatElementWithDynamicContext(components, props);
            }, element);
        }

        !(element === null || element === false || _react2.default.isValidElement(element)) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'The root route must render a single element') : (0, _invariant2.default)(false) : void 0;

        return element;
    }
});

exports.default = RouterContext;
module.exports = exports['default'];
