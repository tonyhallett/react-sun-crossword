"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
//import  Radium  =require('radium')
var index_1 = require("../models/index");
var squareLetter_1 = require("./squareLetter");
var squareNumber_1 = require("./squareNumber");
var commonStyling_1 = require("./commonStyling");
//@Radium
var Square = (function (_super) {
    __extends(Square, _super);
    function Square() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._raiseSelected = function () {
            _this.props.selected(_this.props.identifier);
        };
        return _this;
    }
    Square.prototype._getBackgroundColorStyle = function () {
        if (this.props.letter === "") {
            return commonStyling_1.commonColourStyles.blank;
        }
        var solvingMode = this.props.solvingMode;
        var backgroundColorStyle;
        var propName = "selected";
        if (!this.props.isSelected) {
            if (this.props.isWordSelected) {
                propName = "wordSelected";
            }
            else {
                propName = "notSelected";
            }
        }
        var solvingModePropPart = "Guessing";
        if (solvingMode !== index_1.SolvingMode.Guessing) {
            if (this.props.letter === this.props.guess) {
                solvingModePropPart = "Solved";
            }
            else {
                solvingModePropPart = "Unsolved";
                if (solvingMode === index_1.SolvingMode.Cheating) {
                    solvingModePropPart = "Cheating";
                }
            }
        }
        propName = propName + solvingModePropPart;
        backgroundColorStyle = commonStyling_1.commonColourStyles[propName];
        return backgroundColorStyle;
    };
    ;
    Square.prototype._getSquareStyle = function () {
        var style = {
            width: "32px",
            height: "32px",
            textAlign: "center",
            display: "table-cell",
            margin: 0,
            padding: 0,
            border: "1px",
            position: "relative",
            backgroundColor: this._getBackgroundColorStyle().backgroundColor
        };
        return style;
    };
    Square.prototype._getSquareLetter = function () {
        var letter = this.props.letter;
        if (this.props.solvingMode !== index_1.SolvingMode.Cheating) {
            letter = this.props.guess;
        }
        return letter;
    };
    Square.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var shouldUpdate = false;
        for (var p in nextProps) {
            if (this.props[p] !== nextProps[p]) {
                shouldUpdate = true;
                break;
            }
        }
        return shouldUpdate;
    };
    Square.prototype.render = function () {
        return React.createElement("span", { onClick: this._raiseSelected, style: this._getSquareStyle() },
            React.createElement(squareNumber_1.SquareNumber, { number: this.props.number }),
            React.createElement(squareLetter_1.SquareLetter, { letter: this._getSquareLetter(), autoSolvedGuessing: this.props.solvingMode === index_1.SolvingMode.Guessing && this.props.autoSolved }));
    };
    return Square;
}(React.Component));
exports.Square = Square;
//# sourceMappingURL=square.js.map