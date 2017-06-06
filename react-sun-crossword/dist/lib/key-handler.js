/* @flow */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var React = require("react");
//import {canUseDOM} from 'exenv';
var constants_1 = require("./constants");
var utils_1 = require("./utils");
function keyModifiersAny() {
    return {
        altKey: true,
        ctrlKey: true,
        shiftKey: true,
        none: true,
        andOr: AndOr.Or
    };
}
exports.keyModifiersAny = keyModifiersAny;
var KeyModifiersEnum;
(function (KeyModifiersEnum) {
    KeyModifiersEnum[KeyModifiersEnum["none"] = 0] = "none";
    KeyModifiersEnum[KeyModifiersEnum["alt"] = 1] = "alt";
    KeyModifiersEnum[KeyModifiersEnum["ctrl"] = 2] = "ctrl";
    KeyModifiersEnum[KeyModifiersEnum["shift"] = 4] = "shift";
    KeyModifiersEnum[KeyModifiersEnum["all"] = 7] = "all";
})(KeyModifiersEnum = exports.KeyModifiersEnum || (exports.KeyModifiersEnum = {}));
var AndOr;
(function (AndOr) {
    AndOr[AndOr["Or"] = 0] = "Or";
    AndOr[AndOr["AndLoose"] = 1] = "AndLoose";
    AndOr[AndOr["AndExact"] = 2] = "AndExact";
})(AndOr = exports.AndOr || (exports.AndOr = {}));
var KeyHandler = (function (_super) {
    __extends(KeyHandler, _super);
    function KeyHandler(props) {
        var _this = _super.call(this, props) || this;
        _this.isModifierMatch = function (event, modifiers) {
            var match = true;
            var modKeys = {
                altKey: modifiers.altKey,
                ctrlKey: modifiers.ctrlKey,
                shiftKey: modifiers.shiftKey
            };
            var none = modifiers.none;
            if (modifiers.andOr !== AndOr.Or) {
                if (none) {
                    throw new Error("cannot have none and and");
                }
                for (var modKey in modKeys) {
                    if (modKeys[modKey]) {
                        match = event[modKey];
                        if (!match) {
                            break;
                        }
                    }
                }
            }
            else {
                //console.log("in or")//these needs to change to cater for none 
                var noModifiers = true;
                for (var modKey in modKeys) {
                    if (modKeys[modKey]) {
                        //console.log("Looking at event " + modKey);
                        match = event[modKey];
                        if (noModifiers) {
                            noModifiers = !match;
                        }
                        if (match) {
                            //console.log("match key: " + modKey);
                            break;
                        }
                    }
                }
                if (!match && noModifiers && none) {
                    //console.log('no modifiers and none');
                    match = true;
                }
            }
            //console.log('is match: ' + match)
            return match;
        };
        _this.handleKey = function (event) {
            //console.log("keyhandler component handle key")
            var _a = _this.props, keyValue = _a.keyValue, keyCode = _a.keyCode, keyMatches = _a.keyMatches, onKeyHandle = _a.onKeyHandle;
            if (!onKeyHandle) {
                return;
            }
            var target = event.target;
            if (target instanceof HTMLElement && utils_1.isInput(target)) {
                return;
            }
            //console.log("Before keyMatches");
            var matchingIds = [];
            var matches;
            if (keyMatches) {
                //console.log("In key matches");
                //could have mapped all to Array<ModKey> but then would have had unnecessary looping
                if (keyMatches instanceof Array) {
                    for (var i = 0; i < keyMatches.length; i++) {
                        var keyOrModKey = keyMatches[i];
                        var key;
                        var mod = keyModifiersAny();
                        var id = null;
                        if (typeof keyOrModKey === 'string') {
                            key = keyOrModKey;
                        }
                        else {
                            key = keyOrModKey.key;
                            mod = keyOrModKey.modifiers;
                            id = keyOrModKey.id;
                        }
                        var kbKey = { keyValue: key, keyCode: null };
                        var possibleMatch = utils_1.matchesKeyboardEvent(event, kbKey);
                        if (possibleMatch) {
                            var isMatch = _this.isModifierMatch(event, mod);
                            if (!matches) {
                                matches = isMatch;
                            }
                            if (matches && id) {
                                matchingIds.push(id);
                            }
                            if (!id) {
                                break;
                            }
                        }
                    }
                }
                else {
                    var keys = keyMatches.keys;
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var possibleMatch = utils_1.matchesKeyboardEvent(event, { keyValue: key, keyCode: null });
                        if (possibleMatch) {
                            matches = _this.isModifierMatch(event, keyMatches.modifiers);
                            break;
                        }
                    }
                }
            }
            else {
                matches = utils_1.matchesKeyboardEvent(event, { keyValue: keyValue, keyCode: keyCode });
            }
            if (matches) {
                onKeyHandle(event, matchingIds);
            }
        };
        return _this;
        /* eslint-disable no-console */
        //if (!props.keyValue && !props.keyCode) {
        //  console.error('Warning: Failed propType: Missing prop `keyValue` or `keyCode` for `KeyHandler`.');
        //}
        /* eslint-enable */
    }
    KeyHandler.prototype.shouldComponentUpdate = function () {
        return false;
    };
    KeyHandler.prototype.componentDidMount = function () {
        //if (!canUseDOM) return;
        window.document.addEventListener(this.props.keyEventName, this.handleKey);
    };
    KeyHandler.prototype.componentWillUnmount = function () {
        //if (!canUseDOM) return;
        window.document.removeEventListener(this.props.keyEventName, this.handleKey);
    };
    KeyHandler.prototype.render = function () {
        return null;
    };
    return KeyHandler;
}(React.Component));
KeyHandler.defaultProps = {
    keyEventName: constants_1.KEYUP,
};
exports.KeyHandler = KeyHandler;
;
/**
 * KeyHandler decorators.
 */
