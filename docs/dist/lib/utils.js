"use strict";
/* @flow */
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
/**
 * Constants.
 */
var NORMALIZED_KEYS = {
    'Esc': 'Escape',
    'Spacebar': ' ',
    'Left': 'ArrowLeft',
    'Up': 'ArrowUp',
    'Right': 'ArrowRight',
    'Down': 'ArrowDown',
    'Del': 'Delete',
    'Win': 'OS',
    'Menu': 'ContextMenu',
    'Apps': 'ContextMenu',
    'Scroll': 'ScrollLock',
    'MozPrintableKey': 'Unidentified',
};
var KEY_CODE_KEYS = {
    '8': 'Backspace',
    '9': 'Tab',
    '12': 'Clear',
    '13': 'Enter',
    '16': 'Shift',
    '17': 'Control',
    '18': 'Alt',
    '19': 'Pause',
    '20': 'CapsLock',
    '27': 'Escape',
    '32': ' ',
    '33': 'PageUp',
    '34': 'PageDown',
    '35': 'End',
    '36': 'Home',
    '37': 'ArrowLeft',
    '38': 'ArrowUp',
    '39': 'ArrowRight',
    '40': 'ArrowDown',
    '45': 'Insert',
    '46': 'Delete',
    '112': 'F1',
    '113': 'F2',
    '114': 'F3',
    '115': 'F4',
    '116': 'F5',
    '117': 'F6',
    '118': 'F7',
    '119': 'F8',
    '120': 'F9',
    '121': 'F10',
    '122': 'F11',
    '123': 'F12',
    '144': 'NumLock',
    '145': 'ScrollLock',
    '224': 'Meta',
};
/**
 * Check if `given` element is an input / textarea form element or acts as one.
 */
function isInput(element) {
    if (!element) {
        return false;
    }
    var tagName = element.tagName;
    var editable = isContentEditable(element);
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || editable;
}
exports.isInput = isInput;
function isContentEditable(element) {
    if (typeof element.getAttribute !== 'function') {
        return false;
    }
    return !!element.getAttribute('contenteditable');
}
/**
 * Matches an event against a given keyboard key.
 */
function matchesKeyboardEvent(event, _a) {
    var keyCode = _a.keyCode, keyValue = _a.keyValue;
    if (!isNullOrUndefined(keyValue)) {
        //console.log("checking " + keyValue);
        return keyValue === eventKey(event);
    }
    if (!isNullOrUndefined(keyCode)) {
        return keyCode === event.keyCode;
    }
    return false;
}
exports.matchesKeyboardEvent = matchesKeyboardEvent;
function isNullOrUndefined(value) {
    return (value === undefined) || (value === null);
}
function eventKey(event) {
    var key = event.key, keyCode = event.keyCode, type = event.type;
    if (key) {
        var normalizedKey = NORMALIZED_KEYS[key] || key;
        if (normalizedKey !== 'Unidentified') {
            return normalizedKey;
        }
    }
    if (type === constants_1.KEYPRESS) {
        var charCode = eventCharCode(event);
        return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
    }
    if (type === constants_1.KEYDOWN || type === constants_1.KEYUP) {
        return KEY_CODE_KEYS[String(keyCode)] || 'Unidentified';
    }
    return '';
}
exports.eventKey = eventKey;
function eventCharCode(event) {
    var charCode = event.charCode, keyCode = event.keyCode;
    if ('charCode' in event) {
        if (charCode === 0 && keyCode === 13) {
            return 13;
        }
    }
    else {
        charCode = keyCode;
    }
    if (charCode >= 32 || charCode === 13) {
        return charCode;
    }
    return 0;
}
//# sourceMappingURL=utils.js.map