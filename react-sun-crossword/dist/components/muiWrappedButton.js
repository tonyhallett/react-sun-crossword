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
var muiButton_1 = require("./muiButton");
var MuiButtonWrapper = (function (_super) {
    __extends(MuiButtonWrapper, _super);
    function MuiButtonWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //wrap in div and handle click from that ?
        _this.onMouseUp = function () {
            _this.props.onClick();
        };
        return _this;
    }
    MuiButtonWrapper.prototype.render = function () {
        //important consideration at a later point
        //if the consumer of this wrapper wanted to also pass onMouseUp
        //moot point as functionally is only used for onClick and the remainder is just styling
        return React.createElement(muiButton_1.MuiButton, __assign({}, this.props, { disabled: this.props.disabled, onMouseUp: this.onMouseUp }),
            "  ",
            this.props.text);
    };
    return MuiButtonWrapper;
}(React.Component));
exports.MuiButtonWrapper = MuiButtonWrapper;
//# sourceMappingURL=muiWrappedButton.js.map