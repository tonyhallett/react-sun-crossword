import * as Radium from "Radium";

declare module "Radium" {
    export var Plugins: any
    //note that the @types does not type a Plugin 
    //https://github.com/FormidableLabs/radium/tree/master/docs/api#plugins see PluginConfig and PlugInResult
}
function keyframesPluginArray(
    { addCSS, config, style }
) {
    const newStyle = Object.keys(style).reduce(
        (newStyleInProgress, key) => {
            let value = style[key];
            if (key === 'animationName' && value && (value.__radiumKeyframes || Array.isArray(value))) {
                if (Array.isArray(value)) {
                    value = value.map(v => {
                        const keyframesValue = v;
                        const { animationName, css } = keyframesValue.__process(config.userAgent);
                        addCSS(css);
                        return animationName;
                    }).join(", ");
                } else {
                    const keyframesValue = value
                    const { animationName, css } = keyframesValue.__process(config.userAgent);
                    addCSS(css);
                    value = animationName;
                }

            }

            newStyleInProgress[key] = value;
            return newStyleInProgress;
        },
        {},
    );
    return { style: newStyle };
}
export function ConfiguredRadium(component) {
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