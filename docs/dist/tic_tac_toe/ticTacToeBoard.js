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
var react_redux_1 = require("react-redux");
var hitTest_1 = require("./hitTest");
var reducer_1 = require("./reducer");
var style_1 = require("./style");
var idsAndClassNames = require("./idsAndClassNames");
var configuredRadium_1 = require("./configuredRadium");
var ticTacToeSquare_1 = require("./ticTacToeSquare");
var TicTacToeBoard = (function (_super) {
    __extends(TicTacToeBoard, _super);
    function TicTacToeBoard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TicTacToeBoard.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.hitTestRequest && nextProps.hitTestRequest !== this.props.hitTestRequest) {
            this.hitTest(nextProps.hitTestRequest);
        }
    };
    TicTacToeBoard.prototype.hitTest = function (hitTestRequest) {
        var numRowColumns = this.props.board.length;
        var rows = this.tbody.rows;
        var isHit = false;
        var hitRow;
        var hitColumn;
        for (var i = 0; i < numRowColumns; i++) {
            var row = rows[i];
            //will check the row for hittest
            for (var j = 0; j < numRowColumns; j++) {
                var cell = row.cells[j];
                isHit = hitTest_1.hitTest(hitTestRequest.x, hitTestRequest.y, cell);
                if (isHit) {
                    hitRow = i;
                    hitColumn = j;
                    break;
                }
            }
            if (isHit) {
                break;
            }
        }
        this.props.hitTestResult({ hit: isHit, row: hitRow, column: hitColumn });
    };
    TicTacToeBoard.prototype.render = function () {
        var _this = this;
        var boardDimensions = this.props.board.length;
        return React.createElement("table", { id: idsAndClassNames.ticTacToeBoardId, style: [{
                    borderCollapse: "collapse", backgroundColor: style_1.style.componentBackgroundColor
                }, style_1.style.componentBoxShadow, style_1.style.componentBoxShadowHover] },
            React.createElement("tbody", { ref: function (b) { return _this.tbody = b; } }, this.props.board.map(function (rowSquares, rowIndex) {
                return React.createElement("tr", { key: rowIndex }, rowSquares.map(function (square, colIndex) {
                    return React.createElement(ticTacToeSquare_1.ConnectedTicTacToeSquare, { key: colIndex, rowIndex: rowIndex, colIndex: colIndex });
                }));
            })));
    };
    return TicTacToeBoard;
}(React.Component));
exports.TicTacToeBoard = TicTacToeBoard;
exports.ConnectedTicTacToeBoard = react_redux_1.connect(function (state) {
    return {
        board: state.board,
        hitTestRequest: state.boardHitTest.request
    };
}, function (dispatch) {
    return {
        hitTestResult: function (res) {
            dispatch(reducer_1.boardHitTestResult(res.hit, res.row, res.column));
        }
    };
})(configuredRadium_1.ConfiguredRadium(TicTacToeBoard));
//# sourceMappingURL=ticTacToeBoard.js.map