//...any: any[]
function keyHandleDecorator(matcher) {
    return function (props) {
        var _a = props || {}, keyValue = _a.keyValue, keyCode = _a.keyCode, keyEventName = _a.keyEventName, keyMatches = _a.keyMatches;
        return function (Component) { return ((function (_super) {
            __extends(KeyHandleDecorator, _super);
            //the decorator needs to have the same property interface 
            function KeyHandleDecorator() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = { keyValue: null, keyCode: null, modifiers: null };
                _this.handleKey = function (event, ids) {
                    //console.log("HOC handleKey");
                    if (matcher && matcher(event, _this.state)) {
                        _this.setState({ keyValue: null, keyCode: null });
                        return;
                    }
                    var modifiers = KeyModifiersEnum.none;
                    if (event.altKey) {
                        modifiers |= KeyModifiersEnum.alt;
                    }
                    if (event.ctrlKey) {
                        modifiers |= KeyModifiersEnum.ctrl;
                    }
                    if (event.shiftKey) {
                        modifiers |= KeyModifiersEnum.shift;
                    }
                    var keyValue = utils_1.eventKey(event);
                    var keyCode = event.keyCode;
                    if (ids.length > 0) {
                        ids.forEach(function (methodName) {
                            _this.wrappedInstance[methodName](event, keyValue, keyCode, modifiers);
                        });
                    }
                    else {
                        _this.setState({ keyValue: keyValue, keyCode: keyCode, modifiers: modifiers });
                    }
                };
                return _this;
            }
            KeyHandleDecorator.prototype.render = function () {
                var _this = this;
                function isKeyMatchesMethodName(toDetermine) {
                    return toDetermine.methodName !== undefined;
                }
                var mappedKeyMatches = keyMatches;
                if (keyMatches) {
                    if (keyMatches instanceof Array) {
                        var testEntry = keyMatches[0];
                        if (isKeyMatchesMethodName(testEntry)) {
                            var keyMatchesMethodNameArray = keyMatches;
                            var allModKeys = [];
                            keyMatchesMethodNameArray.forEach(function (keyMatchesMethodName) {
                                var methodName = keyMatchesMethodName.methodName;
                                var kMatches = keyMatchesMethodName.keyMatches;
                                var modKeys;
                                if (kMatches instanceof Array) {
                                    var tEntry = kMatches[0];
                                    if (typeof tEntry === 'string') {
                                        var anyKeyModifiers = keyModifiersAny();
                                        modKeys = kMatches.map(function (kMatch) {
                                            var modKey = {
                                                key: kMatch,
                                                modifiers: anyKeyModifiers
                                            };
                                            return modKey;
                                        });
                                    }
                                    else {
                                        modKeys = kMatches;
                                    }
                                }
                                else {
                                    var modifiers = kMatches.modifiers;
                                    modKeys = kMatches.keys.map(function (key) {
                                        var modKey = {
                                            key: key,
                                            modifiers: modifiers
                                        };
                                        return modKey;
                                    });
                                }
                                modKeys.forEach(function (modKey) { return modKey.id = methodName; });
                                allModKeys = allModKeys.concat(modKeys);
                            });
                            mappedKeyMatches = allModKeys;
                        }
                    }
                }
                return (React.createElement("div", null,
                    React.createElement(KeyHandler, { keyValue: keyValue, keyCode: keyCode, keyMatches: mappedKeyMatches, keyEventName: keyEventName, onKeyHandle: this.handleKey }),
                    React.createElement(Component, __assign({ ref: function (instance) { _this.wrappedInstance = instance; } }, this.props, this.state))));
            };
            return KeyHandleDecorator;
        }(React.Component))); };
    };
}
exports.keyHandler = keyHandleDecorator();
exports.keyToggleHandler = keyHandleDecorator(utils_1.matchesKeyboardEvent);
/**
 * Constants
 */
__export(require("./constants"));
//# sourceMappingURL=key-handler.js.map