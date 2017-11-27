export function getWrapperComponentName(wrapperName:string, wrappedComponentClass: React.ComponentClass<any>) {
    return wrapperName + "(" + getWrappedComponentClassName(wrappedComponentClass) +")";
}
export function getWrappedComponentClassName(wrappedComponentClass) {
    var componentName = wrappedComponentClass.displayName || (wrappedComponentClass as any).name || "Component";
    return componentName;
}