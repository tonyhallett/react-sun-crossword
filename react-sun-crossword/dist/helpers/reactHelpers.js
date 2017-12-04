"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWrapperComponentName(wrapperName, wrappedComponentClass) {
    return wrapperName + "(" + getWrappedComponentClassName(wrappedComponentClass) + ")";
}
exports.getWrapperComponentName = getWrapperComponentName;
function getWrappedComponentClassName(wrappedComponentClass) {
    var componentName = wrappedComponentClass.displayName || wrappedComponentClass.name || "Component";
    return componentName;
}
exports.getWrappedComponentClassName = getWrappedComponentClassName;
//# sourceMappingURL=reactHelpers.js.map