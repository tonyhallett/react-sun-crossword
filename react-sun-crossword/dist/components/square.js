"use strict";
const React = require("react");
//import  Radium  =require('radium')
const index_1 = require("../models/index");
const squareLetter_1 = require("./squareLetter");
const squareNumber_1 = require("./squareNumber");
const commonColourStyling_1 = require("./commonColourStyling");
//@Radium
class Square extends React.Component {
    constructor() {
        super(...arguments);
        this._raiseSelected = () => {
            this.props.selected(this.props.identifier);
        };
    }
    _getBackgroundColorStyle() {
        if (this.props.letter === "") {
            return commonColourStyling_1.commonColourStyles.blank;
        }
        var solvingMode = this.props.solvingMode;
        var isSelected = this.props.isSelected;
        var isWordSelected = this.props.isWordSelected;
        var backgroundColorStyle;
        var propName = "selected";
        if (!isSelected) {
            if (isWordSelected) {
                propName = "wordSelected";
            }
            else {
                propName = "notSelected";
            }
        }
        var solvingModePropPart;
        switch (solvingMode) {
            case index_1.SolvingMode.Cheating:
                solvingModePropPart = "Cheating";
                break;
            case index_1.SolvingMode.Guessing:
                solvingModePropPart = "Guessing";
                break;
            case index_1.SolvingMode.Solving:
                if (this.props.letter === this.props.guess) {
                    solvingModePropPart = "Solved";
                }
                else {
                    solvingModePropPart = "Unsolved";
                }
                break;
        }
        propName = propName + solvingModePropPart;
        backgroundColorStyle = commonColourStyling_1.commonColourStyles[propName];
        return backgroundColorStyle;
    }
    ;
    _getSquareStyle() {
        var baseStyle = {
            width: "32px",
            height: "32px",
            textAlign: "center",
            display: "table-cell",
            margin: 0,
            padding: 0,
            border: "1px",
            position: "relative"
        };
        return Object.assign(baseStyle, this._getBackgroundColorStyle());
    }
    _getSquareLetter() {
        var letter = this.props.letter;
        if (this.props.solvingMode !== index_1.SolvingMode.Cheating) {
            letter = this.props.guess;
        }
        return letter;
    }
    render() {
        return React.createElement("span", { onClick: this._raiseSelected, style: this._getSquareStyle() },
            React.createElement(squareNumber_1.SquareNumber, { number: this.props.number }),
            React.createElement(squareLetter_1.SquareLetter, { letter: this._getSquareLetter() }));
    }
}
exports.Square = Square;
//# sourceMappingURL=square.js.map