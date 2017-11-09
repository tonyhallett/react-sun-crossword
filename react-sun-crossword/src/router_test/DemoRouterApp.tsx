import * as React from "react";
import { BrowserRouter,Link,NavLink,Route,Redirect } from 'react-router-dom'
export class DemoRouterApp extends React.Component<undefined, undefined> {
    render() {
        return <BrowserRouter basename="/react-sun-crossword">
            <RouterAwareApp />
        </BrowserRouter>
    }
}
type BrowserRouter= {
    basename?:string
}
var navLinkActiveStyle = {
    color:"yellow"
}
export class RouterAwareApp extends React.Component<undefined, undefined> {
    constructor(props) {
        super(props);
    }
    render() {  

        return <div>
            <NavLink exact={true} activeStyle={navLinkActiveStyle} to="/">Introduction</NavLink>
            <NavLink activeStyle={navLinkActiveStyle} to="/settings">Settings</NavLink>
            <NavLink activeStyle={navLinkActiveStyle} to="/crossword">Crossword</NavLink>

            <Route exact path="/" component={Introduction}/>
            <Route path="/settings" component={Settings}/>
            <Route path="/crossword" component={Crossword}/>

            </div>
    }
}
//#region type definitions
export interface Location {
    pathname: string;	
    search: string;
    state: any;
    hash: string;
    key ?: string;
}
type Action = 'PUSH' | 'POP' | 'REPLACE';
type UnregisterCallback = () => void;
export type LocationListener = (location: Location, action: Action) => void;
export interface LocationDescriptorObject {
    pathname?: string;
    search?: string;
    state?: any;
    hash?: string;
    key?: string;

}
//not sure how up to date the @types was - properties and methods are described https://reacttraining.com/react-router/web/api/history
export interface History {
    length: number;
    action: Action;
    location: Location,
    push(path: string, state?: any): void;
    //no mention of this overload on the react router page link above
    push(location: LocationDescriptorObject): void;
    replace(path: string, state?: any): void;
    //no mention of this overload on the react router page link above
    replace(location: LocationDescriptorObject): void;
    go(n: number): void; goBack(): void;
    goForward(): void;
    block(prompt?: boolean): UnregisterCallback;
    //no mention of this overload on the react router page link above
    listen(listener: LocationListener): UnregisterCallback;

    //need to npm install the @types again - no mention of this overload on the react router page link above
    //createHref(location: LocationDescriptorObject): Href;
}
export interface RouteComponentProps<P> {
    match: match<P>
    location: Location;
    history: History;
    staticContext?: any;
}
export interface match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}
//#endregion
export class Introduction extends React.Component<undefined, undefined> {
    constructor(props) {
        super(props);
        console.log("In introduction ctor");
    }
    componentWillUnmount() {
        console.log("Introduction unmounting ************");
    }
    componentDidMount() {
        console.log("Introduction did mount ");
    }
    render() {
        return <div>This is an introduction</div>
    }
}
//#region links

interface LinkProps {
    to: string | Location
    replace?:boolean
}

export interface NavLinkProps extends LinkProps {
    activeClassName?: string;
    activeStyle?: React.CSSProperties;
    exact?: boolean;
    strict?: boolean;
    isActive?<P>(match: match<P>, location: Location): boolean;
    location?: string|Location;
}


interface DisableProps {
    enabled: boolean
    linkText: string
}
interface DisableLinkProps extends LinkProps, DisableProps { }
   
interface DisableNavLinkProps extends NavLinkProps, DisableProps { }
export class DisableNavLink extends React.Component<DisableNavLinkProps, undefined> {
    render() {
        var element = this.props.enabled ? <span className="disableLinkDisabled">{this.props.linkText}</span> : <NavLink {...this.props} >{this.props.linkText}</NavLink>
        return element;
    }
}

export class DisableLink extends React.Component<DisableLinkProps, undefined> {
    render() {
        var element= this.props.enabled ? <span className="disableLinkDisabled">{this.props.linkText}</span> : <Link to={this.props.to} replace={this.props.replace}>{this.props.linkText}</Link>
        return element;
    }
}
//#endregion

