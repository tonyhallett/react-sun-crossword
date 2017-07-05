"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var bounds = require("react-bounds");
var react_element_queries_1 = require("react-element-queries");
var ElementQueriesToWrap = (function (_super) {
    __extends(ElementQueriesToWrap, _super);
    function ElementQueriesToWrap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElementQueriesToWrap.prototype.render = function () {
        return React.createElement("div", { ref: this.props.getRef },
            React.createElement("div", null,
                React.createElement("div", null, this.props.height),
                React.createElement("div", null, this.props.width)),
            React.createElement("div", { style: { color: this.props.matches('hasHeight') ? 'yellow' : 'pink' } },
                React.createElement(react_element_queries_1.Matches, { hasHeight: true }, "Has height")),
            this.props.children);
    };
    return ElementQueriesToWrap;
}(React.Component));
exports.ElementQueries = react_element_queries_1.makeElementQuery(ElementQueriesToWrap, { hasHeight: { minHeight: 1 } });
var BoundedToWrap = (function (_super) {
    __extends(BoundedToWrap, _super);
    function BoundedToWrap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hadFirstRender = false;
        return _this;
    }
    BoundedToWrap.bounds = function () {
        return {
            'hasHeight': {
                minHeight: 1,
            },
            'noHeight': {
                minHeight: -1,
                maxHeight: 1
            }
        };
    };
    BoundedToWrap.prototype.componentDidMount = function () {
        if (!this.hadFirstRender) {
            this.hadFirstRender = true;
            this.forceUpdate();
        }
    };
    BoundedToWrap.prototype.render = function () {
        var activeBounds = this.props.activeBounds[0];
        return React.createElement("div", { style: { height: "100%", width: "100%" } },
            React.createElement("div", null, "Active bounds: " + activeBounds),
            React.createElement("div", null, "width: " + this.props.width),
            React.createElement("div", null, "height: " + this.props.height));
    };
    return BoundedToWrap;
}(React.Component));
exports.Bounded = bounds.wrap(BoundedToWrap);
//# sourceMappingURL=testBounds.js.map