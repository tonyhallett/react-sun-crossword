import * as React from "react";
import { Link,  Route, Redirect, LinkProps ,RouterState} from 'react-router'
import { RouteComponentProps, IndexLink, PlainRoute, IndexRoute, RouteComponents } from 'react-router'
import { connect } from 'react-redux'
import { ReactElement } from "react";
import ReactJson from 'react-json-view'
import { LocationDescriptor } from "history";
import { push }  from 'react-router-redux'


//#region v3 route components
//#region link styling
//should create a hoc styled link
var linkActiveStyle: React.CSSProperties = {
    color: "yellow"
}
var linkStyle: React.CSSProperties = {
    margin: "5px"
}
//#endregion
export class Container extends React.Component<undefined, undefined>{
    render() {
        return <div style={{ padding: "10px", borderStyle: "solid", borderColor: "green", borderWidth: "2px" }}>
            {this.props.children}
        </div>
    }
}
export class App extends React.Component<undefined, undefined> {
    render() {
        return <div>
            
            <div>This is the app, has children from sub routes including the index route</div>
            <IndexLink style={linkStyle} activeStyle={linkActiveStyle} to="/">Introduction</IndexLink>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/pathless">Pathless root</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/pathlessChild">Pathless</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/multiple">Multiple</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/many">Redirected</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/redirect">Redirect in hook</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/additionalProps">Additional props</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/leaveHook">Leave hook</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/propsFromParent">Props from parent</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/onChange/change1">On change child route 1</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/onChange/change2">On change child route 2</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation">Nav/Matching</Link>
            <ReactJsonContainer />
            <Container>
                {this.props.children}
            </Container>
        </div>
    }
}

//#region mount dispatch wrapper
interface MountDispatchFunction {
    (isMount: boolean):void;
}
interface WrapperProps {
    mountUnmount: MountDispatchFunction
}

function wrapMountDispatch<P>(Component: React.ComponentClass<P>,displayName:string){

    var wrapper = class MountWrapper extends React.Component<P & WrapperProps, any>{
        componentDidMount() {
            this.props.mountUnmount(true);
        }
        componentWillUnmount() {
            this.props.mountUnmount(false);
        }
        render() {
            //cast necessary for spread operator - https://github.com/Microsoft/TypeScript/issues/10727
            const { mountUnmount, ...passThroughProps } = (this as any).props;
            return <Component {...passThroughProps} />
        }
    }
    var connected= connect(null, (dispatch => {
        var wrapperProps: WrapperProps= {
            mountUnmount: (isMount: boolean) => {
                dispatch(hookOrMountActionCreator(isMount ? "ComponentDidMount" : "ComponentWillUnmount", { componentName: displayName }));
            }
        }
        return wrapperProps;
    }))(wrapper);
    connected.displayName = displayName;
    return connected;
}
//#endregion
interface ReactJsonSrcProps {
    src?: any
}
interface OwnProps { }
//#region typing for ReactJson
interface ReactJsonProps {
    src:any
}
type ReactJson = React.ComponentClass<ReactJsonProps>

//#endregion
const ReactJsonContainer = connect((state: RouterAppState, ownProps: OwnProps) => {
    return {
        src: {
            hookAndMounts: hooksAndMountsSelector(state)
        }
    } as ReactJsonSrcProps
})(ReactJson);

//#region Introduction
export class IntroductionComp extends React.Component<undefined, undefined> {
    render() {
        return "This is the introduction - the index route";
    }
}

export const Introduction = wrapMountDispatch(IntroductionComp,"Introduction");
//#endregion
//#region Pathless
export class PathlessComp extends React.Component<undefined, undefined> {
    render() {
        return <div>
            <div>This component can have a child whose path is not a subpath</div>
            <Container>
                {this.props.children}
             </Container>
        </div>
    }
}

