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
var AutoComplete = (function (_super) {
    __extends(AutoComplete, _super);
    function AutoComplete(props) {
        var _this = _super.call(this, props) || this;
        _this.id = AutoComplete.idName + (AutoComplete.idCount++).toString();
        var webkitAutoFill = ":-webkit-autofill";
        var autoFillHover = webkitAutoFill + ":hover";
        var autoFillFocus = webkitAutoFill + ":focus";
        var inputSelector = "#" + _this.id + ">input";
        _this.autoFillCss = inputSelector + webkitAutoFill + "," + inputSelector + autoFillHover + "," + autoFillFocus + "{" + _this.getAutoCompleteBoxShadow() + "}";
        _this.state = { inputFocused: false };
        return _this;
    }
    AutoComplete.prototype.getAutoCompleteBoxShadow = function () {
        return "box-shadow: 0 0 0 100px " + this.props.autoCompleteColor + " inset";
    };
    AutoComplete.prototype.inputBlur = function () {
        this.setState({ inputFocused: false });
    };
    AutoComplete.prototype.inputFocus = function () {
        this.setState({ inputFocused: true });
    };
    AutoComplete.prototype.componentDidMount = function () {
        var self = this;
        if (this.props.autoCompleted) {
            window.setTimeout(function () {
                var boxShadow = window.getComputedStyle(self.autoCompleteElement).boxShadow;
                if (boxShadow !== "none") {
                    self.props.autoCompleted();
                }
            }, this.props.autoCompletedWait);
        }
    };
    AutoComplete.prototype.componentWillUnmount = function () {
    };
    AutoComplete.prototype.render = function () {
        var child = this.props.children;
        var childStyle = child.props.style;
        var hiddenStyle = { position: "absolute", left: 0, top: 0, zIndex: -1 };
        var styleIgnoreCopyProperties = ["boxShadow", "position", "left", "top", "zIndex"];
        var cloneStyle = { backgroundColor: this.props.backgroundColor };
        for (var p in childStyle) {
            if (styleIgnoreCopyProperties.indexOf(p) === -1) {
                hiddenStyle[p] = childStyle[p];
            }
            cloneStyle[p] = childStyle[p];
        }
        var self = this;
        var cloneProps = { style: cloneStyle }; //need to type this 
        //should this be done in render ? once ?
        if (this.props.showFocusShadow) {
            cloneStyle.outline = "none";
            var currentOnBlur = child.props.onBlur;
            cloneProps.onBlur = function (ev) {
                currentOnBlur(ev);
                self.inputBlur();
            };
            var currentOnFocus = child.props.onFocus;
            cloneProps.onFocus = function (ev) {
                currentOnFocus(ev);
                self.inputFocus();
            };
        }
        if (this.props.autoCompleted) {
            cloneProps.ref = function (node) {
                self.autoCompleteElement = node;
                // Call the original ref, if any
                var ref = child.ref;
                if (typeof ref === 'function') {
                    ref(node);
                }
            };
        }
        if (this.state.inputFocused) {
            hiddenStyle.boxShadow = this.props.focusShadow;
        }
        var childClone = React.cloneElement(child, cloneProps);
        var containerStyle = { position: "relative" };
        return React.createElement("div", { id: this.id, style: __assign({}, containerStyle, this.props.containerStyle) },
            childClone,
            React.createElement("input", { tabIndex: -1, style: hiddenStyle, type: "text", disabled: true }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: this.autoFillCss
                } }));
    };
    return AutoComplete;
}(React.Component));
//might have a boolean for determining if autocompleted 
//then will have to use the color module for creating a slightly lighter "rgb(244,244,244)"
AutoComplete.defaultProps = {
    backgroundColor: "white",
    autoCompleteColor: "white",
    showFocusShadow: true,
    focusShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px rgba(0, 126, 255, 0.1)",
    autoCompletedWait: 500
};
AutoComplete.idCount = 0;
AutoComplete.idName = "autoComplete";
exports.AutoComplete = AutoComplete;
//# sourceMappingURL=autoComplete.js.map