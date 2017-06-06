"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var index_1 = require("../models/index");
var formatWord_1 = require("./formatWord");
var clueNumber_1 = require("./clueNumber");
var twoCol_1 = require("./twoCol");
var commonStyling_1 = require("./commonStyling");
var ClueContainer = (function (_super) {
    __extends(ClueContainer, _super);
    function ClueContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selected = function () {
            _this.props.selected(_this.props.wordId);
        };
        return _this;
    }
    ClueContainer.prototype._getBackgroundColorStyle = function () {
        var solvingMode = this.props.solvingMode;
        var backgroundColorStyle;
        var propName = "wordSelected";
        if (!this.props.isSelected) {
            propName = "notSelected";
        }
        var solvingModePropPart = "Guessing";
        if (solvingMode !== index_1.SolvingMode.Guessing) {
            if (this.props.isSolved) {
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
    ClueContainer.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        var shouldUpdate = false;
        for (var p in nextProps) {
            if (this.props[p] !== nextProps[p]) {
                shouldUpdate = true;
                break;
            }
        }
        return shouldUpdate;
    };
    ClueContainer.prototype.render = function () {
        var leftContent = React.createElement(clueNumber_1.ClueNumber, { number: this.props.clueNumber });
        var rightContent = this.props.wrapped;
        var backgroundColor = this._getBackgroundColorStyle().backgroundColor;
        return React.createElement("div", { style: {
                backgroundColor: backgroundColor,
                padding: '10px',
                overflow: 'hidden'
            }, onClick: this.selected },
            React.createElement(twoCol_1.TwoCol, { leftPercentage: 10, leftContent: leftContent, rightContent: rightContent }));
    };
    return ClueContainer;
}(React.Component));
exports.ClueContainer = ClueContainer;
var ClueFormat = (function (_super) {
    __extends(ClueFormat, _super);
    function ClueFormat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClueFormat.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("div", { style: { padding: '2px' } },
                React.createElement(ClueText, { text: this.props.text })),
            React.createElement("div", { style: { padding: '2px' } },
                React.createElement(formatWord_1.FormatWord, { isSolved: this.props.isSolved, format: this.props.format, clueLetters: this.props.clueLetters }))));
    };
    return ClueFormat;
}(React.Component));
exports.ClueFormat = ClueFormat;
var ClueText = (function (_super) {
    __extends(ClueText, _super);
    function ClueText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClueText.prototype.render = function () {
        return React.createElement("div", { dangerouslySetInnerHTML: { __html: this.props.text } });
    };
    return ClueText;
}(React.Component));
exports.ClueText = ClueText;
var GroupedClue = (function (_super) {
    __extends(GroupedClue, _super);
    function GroupedClue() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupedClue.prototype.render = function () {
        var _this = this;
        var clueTextFormats = this.props.clueTextFormats;
        var compareFormat;
        var formatsSame = true;
        for (var i = 0; i < clueTextFormats.length; i++) {
            var format = clueTextFormats[i].format;
            if (compareFormat) {
                formatsSame = compareFormat === format;
                if (!formatsSame) {
                    break;
                }
            }
            else {
                compareFormat = format;
            }
        }
        if (formatsSame) {
            return (React.createElement("div", null,
                this.props.clueTextFormats.map(function (clueTextFormat, index) {
                    return React.createElement("div", { key: index, style: { paddingBottom: '2px' } },
                        React.createElement(ClueText, { key: index, text: clueTextFormat.text + " /" }));
                }),
                React.createElement(formatWord_1.FormatWord, { isSolved: this.props.isSolved, format: compareFormat, clueLetters: this.props.clueLetters })));
        }
        else {
            return React.createElement("div", null, clueTextFormats.map(function (clueTextFormat, index) {
                return React.createElement("div", { key: index },
                    React.createElement(ClueFormat, { isSolved: _this.props.isSolved, clueLetters: _this.props.clueLetters, format: clueTextFormat.format, text: clueTextFormat.text }));
            }));
        }
    };
    return GroupedClue;
}(React.Component));
exports.GroupedClue = GroupedClue;
//# sourceMappingURL=clueContainer.js.map