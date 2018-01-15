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
var bodyCursor_1 = require("./bodyCursor");
var idsAndClassNames = require("./idsAndClassNames");
var fontFamilies = require("./fontFamilies");
var textStrings = require("./textStrings");
var react_redux_1 = require("react-redux");
var style_1 = require("./style");
var reducer_1 = require("./reducers/reducer");
var actions_1 = require("./actions");
var connectHelpers_1 = require("./connectHelpers");
var TicTacToeCursor = (function (_super) {
    __extends(TicTacToeCursor, _super);
    function TicTacToeCursor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.positionAdjustment = function (x, y) {
            return { x: x - 4, y: y - 10 };
        };
        return _this;
    }
    //could have instead used the redux pseudo state for hover 
    TicTacToeCursor.prototype.render = function () {
        return React.createElement(bodyCursor_1.MouseBodyPosition, { mouseMove: this.props.boardHitTestRequest },
            React.createElement(bodyCursor_1.BodyCursor, { inactiveElementIdentifiers: [{ className: idsAndClassNames.inactiveCursorClassName }], cursor: "pointer", replaceCursor: this.props.active, positionAdjustment: this.positionAdjustment },
                React.createElement("span", { style: { zIndex: 1000, fontSize: style_1.style.cursor.fontSize, fontFamily: fontFamilies.noughtCrossFontFamily, color: this.props.overTakenSquare ? "gray" : this.props.cursorColour } }, this.props.cursorText)));
    };
    return TicTacToeCursor;
}(React.Component));
exports.ConnectedTicTacToeCursor = react_redux_1.connect(function (state) {
    var cursorColour = connectHelpers_1.getCurrentPlayerColour(state);
    var gameState = state.gameState;
    var cursorText = gameState.currentPlayer === reducer_1.Player.X ? textStrings.cross : textStrings.nought;
    var active = state.fontLoadingState === reducer_1.FontLoadingState.Active && state.gameState.playState === reducer_1.PlayState.Playing;
    var boardHitTestResult = state.boardHitTest.result;
    var overTakenSquare = false;
    if (boardHitTestResult) {
        if (boardHitTestResult.hit) {
            var squareGo = gameState.board[boardHitTestResult.row][boardHitTestResult.column];
            overTakenSquare = squareGo !== reducer_1.SquareGo.None;
        }
    }
    return {
        cursorColour: cursorColour,
        cursorText: cursorText,
        active: active,
        overTakenSquare: overTakenSquare
    };
}, function (dispatch) {
    return {
        boardHitTestRequest: function (x, y) {
            dispatch(actions_1.boardHitTest(x, y));
        }
    };
})(TicTacToeCursor);
//# sourceMappingURL=ticTacToeCursor.js.map