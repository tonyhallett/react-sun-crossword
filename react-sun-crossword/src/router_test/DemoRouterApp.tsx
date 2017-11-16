﻿import * as React from "react";
import { Link,  Route, Redirect, LinkProps } from 'react-router'
import {  RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'


var navLinkActiveStyle = {
    color:"yellow"
}
//#region v3 route components
export class App extends React.Component<undefined, undefined> {
    render() {
        //will add links in here
        return <div>
            <div>This is the app, has children from sub routes including the index route</div>
            {this.props.children}
        </div>
    }
}
export class Introduction extends React.Component<undefined, undefined> {
    render() {
        return "This is the introduction - the index route";
    }
}
export class Pathless extends React.Component<undefined, undefined> {
    render() {
        return <div>
            <div>This component can have a child whose path is not a subpath</div>
            {this.props.children}
            </div>
    }
}
export class PathlessIndex extends React.Component<undefined, undefined> {
    render() {
        return "This is the index route component";
    }
}
export class PathlessChild extends React.Component<undefined, undefined> {
    render() {
        return "This component has been rendered without its route being a subpath";
    }
}
interface MultipleProps {

}
export class Multiple extends React.Component<RouteComponentProps<undefined,undefined>, undefined> {
    render() {
        var route = this.props.route as any;
        return <div>
            <div>This route component receives child components through the components property</div>
            {route.child1}
            {route.child2}
            </div>
    }
}
export class Child1 extends React.Component<undefined, undefined> {
    render() {
        return "Chil12 from Route components property";
    }
}
export class Child2 extends React.Component<undefined, undefined> {
    render() {
        return "Child2 from Route components property";
    }
}

//#endregion


//#region redux
export interface DemoState {
    demoValue: string,
    someOtherValue: any
}
//#region demo action
const DEMO_CHANGE_STRING = "DEMO_CHANGE_STRING";
export function changeDemoStateStringAction(newString: string) {
    return {
        type: DEMO_CHANGE_STRING,
        text: newString
    }
}
//#endregion
export function reducer(state: DemoState = { demoValue: "", someOtherValue:9 }, action):DemoState {
    switch (action.type) {
        case DEMO_CHANGE_STRING:
            return {
                demoValue: action.text,
                someOtherValue: state.someOtherValue
            }
        default:
            return state;
    }
}

interface DemoPresentationComponentDispatchProps {
    demoDispatchAction: (newValue: string) => void
}
interface DemoPresentationComponentStateProps {
    demoValue:string
}
interface DemoPresentationComponentProps extends DemoPresentationComponentDispatchProps, DemoPresentationComponentStateProps {}
interface DemoPresentationComponentState {
    inputValue:string
}
class DemoPresentationComponent extends React.Component<DemoPresentationComponentProps, DemoPresentationComponentState> {
    constructor(props) {
        super(props);
        this.state = { inputValue:"" }
    }
    render() {
        return <div>
            <button onClick={() => { this.props.demoDispatchAction(this.state.inputValue) }}>Dispatch action</button>
            <div>{this.props.demoValue}</div>
            <input type="text" value={this.state.inputValue} onChange={(evt) => this.setState({ inputValue: evt.target.value })} />
        </div>
    }

}

//#region connected component
const mapDispatchToProps = dispatch => {
    var dispatchToProps: DemoPresentationComponentDispatchProps = {
        demoDispatchAction: newValue => {
            dispatch(changeDemoStateStringAction(newValue))
        }
    }
    return dispatchToProps;
}

//selector
const getDemoStateProps = function (state: DemoState) {
    var demoState: DemoPresentationComponentStateProps = {
        demoValue: state.demoValue
    }
    return demoState;
}
const mapStateToProps = state => {
    return getDemoStateProps(state);
}
export const ConnectedDemoPresentationComponent=connect(mapStateToProps, mapDispatchToProps)(DemoPresentationComponent)
//#endregion

//#endregion
//#region original route components

//#region v4 DisableLink
//interface DisableProps {
//    enabled: boolean
//    linkText: string
//}
//interface DisableLinkProps extends LinkProps, DisableProps { }



//export class DisableLink extends React.Component<DisableLinkProps, undefined> {
//    render() {
//        var element = this.props.enabled ? <span className="disableLinkDisabled">{this.props.linkText}</span> : <Link to={this.props.to} replace={this.props.replace}>{this.props.linkText}</Link>
//        return element;
//    }
//}
//#endregion

//export class Introduction extends React.Component<RouteComponentProps<any>, undefined> {
//    constructor(props) {
//        super(props);
        
//    }
//    render() {
//        return <div>This is an introduction</div>
//    }
//}


////could read the type and provide the appropriate ui
////interface Setting {
////    defaultValue: any,
////    label: string,
////    id:string
////}

//interface SettingsState {
//    storageAvailable: boolean,
//    booleanSetting: boolean,
//    stringSetting: string,
//    numberSetting: number
//}
//export class Settings extends React.Component<undefined, SettingsState> {
//    storage: Storage;
//    storageAvailable: boolean;
//    constructor(props:any) {
//        super(props);
//        this.storageAvailable = this.isStorageAvailable("localStorage");
//        this.storage = window["localStorage"];

//        this.state={ storageAvailable: this.storageAvailable, booleanSetting: this.getTypedStorageItem("booleanSetting", false), stringSetting: this.getTypedStorageItem("stringSetting", "Default value"), numberSetting: this.getTypedStorageItem("numberSetting", 1) };

//    }
//    getTypedStorageItem(itemKey: string, defaultValue: any): any {
//        if (!this.storageAvailable) {
//            return defaultValue;
//        }
//        var setting = this.storage.getItem(itemKey);
//        if (setting != null) {
//            return JSON.parse(setting);
//        }
//        return defaultValue;
//    }
//    setTypedStorageItem(itemKey: string, value: any) {
//        this.storage.setItem(itemKey, JSON.stringify(value));
//    }
//    isStorageAvailable(type) {
//        try {
//            var storage = window[type],
//                x = '__storage_test__';
//            storage.setItem(x, x);
//            storage.removeItem(x);
//            return true;
//        }
//        catch (e) {
//            return e instanceof DOMException && (
//                // everything except Firefox
//                e.code === 22 ||
//                // Firefox
//                e.code === 1014 ||
//                // test name field too, because code might not be present
//                // everything except Firefox
//                e.name === 'QuotaExceededError' ||
//                // Firefox
//                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
//                // acknowledge QuotaExceededError only if there's something already stored
//                storage.length !== 0;
//        }
//    }
//    stringSettingChanged = (event) => {
//        var stringSetting = event.target.value;
//        this.setState({ stringSetting: stringSetting });
//        if (this.storageAvailable) {
//            //Dates not parsed - there is a reviver function ....
//            this.setTypedStorageItem("stringSetting", stringSetting);
//        }
//    }
//    render() {
//        return <div>
//            {!this.state.storageAvailable &&
//                <div>Local storage is not available in your browser, settings will not be persisted</div>
//            }
//            <input type="text" value={this.state.stringSetting} onChange={this.stringSettingChanged}/>
//        </div>
//    }
//}

//interface CrosswordState {
//    hasCrossword: boolean,
   
//}
//interface IgnoreParams {

//}

////var crosswordState = { hasCrossword: false, previousNavToCrossword:false };
//interface NavState {
//    hasCrossword: boolean,
//    previousNavToCrossword:boolean
//}
//export class Crossword extends React.Component<RouteComponentProps<IgnoreParams>, CrosswordState> {
//    navState :NavState
//    constructor(props) {
//        super(props);
//        //will state be null if not set ? or {}
//        this.navState = props.location.state ? props.location.state : {
//            hasCrossword: false,
//            previousNavToCrossword: false
//        }

//        this.state = { hasCrossword: this.navState.hasCrossword };
        
//    }
//    updateNavState() {
//        //this.props.match.url is incorrect - does not show the search !
//        var url = this.props.location.pathname + this.props.location.search;
//        window.setTimeout(() => {
//            this.props.history.replace(url, this.navState);
//        },0)
        
//    }
    
    
//    toggleHasCrossword = () => {
//        this.setState((prevState) => {
//            var hasCrossword = !prevState.hasCrossword;
//            this.navState.hasCrossword = hasCrossword;
//            this.updateNavState();
//            return {
//                hasCrossword: hasCrossword
//            }
//        });
//    }
//    getChooserSearch = () => {
//        return "?chooser";
//    }
//    getPlaySearch = () => {
//        return "?play";
//    }
//    //need to check the differece between match url and path !
//    getNonExactElement = () => {
//        if (this.props.location.search==this.getPlaySearch())
//        {
//            if (this.state.hasCrossword) {
//                if (!this.navState.previousNavToCrossword) {
//                    this.navState.previousNavToCrossword = true;
//                    this.updateNavState();
//                }
                
//                return <DemoCrossword />
//            }
//            return <Redirect to={{ pathname: this.props.match.url, search: this.getChooserSearch() }} />
//        } else if (this.props.location.search == this.getChooserSearch()) {
//            if (this.navState.previousNavToCrossword) {
//                this.navState.previousNavToCrossword = false;
//                this.updateNavState();
//            }
            
//            return <DemoCrosswordChooser />
//        } else {
//            //should redirect to bad path ?
//            return null;
//        }
//    }

//    render() {
//        console.log("Render: " + this.props.location.pathname);
//        //search could be null or undefined ?
//        //match.isExact is returning true when have the query string which is not specified in the link !!!
//        if (this.props.location.pathname === "/crossword" && this.props.location.search == "") {
            
//            console.log("redirecting");
//            //will this replace the state !!!!!!??????

//            //
//            return <Redirect to={{ pathname: this.props.match.url,search:this.navState.previousNavToCrossword ? this.getChooserSearch() : this.getPlaySearch() }} />
//        }
//        //if I remove Route will I get the re-render when redirect
//        return <div>
//            <button onClick={this.toggleHasCrossword}>{this.state.hasCrossword.toString()}</button>
//            <DisableNavLink activeStyle={navLinkActiveStyle} enabled={!this.state.hasCrossword} linkText="Play" to={{ pathname: this.props.match.url, search:"?play"}} />
//            <NavLink activeStyle={navLinkActiveStyle} to={{ pathname: this.props.match.url, search: "?chooser" }}>Chooser</NavLink>
//            {this.getNonExactElement()}
            
//        </div>
//    }
//}
//export class DemoCrosswordChooser extends React.Component<undefined, undefined> {
//    render() {
//        return <div>Crossword chooser to go here</div>
//    }
//}
//export class DemoCrossword extends React.Component<undefined, undefined> {
//    render() {
//        return <div>This is where the crossword, clues and buttons go !</div>
//    }
//}
//#endregion

