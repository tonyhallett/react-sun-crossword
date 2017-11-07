import * as React from "react";
import { BrowserRouter,Link,Route } from 'react-router-dom'
export class DemoRouterApp extends React.Component<undefined, undefined> {
    render() {
        return <BrowserRouter>
            <RouterAwareApp />
        </BrowserRouter>
    }
}

export class RouterAwareApp extends React.Component<undefined, undefined> {
    render() {  
        return <div>
            <Link to="/react-sun-crossword/">Introduction</Link>
            <Link to="/react-sun-crossword/settings">Settings</Link>
            <Link to="/react-sun-crossword/crossword">Crossword</Link>

            <Route exact path="/react-sun-crossword/" component={Introduction} />
            <Route path="/react-sun-crossword/settings" component={Settings} />
            <Route path="/react-sun-crossword/crossword" component={Crossword} />

            </div>
    }
}

export class Introduction extends React.Component<undefined, undefined> {
    render() {
        return <div>This is an introduction</div>
    }
}
interface SettingsState {
    storageAvailable: boolean,
    booleanSetting: boolean,
    stringSetting: string,
    numberSetting: number
}

//could read the type and provide the appropriate ui
interface Setting {
    defaultValue: any,
    label: string,
    id:string
}
export class Settings extends React.Component<undefined, SettingsState> {
    storage: Storage;
    storageAvailable: boolean;
    constructor() {
        super(null);
        this.storageAvailable = this.isStorageAvailable("localStorage");
        this.storage = window["localStorage"];

        this.setState({ storageAvailable: this.storageAvailable, booleanSetting: this.getTypedStorageItem("booleanSetting", false), stringSetting: this.getTypedStorageItem("stringSetting", "Default value"), numberSetting: this.getTypedStorageItem("numberSetting", 1) });

    }

    getTypedStorageItem(itemKey: string, defaultValue: any): any {
        if (!this.storageAvailable) {
            return defaultValue;
        }
        var setting = this.storage.getItem(itemKey);
        if (setting != null) {
            return JSON.parse(setting);
        }
        return defaultValue;
    }
    isStorageAvailable(type) {
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
    stringSettingChanged = (event) => {
        var stringSetting = event.target.value;
        this.setState({ stringSetting: stringSetting });
        if (this.storageAvailable) {
            this.storage.setItem("stringSetting", stringSetting);//for others will need to use the JSON.parse - Dates not parsed - there is a reviver function ....
            
        }
    }
    //would still show settings but will note that they cannot be saved
    render() {
        return <div>
            {!this.state.storageAvailable &&
                <div>Local storage is not available in your browser, settings will not be persisted</div>
            }
            <input type="text" value={this.state.stringSetting} onChange={this.stringSettingChanged}/>
        </div>
    }
}

export class Crossword extends React.Component<undefined, undefined> {
    render() {
        return <div>This is where have to have chooser and the crossword, clues, buttons etc</div>
    }
}


