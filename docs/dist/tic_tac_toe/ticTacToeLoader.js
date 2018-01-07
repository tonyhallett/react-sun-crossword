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
var style_1 = require("./style");
var react_redux_1 = require("react-redux");
var configuredRadium_1 = require("./configuredRadium");
var TicTacToeLoader = (function (_super) {
    __extends(TicTacToeLoader, _super);
    function TicTacToeLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TicTacToeLoader.prototype.render = function () {
        return React.createElement("table", { style: { borderSpacing: 2 } },
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", { style: [style_1.style.loadingIndicator.cellStyle, style_1.style.loadingIndicator.winningCellStyle, { color: this.props.xColour }] }, "X"),
                    React.createElement("td", { style: [style_1.style.loadingIndicator.cellStyle, { color: this.props.oColour }] }, "O"),
                    React.createElement("td", { style: [style_1.style.loadingIndicator.cellStyle, { color: this.props.xColour }] }, "X")),
                React.createElement("tr", null,
                    React.createElement("td", { style: [style_1.style.loadingIndicator.cellStyle, { color: this.props.xColour }] }, "X"),
                    React.createElement("td", { style: [style_1.style.loadingIndicator.cellStyle, style_1.style.loadingIndicator.winningCellStyle, { animationDelay: "0.1s", color: this.props.xColour }] }, "X"),
                    React.createElement("td", { style: [style_1.style.loadingIndicator.cellStyle, { color: this.props.oColour }] }, "O")),
                React.createElement("tr", null,
                    React.createElement("td", { style: [style_1.style.loadingIndicator.cellStyle, { color: this.props.oColour }] }, "O"),
                    React.createElement("td", { style: [style_1.style.loadingIndicator.cellStyle, { color: this.props.oColour }] }, "O"),
                    React.createElement("td", { style: [style_1.style.loadingIndicator.cellStyle, style_1.style.loadingIndicator.winningCellStyle, { animationDelay: "0.2s", color: this.props.xColour }] }, "X"))));
    };
    return TicTacToeLoader;
}(React.Component));
exports.ConnectedTicTacToeLoader = react_redux_1.connect(function (state) {
    return {
        oColour: state.oColour,
        xColour: state.xColour
    };
})(configuredRadium_1.ConfiguredRadium(TicTacToeLoader));
//# sourceMappingURL=ticTacToeLoader.js.map