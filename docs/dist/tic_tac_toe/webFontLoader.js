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
var WebFont = require("webfontloader");
var react_redux_1 = require("react-redux");
var WebFontLoader = (function (_super) {
    __extends(WebFontLoader, _super);
    function WebFontLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebFontLoader.prototype.loadFonts = function () {
        WebFont.load(this.props.config);
    };
    WebFontLoader.prototype.componentDidMount = function () {
        this.loadFonts();
    };
    WebFontLoader.prototype.shouldComponentUpdate = function () {
        return false;
    };
    WebFontLoader.prototype.render = function () {
        return this.props.children;
    };
    return WebFontLoader;
}(React.Component));
exports.WebFontLoader = WebFontLoader;
exports.FONT_LOADING = "FONT_LOADING";
var FontLoadingState;
(function (FontLoadingState) {
    FontLoadingState[FontLoadingState["NotStarted"] = 0] = "NotStarted";
    FontLoadingState[FontLoadingState["Loading"] = 1] = "Loading";
    FontLoadingState[FontLoadingState["Active"] = 2] = "Active";
    FontLoadingState[FontLoadingState["Inactive"] = 3] = "Inactive";
})(FontLoadingState = exports.FontLoadingState || (exports.FontLoadingState = {}));
function fontLoading(state) {
    return {
        type: exports.FONT_LOADING,
        state: state
    };
}
exports.ConnectedWebFontLoader = react_redux_1.connect(null, function (dispatch) {
    return {
        loading: function () {
            dispatch(fontLoading(FontLoadingState.Loading));
        },
        active: function () {
            dispatch(fontLoading(FontLoadingState.Active));
        },
        inactive: function () {
            dispatch(fontLoading(FontLoadingState.Inactive));
        },
    };
}, function (stateProps, dispatchProps, ownProps) {
    //for own use not concerned with overriding callbacks
    var mergedProps = __assign({}, ownProps, { config: __assign({}, ownProps.config, dispatchProps) });
    return mergedProps;
})(WebFontLoader);
//# sourceMappingURL=webFontLoader.js.map