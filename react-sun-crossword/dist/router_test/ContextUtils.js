"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prop_types_1 = require("prop-types");
// Works around issues with context updates failing to propagate.
// Caveat: the context value is expected to never change its identity.
// https://github.com/facebook/react/issues/2517
// https://github.com/reactjs/react-router/issues/470
var contextProviderShape = prop_types_1.default.shape({
    subscribe: prop_types_1.default.func.isRequired,
    eventIndex: prop_types_1.default.number.isRequired
});
function makeContextName(name) {
    return "@@contextSubscriber/" + name;
}
function ContextProvider(name) {
    var contextName = makeContextName(name);
    var listenersKey = contextName + "/listeners";
    var eventIndexKey = contextName + "/eventIndex";
    var subscribeKey = contextName + "/subscribe";
    return _a = {
            childContextTypes: (_b = {},
                _b[contextName] = contextProviderShape.isRequired,
                _b),
            getChildContext: function () {
                return _a = {},
                    _a[contextName] = {
                        eventIndex: this[eventIndexKey],
                        subscribe: this[subscribeKey]
                    },
                    _a;
                var _a;
            },
            componentWillMount: function () {
                this[listenersKey] = [];
                this[eventIndexKey] = 0;
            },
            componentWillReceiveProps: function () {
                this[eventIndexKey]++;
            },
            componentDidUpdate: function () {
                var _this = this;
                this[listenersKey].forEach(function (listener) {
                    return listener(_this[eventIndexKey]);
                });
            }
        },
        _a[subscribeKey] = function (listener) {
            var _this = this;
            // No need to immediately call listener here.
            this[listenersKey].push(listener);
            return function () {
                _this[listenersKey] = _this[listenersKey].filter(function (item) {
                    return item !== listener;
                });
            };
        },
        _a;
    var _a, _b;
}
exports.ContextProvider = ContextProvider;
function ContextSubscriber(name) {
    var contextName = makeContextName(name);
    var lastRenderedEventIndexKey = contextName + "/lastRenderedEventIndex";
    var handleContextUpdateKey = contextName + "/handleContextUpdate";
    var unsubscribeKey = contextName + "/unsubscribe";
    return _a = {
            contextTypes: (_b = {},
                _b[contextName] = contextProviderShape,
                _b),
            getInitialState: function () {
                if (!this.context[contextName]) {
                    return {};
                }
                return _a = {},
                    _a[lastRenderedEventIndexKey] = this.context[contextName].eventIndex,
                    _a;
                var _a;
            },
            componentDidMount: function () {
                if (!this.context[contextName]) {
                    return;
                }
                this[unsubscribeKey] = this.context[contextName].subscribe(this[handleContextUpdateKey]);
            },
            componentWillReceiveProps: function () {
                if (!this.context[contextName]) {
                    return;
                }
                this.setState((_a = {},
                    _a[lastRenderedEventIndexKey] = this.context[contextName].eventIndex,
                    _a));
                var _a;
            },
            componentWillUnmount: function () {
                if (!this[unsubscribeKey]) {
                    return;
                }
                this[unsubscribeKey]();
                this[unsubscribeKey] = null;
            }
        },
        _a[handleContextUpdateKey] = function (eventIndex) {
            if (eventIndex !== this.state[lastRenderedEventIndexKey]) {
                this.setState((_a = {}, _a[lastRenderedEventIndexKey] = eventIndex, _a));
            }
            var _a;
        },
        _a;
    var _a, _b;
}
exports.ContextSubscriber = ContextSubscriber;
//# sourceMappingURL=ContextUtils.js.map