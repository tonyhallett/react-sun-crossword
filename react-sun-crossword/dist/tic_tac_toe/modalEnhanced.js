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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Modal = require("react-modal");
var $ = require("jquery");
var ElementDimensionsChoice;
(function (ElementDimensionsChoice) {
    ElementDimensionsChoice[ElementDimensionsChoice["Content"] = 0] = "Content";
    ElementDimensionsChoice[ElementDimensionsChoice["PaddingAndBorder"] = 1] = "PaddingAndBorder";
    ElementDimensionsChoice[ElementDimensionsChoice["Padding"] = 2] = "Padding";
    ElementDimensionsChoice[ElementDimensionsChoice["PaddingBorderMargin"] = 3] = "PaddingBorderMargin";
})(ElementDimensionsChoice || (ElementDimensionsChoice = {}));
//to consider box sizing - another day !
//http://blog.jquery.com/2012/08/16/jquery-1-8-box-sizing-width-csswidth-and-outerwidth/
function getElementWidth(element, dimensionsChoice) {
    var $el = $(element);
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.PaddingAndBorder:
            return $el.outerWidth(false);
        case ElementDimensionsChoice.Padding:
            return $el.innerWidth();
        case ElementDimensionsChoice.PaddingBorderMargin:
            return $el.outerWidth(true);
        case ElementDimensionsChoice.Content:
            return $el.width();
    }
}
function getElementHeight(element, dimensionsChoice) {
    var $el = $(element);
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.PaddingAndBorder:
            return $el.outerHeight(false);
        case ElementDimensionsChoice.Padding:
            return $el.innerHeight();
        case ElementDimensionsChoice.PaddingBorderMargin:
            return $el.outerHeight(true);
        case ElementDimensionsChoice.Content:
            return $el.height();
    }
}
function getElementEdgeLength(element, lengthType) {
    var $el = $(element);
    return parseFloat($el.css(lengthType));
}
function getOverlay(element, dimensionsChoice) {
    if (dimensionsChoice === void 0) { dimensionsChoice = ElementDimensionsChoice.PaddingAndBorder; }
    var $element = $(element);
    var offset = $element.offset(); //border-box
    var left = offset.left;
    var top = offset.top;
    switch (dimensionsChoice) {
        case ElementDimensionsChoice.Content:
            var paddingLeft = getElementEdgeLength(element, "padding-left");
            var borderLeft = getElementEdgeLength(element, "border-left");
            var paddingTop = getElementEdgeLength(element, "padding-top");
            var borderTop = getElementEdgeLength(element, "border-top");
            top = top + paddingTop + borderTop;
            left = left + paddingLeft + borderLeft;
            break;
        case ElementDimensionsChoice.Padding:
            var borderLeft = getElementEdgeLength(element, "border-left");
            var borderTop = getElementEdgeLength(element, "border-top");
            top = top + borderTop;
            left = left + borderLeft;
            break;
        case ElementDimensionsChoice.PaddingAndBorder:
            //no change
            break;
        case ElementDimensionsChoice.PaddingBorderMargin:
            var marginLeft = getElementEdgeLength(element, "margin-left");
            var marginTop = getElementEdgeLength(element, "margin-top");
            top = top - marginTop;
            left = left - marginLeft;
            break;
    }
    return {
        left: left,
        top: top,
        width: getElementWidth(element, dimensionsChoice),
        height: getElementHeight(element, dimensionsChoice)
    };
}
var ModalReady = (function (_super) {
    __extends(ModalReady, _super);
    function ModalReady(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { ready: false };
        return _this;
    }
    ModalReady.prototype.componentDidMount = function () {
        this.setState({ ready: true });
    };
    ModalReady.prototype.render = function () {
        if (!this.state.ready) {
            return null;
        }
        return React.createElement(Modal, __assign({ style: this.props.getStyle() }, this.props));
    };
    return ModalReady;
}(React.Component));
exports.ModalReady = ModalReady;
var ModalCover = (function (_super) {
    __extends(ModalCover, _super);
    function ModalCover() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getStyle = function () {
            return {
                overlay: getOverlay(document.querySelector(_this.props.elementSelector), _this.props.coverType),
                content: _this.props.contentStyle
            };
        };
        return _this;
    }
    ModalCover.prototype.render = function () {
        return React.createElement(ModalReady, __assign({}, this.props, { getStyle: this.getStyle }));
    };
    return ModalCover;
}(React.Component));
ModalCover.defaultProps = {
    coverType: ElementDimensionsChoice.PaddingAndBorder
};
exports.ModalCover = ModalCover;
//# sourceMappingURL=modalEnhanced.js.map