export const Pathless = wrapMountDispatch(PathlessComp, "Pathless");
export class PathlessIndexComp extends React.Component<undefined, undefined> {
    render() {
        return "This is the index route component";
    }
}
export const PathlessIndex = wrapMountDispatch(PathlessIndexComp, "PathlessIndex");
export class PathlessChildComp extends React.Component<undefined, undefined> {
    render() {
        return "This component has been rendered without its route being a subpath";
    }
}
export const PathlessChild = wrapMountDispatch(PathlessChildComp, "PathlessChild");
//#endregion
//#region multiple
export class MultipleComp extends React.Component<RouteComponentProps<undefined,undefined>, undefined> {
    render() {
        
        return <div>
            <div>This route component receives child components through a matching child route's components property</div>
            <Container>
                {this.props["child1"]}
            </Container>
            <Container>
                {this.props["child2"]}
            </Container>
        </div>
    }
}
export const Multiple = wrapMountDispatch(MultipleComp, "Multiple");
export class Child1Comp extends React.Component<undefined, undefined> {
    render() {
        return "Child1 from Route components property";
    }
}
export const Child1 = wrapMountDispatch(Child1Comp, "MultipleChild1");
export class Child2Comp extends React.Component<undefined, undefined> {
    render() {
        return "Child2 from Route components property";
    }
}
export const Child2 = wrapMountDispatch(Child2Comp, "MultipleChild2");
//#endregion
//#region additional props
export class AdditionalPropsComp extends React.Component<RouteComponentProps<undefined, undefined>, undefined> {
    render() {
        var additionalProp = (this.props.route as any).additionalProp.additional;
        return <div>{"Received additional prop from route " + additionalProp}</div>
    }
}
export const AdditionalProps = wrapMountDispatch(AdditionalPropsComp, "AdditionalProps");
//#endregion
//#region leave hook
interface LeaveHookState {
    canLeave:boolean
}
export class LeaveHookComponentComp extends React.Component<RouteComponentProps<undefined, undefined>, LeaveHookState> {
    constructor(props) {
        super(props);
        this.state = { canLeave:false }
    }
    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
    }

    routerWillLeave(nextLocation) {
        // return false to prevent a transition w/o prompting the user,
        // or return a string to allow the user to decide:
        // return `null` or nothing to let other hooks to be executed
        //
        // NOTE: if you return true, other hooks will not be executed!
        if (!this.state.canLeave)
            return "Please don't leave. Ok to leave, cancel to stay";
    }
    toggleCanLeave = () => {
        this.setState((prevState, props) => {
            return { canLeave: !prevState.canLeave };
        });
    }
    render() {
        return <div>
            <button onClick={this.toggleCanLeave}>{this.state.canLeave ? "Can leave" : "Can't leave"}</button>
            
            </div>
    }
}
export const LeaveHookComponent = wrapMountDispatch(LeaveHookComponentComp, "LeaveHook");
//#endregion

//#region change component
export class OnChangeComp extends React.Component<undefined, undefined> {
    render() {
        return <div>By switching between the child routes, the onChange hook should be fired
        <Container>
            {this.props.children}
        </Container>
        </div>
    }
}
export const OnChangeComponent = wrapMountDispatch(OnChangeComp, "OnChange");
export class OnChangeChild1Comp extends React.Component<undefined, undefined> {
    render() {
        return "On change child 1";
    }
}
export const OnChangeChild1 = wrapMountDispatch(OnChangeChild1Comp, "OnChangeChild1");
export class OnChangeChild2Comp extends React.Component<undefined, undefined> {
    render() {
        return "On change child 2";
    }
}
export const OnChangeChild2 = wrapMountDispatch(OnChangeChild2Comp, "OnChangeChild2");
//#endregion
//#region props from parent
interface PropsFromParentParentState {
    someState:string
}
export class PropsFromParentParentComp extends React.Component<undefined, PropsFromParentParentState>{
    constructor(props) {
        super(props);
        this.state = { someState:"Initial from parent" }
    }
    changeState = () => {
        this.setState({someState:"Change by parent"});
    }
    render() {
        return <div>
            <button onClick={this.changeState}>Change state</button>
            <Container>
                {React.Children.map(this.props.children, c => React.cloneElement(c as ReactElement<any>, { someState: this.state.someState }))}
            </Container>
        </div>
    }
}
export const PropsFromParentParent = wrapMountDispatch(PropsFromParentParentComp, "PropsFromParentParent");
export class PropsFromParentChildComp extends React.Component<PropsFromParentParentState & RouteComponentProps<undefined, undefined>, undefined>{
    render() {
        return <div>
            <div>{"this prop has come from parent:" + this.props.someState}</div>
            <div>{"this prop ( location.pathname ) has come from the router: " + this.props.location.pathname}</div>

        </div>
    }
}





