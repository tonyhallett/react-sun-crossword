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
var NonNavigatableLink = (function (_super) {
    __extends(NonNavigatableLink, _super);
    function NonNavigatableLink(props) {
        var _this = _super.call(this, props) || this;
        _this.clicked = function (evt) {
            evt.preventDefault();
            _this.props.clicked();
        };
        _this.id = NonNavigatableLink.idName + (NonNavigatableLink.idCount++).toString();
        return _this;
    }
    NonNavigatableLink.prototype.render = function () {
        var linkBackgroundColorCss = this.props.transparentBackground ? "background-color:transparent" : "";
        var linkTextDecoration = this.props.removeUnderline ? "text-decoration:none" : "text-decoration:underline";
        var linkRemoveOutline = this.props.removeOutline ? "outline:none" : "";
        var linkAdditionCss = [linkBackgroundColorCss, linkTextDecoration, linkRemoveOutline];
        var linkCss = "color:" + this.props.color + ";";
        for (var i = 0; i < linkAdditionCss.length; i++) {
            var linkAdditional = linkAdditionCss[i];
            if (linkAdditional !== "") {
                linkCss += linkAdditional + ";";
            }
        }
        var idSelector = "#" + this.id;
        var css = idSelector + " {" + linkCss + "}" + idSelector + ":focus," + idSelector + ":hover" + "{" + "text-decoration:underline" + "}";
        return React.createElement("span", null,
            React.createElement("a", { href: "", id: this.id, onClick: this.clicked }, this.props.text),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: css
                } }));
    };
    return NonNavigatableLink;
}(React.Component));
NonNavigatableLink.defaultProps = {
    color: "#2196F3",
    transparentBackground: true,
    removeUnderline: true,
    removeOutline: true
};
NonNavigatableLink.idCount = 0;
NonNavigatableLink.idName = "nonNavigatableLink";
exports.NonNavigatableLink = NonNavigatableLink;
//# sourceMappingURL=link.js.map