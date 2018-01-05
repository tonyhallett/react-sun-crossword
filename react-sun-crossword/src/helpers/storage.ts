import { Reducer, Store, StoreEnhancer, createStore } from "redux";

type storageType =  "localStorage" | "sessionStorage"
export function isStorageAvailable(type: storageType) {
    try {
        var storage = window[type],
            x = '__storage_test__';
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
export function stringifySetStorageItem(itemKey: string, value: any, storageType: storageType = "localStorage") {
    window[storageType].setItem(itemKey, JSON.stringify(value));
}
export function parseGetStorageItem(itemKey: string, storageType: storageType = "localStorage") {
    var storage = window[storageType];
    var setting =storage.getItem(itemKey);
    if (setting != null) {
        return JSON.parse(setting);
    }
    return setting;
}

/*
    export const createStore: StoreCreator;
    export interface StoreCreator {
  <S>(reducer: Reducer<S>, enhancer?: StoreEnhancer<S>): Store<S>;
  <S>(reducer: Reducer<S>, preloadedState: S, enhancer?: StoreEnhancer<S>): Store<S>;
}
*/
export function createLocalStorageStore<S>(reducer: Reducer<S>, previousStateReducer?: (state:S) => S, enhancer?: StoreEnhancer<S>, storeKey = "store"): Store<S> {
    previousStateReducer = previousStateReducer ? previousStateReducer : s => s;
    var store: Store<S>;
    var storageAvailable = isStorageAvailable("localStorage");
    var previousState: S;
    if (storageAvailable) {
        previousState = parseGetStorageItem(storeKey);
    }
    if (previousState) {
        store = createStore(reducer, previousStateReducer(previousState),enhancer);
    }
    else {
        store = createStore(reducer,enhancer);
    }


    if (storageAvailable) {
        store.subscribe(() => {
            var state = store.getState();
            stringifySetStorageItem(storeKey, state);
        });
    }
    return store;
}
