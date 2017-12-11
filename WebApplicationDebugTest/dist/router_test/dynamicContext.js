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
var React = require("react");
var PropTypes = require("prop-types");
var AddContextToThis = (function (_super) {
    __extends(AddContextToThis, _super);
    function AddContextToThis() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AddContextToThis.prototype.getChildContext = function () {
        return { original: true };
    };
    AddContextToThis.prototype.render = function () {
        return this.props.children;
    };
    return AddContextToThis;
}(React.Component));
AddContextToThis.childContextTypes = {
    original: PropTypes.bool
};
var UsesDynamicContext = (function (_super) {
    __extends(UsesDynamicContext, _super);
    function UsesDynamicContext() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UsesDynamicContext.prototype.render = function () {
        return React.createElement("div", null, this.context.dynamic());
    };
    return UsesDynamicContext;
}(React.Component));
UsesDynamicContext.contextTypes = {
    dynamic: PropTypes.func
};
var DynamicContextProvider = (function (_super) {
    __extends(DynamicContextProvider, _super);
    function DynamicContextProvider(props) {
        var _this = _super.call(this, props) || this;
        function _getDynamicValue(someProp) {
            return "Got: " + someProp;
        }
        AddContextToThis.childContextTypes.dynamic = PropTypes.func;
        var originalGetChildContext = AddContextToThis.prototype.getChildContext;
        AddContextToThis.prototype.getChildContext = function () {
            var _that = this;
            var childContext = originalGetChildContext();
            childContext.dynamic = function () {
                return _getDynamicValue(_that.props.someProp);
            };
            return childContext;
        };
        return _this;
    }
    DynamicContextProvider.prototype.render = function () {
        return React.createElement(AddContextToThis, { someProp: "Some value" },
            React.createElement(UsesDynamicContext, null));
    };
    return DynamicContextProvider;
}(React.Component));
exports.DynamicContextProvider = DynamicContextProvider;
//# sourceMappingURL=dynamicContext.js.map