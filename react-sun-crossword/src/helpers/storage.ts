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
    var setting = window[storageType].storage.getItem(itemKey);
    if (setting != null) {
        return JSON.parse(setting);
    }
    return setting;
}
