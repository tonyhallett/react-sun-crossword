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
var safeEventListener_1 = require("./safeEventListener");
var MouseBodyPosition = (function (_super) {
    __extends(MouseBodyPosition, _super);
    function MouseBodyPosition(props) {
        var _this = _super.call(this, props) || this;
        _this.mouseMove = function (e) {
            var pageX = e.pageX;
            var pageY = e.pageY;
            // IE 8
            if (pageX === undefined) {
                pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            if (_this.props.mouseMove) {
                _this.props.mouseMove(pageX, pageY);
            }
            _this.setState({ x: pageX, y: pageY, active: true });
        };
        _this.state = {
            x: 0,
            y: 0,
            active: false
        };
        return _this;
    }
    MouseBodyPosition.prototype.componentDidMount = function () {
        safeEventListener_1.addEventListener("mousemove", document.body, this.mouseMove);
    };
    MouseBodyPosition.prototype.componentWillUnmount = function () {
        safeEventListener_1.removeEventListener("mousemove", document.body, this.mouseMove);
    };
    MouseBodyPosition.prototype.render = function () {
        var _this = this;
        return React.Children.map(this.props.children, (function (child) { return React.cloneElement(child, _this.state); }));
    };
    return MouseBodyPosition;
}(React.Component));
exports.MouseBodyPosition = MouseBodyPosition;
var BodyCursor = (function (_super) {
    __extends(BodyCursor, _super);
    function BodyCursor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BodyCursor.prototype.isInInactiveElement = function () {
        var inInactiveElement = false;
        if (this.props.inactiveElementIdentifiers) {
            var elementFromPoint = document.elementFromPoint(this.props.x, this.props.y);
            var elementToTest = elementFromPoint;
            while (elementToTest) {
                var matched = false;
                for (var i = 0; i < this.props.inactiveElementIdentifiers.length; i++) {
                    var inactiveElementIdentifier = this.props.inactiveElementIdentifiers[i];
                    if (!(inactiveElementIdentifier.id === null || inactiveElementIdentifier.id === undefined)) {
                        if (elementToTest.id === inactiveElementIdentifier.id) {
                            inInactiveElement = true;
                        }
                    }
                    else {
                        var className = elementToTest.className;
                        var classNames = className.split(" ");
                        for (var j = 0; j < classNames.length; j++) {
                            var className = classNames[j];
                            if (className === inactiveElementIdentifier.className) {
                                inInactiveElement = true;
                                break;
                            }
                        }
                    }
                    if (inInactiveElement) {
                        break;
                    }
                }
                if (inInactiveElement) {
                    break;
                }
                elementToTest = elementToTest.parentElement;
            }
        }
        return inInactiveElement;
    };
    BodyCursor.prototype.render = function () {
        var shouldDisplayCursor = this.props.active && this.props.replaceCursor && !this.isInInactiveElement();
        if (shouldDisplayCursor) {
            document.body.style.cursor = "none";
            var _a = this.props.positionAdjustment(this.props.x, this.props.y), x = _a.x, y = _a.y;
            var replacedCursorStyle = { position: "absolute", left: x, top: y, pointerEvents: "none" };
            var childElement = this.props.children;
            var childStyle = childElement.props.style;
            var newStyle = __assign({}, childStyle, replacedCursorStyle);
            var newProps = {
                style: newStyle,
                x: this.props.x,
                y: this.props.y
            };
            return React.cloneElement(this.props.children, newProps);
        }
        else {
            document.body.style.cursor = this.props.cursor;
            return null;
        }
    };
    return BodyCursor;
}(React.Component));
BodyCursor.defaultProps = {
    positionAdjustment: function (x, y) {
        return { x: x, y: y };
    }
};
exports.BodyCursor = BodyCursor;
//# sourceMappingURL=bodyCursor.js.map