//could read the type and provide the appropriate ui
//interface Setting {
//    defaultValue: any,
//    label: string,
//    id:string
//}

interface SettingsState {
    storageAvailable: boolean,
    booleanSetting: boolean,
    stringSetting: string,
    numberSetting: number
}
export class Settings extends React.Component<undefined, SettingsState> {
    storage: Storage;
    storageAvailable: boolean;
    constructor(props:any) {
        super(props);
        console.log("In settings constructor");
        this.storageAvailable = this.isStorageAvailable("localStorage");
        this.storage = window["localStorage"];

        this.state={ storageAvailable: this.storageAvailable, booleanSetting: this.getTypedStorageItem("booleanSetting", false), stringSetting: this.getTypedStorageItem("stringSetting", "Default value"), numberSetting: this.getTypedStorageItem("numberSetting", 1) };

    }
    componentWillUnmount() {
        console.log("Settings unmounting ************");
    }
    componentDidMount() {
        console.log("Settings did mount ");
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
    setTypedStorageItem(itemKey: string, value: any) {
        this.storage.setItem(itemKey, JSON.stringify(value));
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
            //Dates not parsed - there is a reviver function ....
            this.setTypedStorageItem("stringSetting", stringSetting);
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

interface CrosswordState {
    hasCrossword: boolean,
   
}
interface IgnoreParams {

}

//var crosswordState = { hasCrossword: false, previousNavToCrossword:false };
interface NavState {
    hasCrossword: boolean,
    previousNavToCrossword:boolean
}
export class Crossword extends React.Component<RouteComponentProps<IgnoreParams>, CrosswordState> {
    navState :NavState
    constructor(props) {
        super(props);
        //will state be null if not set ? or {}
        this.navState = props.location.state ? props.location.state : {
            hasCrossword: false,
            previousNavToCrossword: false
        }

        this.state = { hasCrossword: this.navState.hasCrossword };
        
    }
    componentWillUnmount() {
        this.props.history.replace(this.props.match.path, this.navState);
    }
    updateNavState() {//what happens if there is no history ?
        window.setTimeout(() => {
            this.props.history.replace(this.props.match.path, this.navState);
        }, 0);
        
    }
    
    toggleHasCrossword = () => {
        this.setState((prevState) => {
            var hasCrossword = !prevState.hasCrossword;
            this.navState.hasCrossword = hasCrossword;
            this.updateNavState();
            return {
                hasCrossword: hasCrossword
            }
        });
    }
    
    render() {
        console.log("Render: " + this.props.location.pathname);
        if (this.props.match.isExact) {
            var redirectPath = this.props.match.url + "/chooser";
            if (this.navState.previousNavToCrossword) {
                redirectPath = this.props.match.url + "/play";
            }
            console.log("redirecting");
            return <Redirect to={redirectPath}/>
        }
        
        return <div>
            <button onClick={this.toggleHasCrossword}>{this.state.hasCrossword.toString()}</button>
            <DisableNavLink activeStyle={navLinkActiveStyle} enabled={!this.state.hasCrossword} linkText="Play" to={this.props.match.url + "/play"} />
            <NavLink activeStyle={navLinkActiveStyle}  to={this.props.match.url + "/chooser"}>Chooser</NavLink>
            
            <Route path={this.props.match.url + "/play"} render={props => {
                if (this.state.hasCrossword) {
                    this.navState.previousNavToCrossword = true;
                    //this.updateNavState();
                    return <DemoCrossword />
                }
                return  <Redirect to={this.props.match.url + "/chooser"}/>
            }}/>
            
            <Route path={this.props.match.url + "/chooser"} render={props => {
                this.navState.previousNavToCrossword = false;
                //this.updateNavState();
                return <DemoCrosswordChooser />
            }} /> 
        </div>
    }
}
export class DemoCrosswordChooser extends React.Component<undefined, undefined> {
    render() {
        return <div>Crossword chooser to go here</div>
    }
}
export class DemoCrossword extends React.Component<undefined, undefined> {
    render() {
        return <div>This is where the crossword, clues and buttons go !</div>
    }
}

