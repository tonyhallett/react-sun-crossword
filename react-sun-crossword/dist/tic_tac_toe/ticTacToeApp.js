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
var Radium_1 = require("Radium");
var configuredRadium_1 = require("./configuredRadium");
var react_redux_1 = require("react-redux");
var ticTacToeLoader_1 = require("./ticTacToeLoader");
var ticTacToeScreen_1 = require("./ticTacToeScreen");
var ticTacToeCursor_1 = require("./ticTacToeCursor");
var layoutComponents_1 = require("./layoutComponents");
var reducer_1 = require("./reducer");
var style_1 = require("./style");
var animationSupported_1 = require("./animationSupported");
var animationIsSupported = animationSupported_1.animationSupported();
var RadiumHorizontalCenter = configuredRadium_1.ConfiguredRadium(layoutComponents_1.HorizontalCenter);
//refactor to a loader ?
var TicTacToeApp = (function (_super) {
    __extends(TicTacToeApp, _super);
    function TicTacToeApp(props) {
        var _this = _super.call(this, props) || this;
        _this.hasLoaded = false;
        _this.state = { showLoadingIndicator: true };
        return _this;
    }
    TicTacToeApp.prototype.componentWillReceiveProps = function (props) {
        var self = this;
        if (this.props.fontLoadingState !== props.fontLoadingState && props.fontLoadingState === reducer_1.FontLoadingState.Loading) {
            if (this.props.minimumLoadingIndicator) {
                window.setTimeout(function () {
                    self.setState({ showLoadingIndicator: false });
                }, this.props.minimumLoadingIndicator);
            }
            else {
                self.setState({ showLoadingIndicator: false });
            }
        }
    };
    TicTacToeApp.prototype.render = function () {
        var showLoading = this.props.fontLoadingState === reducer_1.FontLoadingState.NotStarted || this.props.fontLoadingState === reducer_1.FontLoadingState.Loading;
        if (!showLoading) {
            showLoading = this.state.showLoadingIndicator;
        }
        return React.createElement(Radium_1.StyleRoot, { radiumConfig: { userAgent: "all" } },
            React.createElement(Radium_1.Style, { rules: {
                    body: {
                        margin: 0
                    },
                    ":focus": {
                        outlineStyle: animationIsSupported ? "none" : "solid",
                        outlineColor: style_1.backgroundColor
                    }
                } }),
            React.createElement(ticTacToeCursor_1.ConnectedTicTacToeCursor, null),
            React.createElement(layoutComponents_1.VerticallyCenteredContainer, { backgroundColor: style_1.backgroundColor },
                React.createElement(RadiumHorizontalCenter, null,
                    React.createElement("div", { style: { backgroundColor: "gray", padding: 10, borderRadius: style_1.style.borderRadius, boxShadow: " 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)" } }, showLoading ? React.createElement(ticTacToeLoader_1.ConnectedTicTacToeLoader, null) : React.createElement(ticTacToeScreen_1.ConnectedTicTacToeScreen, null)))));
    };
    return TicTacToeApp;
}(React.Component));
exports.ConnectedTicTacToeApp = react_redux_1.connect(function (state) {
    return {
        fontLoadingState: state.fontLoadingState,
        oColour: state.oColour,
        xColour: state.xColour
    };
})(TicTacToeApp);
//# sourceMappingURL=ticTacToeApp.js.map