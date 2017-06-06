"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_tabs_1 = require("react-tabs");
var twoCol_1 = require("./twoCol");
var clueContainer_1 = require("./clueContainer");
var react_custom_scrollbars_1 = require("react-custom-scrollbars");
var CroswordClues = (function (_super) {
    __extends(CroswordClues, _super);
    function CroswordClues() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CroswordClues.prototype.mapNonGroupedToWrapped = function (clues) {
        return clues.map(function (clue) {
            return {
                clueNumber: clue.clueNumber,
                isSelected: clue.isSelected,
                isSolved: clue.isSolved,
                solvingMode: clue.solvingMode,
                wordId: clue.wordId,
                wrappedElement: React.createElement(clueContainer_1.ClueFormat, { isSolved: clue.isSolved, clueLetters: clue.clueLetters, format: clue.format, text: clue.text })
            };
        });
    };
    CroswordClues.prototype.mapFirst = function (clues) {
        return clues.map(function (clue) {
            var mapped = {
                clueNumber: clue.clueNumber,
                wordId: clue.wordId,
                isSolved: clue.isSolved,
                solvingMode: clue.solvingMode,
                isSelected: clue.isSelected,
                clueTextFormats: [{ text: clue.text, format: clue.format }],
                clueLetters: clue.clueLetters
            };
            return mapped;
        });
    };
    CroswordClues.prototype.getWrappedClues = function (groupedMappedClues) {
        return groupedMappedClues.map(function (groupedMappedClue) {
            var wrappedElement = React.createElement(clueContainer_1.GroupedClue, { clueTextFormats: groupedMappedClue.clueTextFormats, isSolved: groupedMappedClue.isSolved, clueLetters: groupedMappedClue.clueLetters });
            var wrappedClue = {
                clueNumber: groupedMappedClue.clueNumber,
                isSelected: groupedMappedClue.isSelected,
                wordId: groupedMappedClue.wordId,
                solvingMode: groupedMappedClue.solvingMode,
                isSolved: groupedMappedClue.isSolved,
                wrappedElement: wrappedElement
            };
            return wrappedClue;
        });
    };
    CroswordClues.prototype.render = function () {
        var _this = this;
        if (this.props.grouping) {
            var allAcrossClues = [];
            var allDownClues = [];
            var numAcross;
            var numDown;
            var clueProviders = this.props.clueProviders;
            var firstClueProvider = clueProviders[0];
            var firstAcrossClues = firstClueProvider.acrossClues;
            var firstDownClues = firstClueProvider.downClues;
            var mappedAcrossClues = this.mapFirst(firstAcrossClues);
            var mappedDownClues = this.mapFirst(firstDownClues);
            for (var i = 1; i < clueProviders.length; i++) {
                var clueProvider = clueProviders[i];
                var clueProviderAcrossClues = clueProvider.acrossClues;
                for (var j = 0; j < clueProviderAcrossClues.length; j++) {
                    var acrossClue = clueProviderAcrossClues[j];
                    mappedAcrossClues[j].clueTextFormats.push({ text: acrossClue.text, format: acrossClue.format });
                }
                var clueProviderDownClues = clueProvider.downClues;
                for (var j = 0; j < clueProviderDownClues.length; j++) {
                    var downClue = clueProviderDownClues[j];
                    mappedDownClues[j].clueTextFormats.push({ text: downClue.text, format: downClue.format });
                }
            }
            var acrossWrappedClues = this.getWrappedClues(mappedAcrossClues);
            var downWrappedClues = this.getWrappedClues(mappedDownClues);
            return React.createElement("div", { style: { width: '600px' } },
                React.createElement(react_tabs_1.Tabs, null,
                    React.createElement(react_tabs_1.TabList, null,
                        React.createElement(react_tabs_1.Tab, null, "Clues")),
                    React.createElement(react_tabs_1.TabPanel, null,
                        React.createElement(AcrossDownClues, { clueSelected: this.props.clueSelected, acrossClues: acrossWrappedClues, downClues: downWrappedClues }))));
        }
        return React.createElement("div", { style: { width: '600px' } },
            React.createElement(react_tabs_1.Tabs, null,
                React.createElement(react_tabs_1.TabList, null, this.props.clueProviders.map(function (cp, index) {
                    return React.createElement(react_tabs_1.Tab, { key: index }, cp.name);
                })),
                this.props.clueProviders.map(function (cp, index) {
                    return React.createElement(react_tabs_1.TabPanel, { key: index },
                        React.createElement(AcrossDownClues, { clueSelected: _this.props.clueSelected, acrossClues: _this.mapNonGroupedToWrapped(cp.acrossClues), downClues: _this.mapNonGroupedToWrapped(cp.downClues) }));
                })));
    };
    return CroswordClues;
}(React.Component));
exports.CroswordClues = CroswordClues;
var AcrossDownClues = (function (_super) {
    __extends(AcrossDownClues, _super);
    function AcrossDownClues() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AcrossDownClues.prototype.render = function () {
        //var leftContent = <Scrollbars style={{ width: 500, height: 300 }}><div style={{ padding:'5px' }}>{this.getLeftText()}</div></Scrollbars>
        //var rightContent = <Scrollbars style={{ width: 500, height: 300 }}><div style={{ padding: '5px' }}>{this.getRightText()}</div></Scrollbars>
        var containerStyle = { height: '800px', width: '600px' };
        var leftContent = React.createElement(AcrossOrDownClues, { clueSelected: this.props.clueSelected, isAcross: true, clues: this.props.acrossClues });
        var rightContent = React.createElement(AcrossOrDownClues, { clueSelected: this.props.clueSelected, isAcross: false, clues: this.props.downClues });
        return React.createElement("div", { style: containerStyle },
            " ",
            React.createElement(twoCol_1.TwoCol, { leftContent: leftContent, rightContent: rightContent }));
    };
    return AcrossDownClues;
}(React.Component));
exports.AcrossDownClues = AcrossDownClues;
var AcrossOrDownClues = (function (_super) {
    __extends(AcrossOrDownClues, _super);
    function AcrossOrDownClues() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clueSelected = function (wordId) {
            _this.props.clueSelected(_this.props.isAcross, wordId);
        };
        return _this;
    }
    AcrossOrDownClues.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("div", { style: { padding: '5px' } }, this.props.isAcross ? "Across" : "Down"),
            React.createElement(react_custom_scrollbars_1.Scrollbars, { style: { width: '300px', height: '800px' } }, this.props.clues.map(function (clue, index) {
                var border = '1px black solid';
                var style = {
                    borderTop: "",
                    borderBottom: ""
                };
                if (index !== _this.props.clues.length) {
                    style.borderTop = border;
                }
                else {
                    style.borderBottom = border;
                }
                return React.createElement("div", { style: style, key: index },
                    React.createElement(clueContainer_1.ClueContainer, { wrapped: clue.wrappedElement, key: index, selected: _this.clueSelected, clueNumber: clue.clueNumber, wordId: clue.wordId, isSolved: clue.isSolved, solvingMode: clue.solvingMode, isSelected: clue.isSelected }));
            }))));
    };
    return AcrossOrDownClues;
}(React.Component));
exports.AcrossOrDownClues = AcrossOrDownClues;
//# sourceMappingURL=clues.js.map