"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var index_1 = require("../models/index");
var commonStyling_1 = require("./commonStyling");
var FormatWord = (function (_super) {
    __extends(FormatWord, _super);
    function FormatWord() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormatWord.prototype.render = function () {
        var clueLetters = this.props.clueLetters;
        var format = this.props.format;
        var parts = format.split(",");
        var formatted = []; //type ReactInstance = Component<any, any> | Element; - this is not the correct typing ....
        var numParts = parts.length;
        var counter = 0;
        var key = counter;
        for (var i = 0; i < numParts; i++) {
            var part = parts[i];
            var numLettersInPart = parseInt(part);
            for (var j = 0; j < numLettersInPart; j++) {
                var clueLetterProps = clueLetters[counter];
                var clueLetter = React.createElement(ClueLetter, { key: key, isSolved: clueLetterProps.isSolved, autoSolved: clueLetterProps.autoSolved, guess: clueLetterProps.guess, letter: clueLetterProps.letter, solvingMode: clueLetterProps.solvingMode });
                formatted.push(clueLetter);
                counter++;
                key++;
            }
            var isLastPart = i == numParts - 1;
            if (!isLastPart) {
                formatted.push(React.createElement("span", { style: { paddingRight: '2px' }, key: key }, "-"));
                key++;
            }
        }
        var hyphenFormat = format.replace(",", "-");
        formatted.push(React.createElement("span", { style: { fontWeight: 'bolder', paddingLeft: '5px' }, key: key++ }, "(" + hyphenFormat + ")"));
        return React.createElement("div", null, formatted);
    };
    return FormatWord;
}(React.Component));
exports.FormatWord = FormatWord;
var ClueLetter = (function (_super) {
    __extends(ClueLetter, _super);
    function ClueLetter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClueLetter.prototype.render = function () {
        var solvingMode = this.props.solvingMode;
        var letter = this.props.letter;
        var displayLetter = letter;
        var guess = this.props.guess;
        var fontWeight = "normal";
        var showWithSolvedColour = false;
        var showWithSolvedWeight = false;
        if (solvingMode !== index_1.SolvingMode.Cheating) {
            displayLetter = guess === "" ? "_" : guess;
        }
        var fontColor = commonStyling_1.commonColourStyles.letter.backgroundColor;
        if (solvingMode === index_1.SolvingMode.Guessing) {
            if (this.props.autoSolved) {
                showWithSolvedColour = true;
                showWithSolvedWeight = true;
            }
        }
        else {
            if (this.props.isSolved) {
                showWithSolvedWeight = true;
            }
            else {
                if (guess === letter) {
                    showWithSolvedColour = true;
                    showWithSolvedWeight = true;
                }
            }
        }
        if (showWithSolvedColour) {
            fontColor = commonStyling_1.commonColourStyles.letterSolved.backgroundColor;
        }
        if (showWithSolvedWeight) {
            fontWeight = "bold";
        }
        var style = {
            color: fontColor, fontWeight: fontWeight, paddingRight: '2px'
        };
        return React.createElement("span", { style: style }, displayLetter);
    };
    return ClueLetter;
}(React.Component));
exports.ClueLetter = ClueLetter;
//# sourceMappingURL=formatWord.js.map