"use strict";
const React = require("react");
class SquareLetter extends React.Component {
    render() {
        return React.createElement("span", { style: { verticalAlign: "middle", fontSize: "20px", fontWeight: 700, lineHeight: "28px" } }, this.props.letter);
    }
}
exports.SquareLetter = SquareLetter;
//# sourceMappingURL=squareLetter.js.map