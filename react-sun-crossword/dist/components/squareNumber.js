"use strict";
const React = require("react");
class SquareNumber extends React.Component {
    render() {
        return React.createElement("span", { style: {
                position: "absolute", left: "2px", top: 0, fontSize: "10px", fontWeight: 700
            } }, this.props.number);
    }
}
exports.SquareNumber = SquareNumber;
//# sourceMappingURL=squareNumber.js.map