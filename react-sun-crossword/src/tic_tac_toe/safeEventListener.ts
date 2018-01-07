export function addEventListener(eventName: string, el: HTMLElement, fn: any) {

    if (el.addEventListener) {
        el.addEventListener(eventName, fn);
    } else {
        var ieEl = el as any;
        ieEl.attachEvent("on" + eventName, fn);
    }
}
export function removeEventListener(eventName: string, el: HTMLElement, fn: any) {
    if (el.removeEventListener) {
        el.removeEventListener(eventName, fn);
    } else {
        var ieEl = el as any;
        ieEl.detachEvent("on" + eventName, fn);
    }
}