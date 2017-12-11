"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
function isStorageAvailable(type) {
    try {
        var storage = window[type], x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}
exports.isStorageAvailable = isStorageAvailable;
function stringifySetStorageItem(itemKey, value, storageType) {
    if (storageType === void 0) { storageType = "localStorage"; }
    window[storageType].setItem(itemKey, JSON.stringify(value));
}
exports.stringifySetStorageItem = stringifySetStorageItem;
function parseGetStorageItem(itemKey, storageType) {
    if (storageType === void 0) { storageType = "localStorage"; }
    var storage = window[storageType];
    var setting = storage.getItem(itemKey);
    if (setting != null) {
        return JSON.parse(setting);
    }
    return setting;
}
exports.parseGetStorageItem = parseGetStorageItem;
/*
    export const createStore: StoreCreator;
    export interface StoreCreator {
  <S>(reducer: Reducer<S>, enhancer?: StoreEnhancer<S>): Store<S>;
  <S>(reducer: Reducer<S>, preloadedState: S, enhancer?: StoreEnhancer<S>): Store<S>;
}
*/
function createLocalStorageStore(reducer, enhancer, storeKey) {
    if (storeKey === void 0) { storeKey = "store"; }
    var store;
    var storageAvailable = isStorageAvailable("localStorage");
    var previousState;
    if (storageAvailable) {
        previousState = parseGetStorageItem(storeKey);
    }
    if (previousState) {
        store = redux_1.createStore(reducer, previousState, enhancer);
    }
    else {
        store = redux_1.createStore(reducer, enhancer);
    }
    if (storageAvailable) {
        store.subscribe(function () {
            var state = store.getState();
            stringifySetStorageItem(storeKey, state);
        });
    }
    return store;
}
exports.createLocalStorageStore = createLocalStorageStore;
//# sourceMappingURL=storage.js.map