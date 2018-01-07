"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Radium = require("Radium");
function keyframesPluginArray(_a) {
    var addCSS = _a.addCSS, config = _a.config, style = _a.style;
    var newStyle = Object.keys(style).reduce(function (newStyleInProgress, key) {
        var value = style[key];
        if (key === 'animationName' && value && (value.__radiumKeyframes || Array.isArray(value))) {
            if (Array.isArray(value)) {
                value = value.map(function (v) {
                    var keyframesValue = v;
                    var _a = keyframesValue.__process(config.userAgent), animationName = _a.animationName, css = _a.css;
                    addCSS(css);
                    return animationName;
                }).join(", ");
            }
            else {
                var keyframesValue = value;
                var _a = keyframesValue.__process(config.userAgent), animationName = _a.animationName, css = _a.css;
                addCSS(css);
                value = animationName;
            }
        }
        newStyleInProgress[key] = value;
        return newStyleInProgress;
    }, {});
    return { style: newStyle };
}
function ConfiguredRadium(component) {
    return Radium({
        plugins: [
            Radium.Plugins.mergeStyleArray,
            Radium.Plugins.checkProps,
            Radium.Plugins.resolveMediaQueries,
            Radium.Plugins.resolveInteractionStyles,
            keyframesPluginArray,
            Radium.Plugins.visited,
            Radium.Plugins.removeNestedStyles,
            Radium.Plugins.prefix,
            Radium.Plugins.checkProps,
        ]
    })(component);
}
exports.ConfiguredRadium = ConfiguredRadium;
//# sourceMappingURL=configuredRadium.js.map