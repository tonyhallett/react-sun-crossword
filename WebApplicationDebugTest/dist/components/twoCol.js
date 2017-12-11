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
var TwoCol = (function (_super) {
    __extends(TwoCol, _super);
    function TwoCol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TwoCol.prototype.render = function () {
        var leftPercent = 50;
        if (this.props.leftPercentage) {
            leftPercent = this.props.leftPercentage;
        }
        var rightPercent = 100 - leftPercent;
        var leftStyle = {
            float: 'left',
            width: leftPercent + '%',
            overflow: this.props.colOverflow ? this.props.colOverflow : 'hidden'
        };
        var rightStyle = {
            float: 'left',
            width: rightPercent + '%',
            overflow: this.props.colOverflow ? this.props.colOverflow : 'hidden'
        };
        var left = React.createElement("div", { style: leftStyle }, this.props.leftContent);
        var right = React.createElement("div", { style: rightStyle },
            this.props.rightContent,
            " ");
        var container = React.createElement("div", null,
            left,
            right);
        if (this.props.containerStyle) {
            container = React.createElement("div", { style: this.props.containerStyle },
                left,
                right);
        }
        return container;
    };
    return TwoCol;
}(React.Component));
exports.TwoCol = TwoCol;
//# sourceMappingURL=twoCol.js.map