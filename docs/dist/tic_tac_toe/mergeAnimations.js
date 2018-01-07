"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//will not be necessary if the placeholder worked 
function mergeAnimations(animationStyles) {
    var animationProperties = [{ name: "animationDuration", default: "0s" }, { name: "animationTimingFunction", default: "ease" }, { name: "animationDelay", default: "0s" }, { name: "animationIterationCount", default: "1" }, { name: "animationDirection", default: "normal" }, { name: "animationFillMode", default: "none" }, { name: "animationPlayState", default: "running" }];
    var mergedAnimationStyle = {
        animationName: [],
        animationDuration: "",
        animationTimingFunction: "",
        animationDelay: "",
        animationIterationCount: "",
        animationDirection: "",
        animationFillMode: "",
        animationPlayState: ""
    };
    var hadFirst = false;
    for (var i = 0; i < animationStyles.length; i++) {
        var animationStyle = animationStyles[i];
        if (animationStyle && animationStyle.animationName) {
            mergedAnimationStyle.animationName.push(animationStyle.animationName);
            for (var j = 0; j < animationProperties.length; j++) {
                var animationProperty = animationProperties[j];
                var animationPropertyName = animationProperty.name;
                var animationValue = animationStyle.hasOwnProperty(animationPropertyName) ? animationStyle[animationPropertyName] : animationProperty.default;
                if (hadFirst) {
                    animationValue = "," + animationValue;
                }
                mergedAnimationStyle[animationPropertyName] = mergedAnimationStyle[animationPropertyName] + animationValue;
            }
            hadFirst = true;
        }
    }
    return mergedAnimationStyle;
}
exports.mergeAnimations = mergeAnimations;
//# sourceMappingURL=mergeAnimations.js.map