export const PropsFromParentChild = wrapMountDispatch(PropsFromParentChildComp, "PropsFromParentChild");
//#endregion
//#region navigation
interface NavigationDispatchProps {
    navThroughDispatch: (location: LocationDescriptor) => void
}
interface NavigationCompProps extends NavigationDispatchProps,RouteComponentProps<any,any> {

}
interface NavigationCompState {
    someState:number
}
export class NavigationComp extends React.Component<NavigationCompProps, NavigationCompState>{
    constructor(props) {
        super(props);
        this.state = { someState:0 }
    }
    doPush = () => {
        this.props.navThroughDispatch("/leaveHook");
    }
    incrementLinkState = () => {
        this.setState((prevState) => {
            return { someState: prevState.someState + 1 }
        });
    }
    render() {
        return <div>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/params/someParamValue1/greedySplat1MatchPart">Params 1</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/params/someParamValue2/greedySplat2MatchPart">Params 2</Link>

            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/optionalPartNotOptional">Optional 1</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/NotOptional">Optional 2</Link>

            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/noMatchingChildRoute">No matching child route</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/noMatchingRoute">No matching route</Link>

            <Link style={linkStyle} activeStyle={linkActiveStyle} to={{ pathname:"/navigation/querySearchState", query: "someQuery", search: "someSearch", state: { someState: this.state.someState } }} >Query Searh State</Link>

            <button onClick={this.doPush}>Test push ( leave hook )</button>
            <button onClick={this.incrementLinkState}>Increment link state</button>

            {this.props.children}
        </div>
    }
}

export const Navigation = wrapMountDispatch(connect(null, (dispatch) => {
    var mappedDispatch: NavigationDispatchProps = {
        navThroughDispatch: function (location: LocationDescriptor) {
            dispatch(push(location));
        }
    }
    return mappedDispatch;
})(NavigationComp), "Navigation");


function createNavigationComponent(renderFunction: () => React.ReactNode,displayName:string) {
    var wrapper= class Wrapper extends React.Component<RouteComponentProps<any,any>, undefined>{
        render() {
            var details = renderFunction();
            return <div>
                {details}
                <ReactJson src={{ location: this.props.location, params: this.props.params,routeParams:this.props.routeParams }} />
            </div>
        }
    }
    return wrapMountDispatch(wrapper, displayName);   
}
export const ParamParent = createNavigationComponent(() => <div>ParamParent</div>, "ParamParent ");
export const ParamChild = createNavigationComponent(() => <div>ParamChild</div>, "ParamChild");
export const Optional = createNavigationComponent(() => <div>Optional</div>, "Optional");
export const QuerySearchState = createNavigationComponent(() => <div>QuerySearchState</div>, "QuerySearchState");

//endregion

//#region actions/reducers/state/selectors
const HOOK_OR_MOUNT = "HOOK_OR_MOUNT";

//note that this does not agree with flux standard actions
export function hookOrMountActionCreator(type:hookOrMountType,details: object) {
    return {
        type: HOOK_OR_MOUNT,
        hookOrMountType: type,
        details:details
    }
}

