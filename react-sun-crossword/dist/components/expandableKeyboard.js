"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var react_element_queries_1 = require("react-element-queries");
var keyboard_1 = require("./keyboard");
var ExpandableKeyboardToWrap = (function (_super) {
    __extends(ExpandableKeyboardToWrap, _super);
    function ExpandableKeyboardToWrap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExpandableKeyboardToWrap.prototype.render = function () {
        return React.createElement("div", { style: { width: "100%" }, ref: this.props.getRef },
            this.props.width ? React.createElement(keyboard_1.Keyboard, __assign({}, this.props)) : null,
            this.props.children);
    };
    return ExpandableKeyboardToWrap;
}(React.Component));
exports.ExpandableKeyboard = react_element_queries_1.makeElementQuery(ExpandableKeyboardToWrap, {});
//# sourceMappingURL=expandableKeyboard.js.map