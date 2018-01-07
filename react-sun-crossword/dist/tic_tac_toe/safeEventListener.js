"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addEventListener(eventName, el, fn) {
    if (el.addEventListener) {
        el.addEventListener(eventName, fn);
    }
    else {
        var ieEl = el;
        ieEl.attachEvent("on" + eventName, fn);
    }
}
exports.addEventListener = addEventListener;
function removeEventListener(eventName, el, fn) {
    if (el.removeEventListener) {
        el.removeEventListener(eventName, fn);
    }
    else {
        var ieEl = el;
        ieEl.detachEvent("on" + eventName, fn);
    }
}
exports.removeEventListener = removeEventListener;
//# sourceMappingURL=safeEventListener.js.map