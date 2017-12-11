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
var muiButton_1 = require("./muiButton");
var Keyboard = (function (_super) {
    __extends(Keyboard, _super);
    function Keyboard(props) {
        var _this = _super.call(this, props) || this;
        _this.buttonClicked = function (id) {
            if (id === "backspace") {
                _this.props.backspacePressed();
            }
            else {
                _this.props.keyPressed(id);
            }
        };
        return _this;
    }
    Keyboard.prototype.createRow = function (leftOffset, keyWidth, keyHeight, keySpace, keys, fontSize, borderRadius) {
        var self = this;
        var left = leftOffset;
        return keys.map(function (key, index) {
            var value = key;
            if (key === "backspace") {
                value = "\u232B";
            }
            var button = React.createElement(KeyboardButton, { colour: self.props.buttonColour, backgroundColour: self.props.buttonBackgroundColour, borderRadius: borderRadius, fontSize: fontSize, key: key, left: left, width: keyWidth, height: keyHeight, value: value, id: key, onClick: self.buttonClicked });
            left += keyWidth + keySpace;
            return button;
        });
    };
    Keyboard.prototype.render = function () {
        var keys = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["Z", "X", "C", "V", "B", "N", "M", "backspace"]
        ];
        var keyWidth = this.props.width / (10 + (11 * this.props.keySpaceRatio));
        var keySpace = keyWidth * this.props.keySpaceRatio;
        keyWidth = Math.floor(keyWidth);
        keySpace = Math.floor(keySpace);
        var keyHeight = Math.floor(keyWidth * this.props.widthHeightRatio);
        var asdfLeft = Math.floor((this.props.width - (9 * (keyWidth) + 10 * keySpace)) / 2);
        var zxcvLeft = Math.floor((this.props.width - (8 * (keyWidth) + 9 * keySpace)) / 2);
        var marginSpace = Math.floor(keyWidth * this.props.rowMarginRatio);
        var fontSize = Math.floor(keyHeight * this.props.fontSizeRatio) + "px";
        var borderRadius = Math.floor(keyWidth * this.props.borderRadiusRatio) + "px";
        //otherwise get more margin to the right under certain widths due to rounding
        var width = (10 * keyWidth) + (11 * keySpace);
        var keyboardStyle = {
            left: "50%", transform: "translate(-50%, 0)",
            boxShadow: "0 0px 2px rgba(0,0,0, 0.12),0 2px 2px rgba(0,0,0, 0.20)",
            borderRadius: "5px",
            backgroundColor: this.props.keyboardColour,
            width: width,
            height: 3 * keyHeight + 4 * (marginSpace),
            cursor: "none"
        };
        if (this.props.bottomOfScreen) {
            keyboardStyle.position = "fixed";
            keyboardStyle.bottom = this.props.verticalShift + "px";
        }
        else {
            keyboardStyle.position = "absolute";
        }
        return React.createElement("div", { style: keyboardStyle },
            React.createElement("div", { style: { position: "absolute", top: marginSpace } }, this.createRow(keySpace, keyWidth, keyHeight, keySpace, keys[0], fontSize, borderRadius)),
            React.createElement("div", { style: { position: "absolute", top: 2 * marginSpace + keyHeight } }, this.createRow(asdfLeft, keyWidth, keyHeight, keySpace, keys[1], fontSize, borderRadius)),
            React.createElement("div", { style: { position: "absolute", top: 3 * marginSpace + 2 * keyHeight } }, this.createRow(zxcvLeft, keyWidth, keyHeight, keySpace, keys[2], fontSize, borderRadius)));
    };
    return Keyboard;
}(React.Component));
Keyboard.defaultProps = {
    rowMarginRatio: 0.1,
    bottomOfScreen: true,
    verticalShift: 0,
    keyboardColour: "white",
    widthHeightRatio: 1,
    keySpaceRatio: 0.1,
    fontSizeRatio: 0.5,
    borderRadiusRatio: 0.1,
    buttonBackgroundColour: "white",
    buttonColour: "black"
};
exports.Keyboard = Keyboard;
var KeyboardButton = (function (_super) {
    __extends(KeyboardButton, _super);
    function KeyboardButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyboardButton.prototype.render = function () {
        var _this = this;
        //could have a prop for rippleColor from lightened bg color
        return React.createElement(muiButton_1.MuiButton, { preventContextMenu: true, touchOnly: true, rippleOpacity: 0.5, rippleColour: "#ffedcc", buttonStyle: {
                tabIndex: -1,
                fontSize: this.props.fontSize,
                color: this.props.colour,
                backgroundColor: this.props.backgroundColour,
                textAlign: "center", borderRadius: this.props.borderRadius,
                fontWeight: "bold",
                height: this.props.height,
                width: this.props.width,
                position: "absolute",
                left: this.props.left + "px",
                padding: "0px",
                cursor: "none",
            }, onMouseUp: function () { _this.props.onClick(_this.props.id); } }, this.props.value);
    };
    return KeyboardButton;
}(React.Component));
exports.KeyboardButton = KeyboardButton;
//# sourceMappingURL=keyboard.js.map