const ENTERHOOK = "EnterHook";
const LEAVEHOOK = "LeaveHook";
const CHANGEHOOK = "ChangeHook"
type hookType = typeof ENTERHOOK | typeof LEAVEHOOK | typeof CHANGEHOOK
type hookOrMountType = hookType | "ComponentDidMount" | "ComponentWillUnmount"
interface ObjectAny {
    [key: string]: any
}
interface HookOrMountAction{
    type: string,
    hookOrMountType: hookOrMountType,
    details:ObjectAny
}
interface HookOrMountDetail {
    type: hookOrMountType,
    details:any
}
interface RootReducerState {
    hooksAndMounts: HookOrMountDetail[]
}
interface RouterAppState {
    rootReducer: RootReducerState
    router: {
        locationBeforeTransitions:any//should be type Location ?
    }
    
}
function hooksAndMountsSelector(state: RouterAppState) {
    return state.rootReducer.hooksAndMounts
}

function clone(orig, blacklistedProps) {
    var newProps = {};
    Object.keys(orig).forEach(function (key) {
        if (!blacklistedProps || blacklistedProps.indexOf(key) == -1) {
            newProps[key] = orig[key];
        }
    });
    return newProps;
}
function filterComponent(component) {
    if (component === null) {
        return "null";
    }
    if (component === undefined) {
        return "undefined";
    }
    var componentName = component.displayName ? component.displayName : component.name;
    return componentName;
}
function filterComponents(components: RouteComponents) {
    var filteredComponents = {};
    Object.keys(components).forEach(k => {
        var component = components[k];
        filteredComponents[k] = filterComponent(component);
    })
    return filteredComponents;
}
function filterRoute(route:PlainRoute) {
    var filteredRoute = clone(route, ["getComponent","getComponents","onEnter","onChange","onLeave","getChildRoutes","getIndexRoute","indexRoute","childRoutes","component","components"]) as any;
    if (route.component) {
        filteredRoute.component = filterComponent(route.component);
    }
    if (route.components) {
        filteredRoute.components = filterComponents(route.components);
    }
    if (route.indexRoute) {
        filteredRoute.indexRoute = filterIndexRoute(route.indexRoute);
    }
    if (route.childRoutes) {
        filteredRoute.childRoutes = filterRoutes(route.childRoutes);
    }
    return filteredRoute;
}
function filterIndexRoute(indexRoute: PlainRoute) {
    return filterRoute(indexRoute);
}
function filterRoutes(routes: PlainRoute[]) {
    return routes.map((route) => {
        return filterRoute(route);
    })
}
function filterRouterState(routerState: RouterState): object {
    var components: string[];

    var filteredState = {
        location: routerState.location,
        params: routerState.params,

        routes: filterRoutes(routerState.routes)
    } as any;
    if (routerState.components) {
        filteredState.components =routerState.components.map(c => filterComponent(c));
    } else {
        filteredState.components = routerState.components;
    }
    return filteredState;
}
export function rootReducer(state: RootReducerState = { hooksAndMounts:[] }, action): RootReducerState {
    switch (action.type) {
        case HOOK_OR_MOUNT:
            var hookOrMountAction = action as HookOrMountAction;
            var details = hookOrMountAction.details;
            if (hookOrMountAction.hookOrMountType == ENTERHOOK) {
                details = { nextState: filterRouterState(details.nextState as RouterState) };
            } else if (hookOrMountAction.hookOrMountType == LEAVEHOOK) {
                details = { prevState: filterRouterState(details.prevState as RouterState) };
            } else if (hookOrMountAction.hookOrMountType == CHANGEHOOK) {
                details = { prevState: filterRouterState(details.prevState as RouterState), nextState: filterRouterState(details.nextState as RouterState)  };
            }
            return {
                hooksAndMounts: [...state.hooksAndMounts, {
                    type: hookOrMountAction.hookOrMountType,
                    details: details
                }]
            }
        default:
            return state;
    }
}
//#endregion
//#endregion


//#region old redux
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

