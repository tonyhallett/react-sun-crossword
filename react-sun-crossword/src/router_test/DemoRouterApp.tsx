﻿import * as React from "react";
import { Link,  Route, Redirect, LinkProps ,RouterState} from 'react-router'
import { RouteComponentProps, IndexLink, PlainRoute, IndexRoute, RouteComponents } from 'react-router'
import { connect } from 'react-redux'
import { ReactElement } from "react";
import ReactJson from 'react-json-view'
import { LocationDescriptor } from "history";
import { push }  from 'react-router-redux'
import { Action, AnyAction } from "redux";
import * as Modal from 'react-modal';//https://github.com/reactjs/react-modal/issues/497
import { withRelativeLink, RelativeLink } from "./routeProviders";
import { getWrapperComponentName, getWrappedComponentClassName } from "../helpers/reactHelpers";

ReactJson.displayName = "ReactJsonView";

//#region typings
interface ObjectAny {
    [key: string]: any
}
//#region typing for ReactJson

interface ReactJsonProps {
    src: any
}
type ReactJson = React.ComponentClass<ReactJsonProps>

//#endregion
//#endregion
//#region js helpers
function clone(orig, blacklistedProps) {
    var newProps = {};
    Object.keys(orig).forEach(function (key) {
        if (!blacklistedProps || blacklistedProps.indexOf(key) == -1) {
            newProps[key] = orig[key];
        }
    });
    return newProps;
}
//#endregion
//#region v3 route components
//#region link styling
//should create a hoc styled link
var linkActiveStyle: React.CSSProperties = {
    color: "yellow"
}
var linkStyle: React.CSSProperties = {
    margin: "5px"
}
class StyledLink extends React.Component<LinkProps, undefined>{
    render() {
        return <Link style={linkStyle} activeStyle={linkActiveStyle} {...this.props}>{this.props.children}</Link>
    }
}

export class RelativeLinksParent extends React.Component<LinkProps, undefined>{
    render() {
        return <div>
            <RelativeLink relativePath="relative" activeStyle={linkActiveStyle} style={linkStyle}>Relative</RelativeLink>
            <Container>
                {this.props.children}
            </Container>
            </div>
    }
}
export class RelativeLinksChild extends React.Component<LinkProps, undefined>{
    render() {
        return <div>
            <RelativeLink relativePath="relative" activeStyle={linkActiveStyle} style={linkStyle}>Relative</RelativeLink>
            <Container>
                {this.props.children}
            </Container>
        </div>
    }
}
//export const WithRelativeLinksParent = withRelativeLink(wrapMountDispatch(RelativeLinksParent));
//export const WithRelativeLinksChild = withRelativeLink(wrapMountDispatch(RelativeLinksChild));
//export const WithRelativeLinksParent = withRelativeLink(RelativeLinksParent);
//export const WithRelativeLinksChild = withRelativeLink(RelativeLinksChild);

export class RelativeLinkParentMatched extends React.Component<undefined, undefined>{
    render() {
        return <div>Relative link matched from parent</div>
    }
}
export class RelativeLinkChildMatched extends React.Component<undefined, undefined>{
    render() {
        return <div>Relative link matched from child</div>
    }
}
//export const MountDispatchRelativeLinkParentMatched = wrapMountDispatch(RelativeLinkParentMatched);
//export const MountDispatchRelativeLinkChildMatched = wrapMountDispatch(RelativeLinkChildMatched);
//#endregion
//#region actions/reducers/state/selectors

//#region toggle
const TOGGLE_404_ACTIVE = "TOGGLE_404_ACTIVE";
//action creator
function toggle404Active() {
    return {
        type: TOGGLE_404_ACTIVE
    }
}
export function is404Active(state = false, action: Action) {
    if (action.type == TOGGLE_404_ACTIVE) {
        return !state;
    }
    return state;
   
}
function is404ActiveSelector(state: RouterAppState) {
    return state.is404Active
}
//#endregion
//#region errors
const TOGGLE_HANDLE_ROUTE_ERROR = "TOGGLE_HANDLE_ROUTE_ERROR";
const ROUTE_ERROR = "ROUTE_ERROR";
const CLEAR_ROUTE_ERROR = "CLEAR_ROUTE_ERROR";
function toggleHandleRouteError() {
    var action: AnyAction = {
        type: TOGGLE_HANDLE_ROUTE_ERROR,
    }
    return action;
}
export function handleRouteError(state: boolean=false, action: AnyAction) {
    if (action.type === TOGGLE_HANDLE_ROUTE_ERROR) {
        return !state;
    }
    return state;
}
export function routeError(error: Error) {
    var action: AnyAction = {
        type: ROUTE_ERROR,
        error:error
    }
    return action;
}
function clearRouteError() {
    var action: AnyAction = {
        type: CLEAR_ROUTE_ERROR,
       
    }
    return action;
}

export function routeErrorDetails(state: string = "", action: AnyAction) {
    switch (action.type) {
        case ROUTE_ERROR:
            return action.error.message;
        case CLEAR_ROUTE_ERROR:
            return "";
        default:
            return state;
    }
}
function routeErrorSelector(state: RouterAppState) {
    return state.routeErrorDetails;
}
export function handleRouteErrorSelector(state: RouterAppState) {
    return state.handleRouteError;
}
//#endregion
//#region hookOrMount
const HOOK_OR_MOUNT = "HOOK_OR_MOUNT";

//note that this does not agree with flux standard actions
export function hookOrMountActionCreator(type: hookOrMountType, details?: object) {
    return {
        type: HOOK_OR_MOUNT,
        hookOrMountType: type,
        details: details
    }
}

const ENTERHOOK = "EnterHook";
const LEAVEHOOK = "LeaveHook";
const CHANGEHOOK = "ChangeHook"
const ONUPDATE = "OnUpdate";
type hookType = typeof ENTERHOOK | typeof LEAVEHOOK | typeof CHANGEHOOK |typeof ONUPDATE
type hookOrMountType = hookType | "ComponentDidMount" | "ComponentWillUnmount"

interface HookOrMountAction {
    type: string,
    hookOrMountType: hookOrMountType,
    details: ObjectAny
}
interface HookOrMountDetail {
    type: hookOrMountType,
    details?: any
}

function hooksAndMountsSelector(state: RouterAppState) {
    return state.hooksAndMounts
}


function mapComponentName(component) {
    if (component === null) {
        return "null";
    }
    if (component === undefined) {
        return "undefined";
    }
    var componentName = component.displayName ? component.displayName : component.name;
    return componentName;
}
function mapComponents(components: RouteComponents) {
    var filteredComponents = {};
    Object.keys(components).forEach(k => {
        var component = components[k];
        filteredComponents[k] = mapComponentName(component);
    })
    return filteredComponents;
}
function mapRoute(route: PlainRoute) {
    //could have used object destructuring and ...rest
    var mappedRoute = clone(route, ["parentRoute","getComponent", "getComponents", "onEnter", "onChange", "onLeave", "getChildRoutes", "getIndexRoute", "indexRoute", "childRoutes", "component", "components"]) as any;
    if (route.component) {
        mappedRoute.component = mapComponentName(route.component);
    }
    if (route.components) {
        mappedRoute.components = mapComponents(route.components);
    }
    if (route.indexRoute) {
        mappedRoute.indexRoute = mapIndexRoute(route.indexRoute);
    }
    if (route.childRoutes) {
        mappedRoute.childRoutes = mapRoutes(route.childRoutes);
    }
    return mappedRoute;
}
function mapIndexRoute(indexRoute: PlainRoute) {
    return mapRoute(indexRoute);
}
function mapRoutes(routes: PlainRoute[]) {
    return routes.map((route) => {
        return mapRoute(route);
    })
}
function mapRouterState(routerState: RouterState): object {
    
    var mappedState = {
        location: cloneLocation(routerState.location),
        params: routerState.params,

        routes: mapRoutes(routerState.routes)
    } as any;
    if (routerState.components) {
        mappedState.components = routerState.components.map(c => mapComponentName(c));
    } else {
        mappedState.components = routerState.components;
    }
    return mappedState;
}
export function hooksAndMounts(state= [] as HookOrMountDetail[], action): HookOrMountDetail[] {
    switch (action.type) {
        case HOOK_OR_MOUNT:
            var hookOrMountAction = action as HookOrMountAction;
            var details = hookOrMountAction.details;
            if (hookOrMountAction.hookOrMountType == ENTERHOOK) {
                details = { routeId:details.routeId,nextState: mapRouterState(details.nextState as RouterState) };
            } else if (hookOrMountAction.hookOrMountType == LEAVEHOOK) {
                details = { routeId: details.routeId,prevState: mapRouterState(details.prevState as RouterState) };
            } else if (hookOrMountAction.hookOrMountType == CHANGEHOOK) {
                details = { routeId: details.routeId,prevState: mapRouterState(details.prevState as RouterState), nextState: mapRouterState(details.nextState as RouterState) };
            }
            var newHookOrMountDetail: HookOrMountDetail;
            if (details) {
                newHookOrMountDetail = {
                    type: hookOrMountAction.hookOrMountType,
                    details: details
                }
            } else {
                newHookOrMountDetail = {
                    type: hookOrMountAction.hookOrMountType,
                }
            }
            return [...state, newHookOrMountDetail ]
            
        default:
            return state;
    }
}
//#endregion
export interface RouterAppState {
    hooksAndMounts: HookOrMountDetail[]
    router: {
        locationBeforeTransitions: any//should be type Location ?
    }
    is404Active: boolean,
    routeErrorDetails: string,
    handleRouteError:boolean

}

//#endregion
//#region layout components
class Container extends React.Component<undefined, undefined>{
    render() {
        return <div style={{ padding: "10px", borderStyle: "solid", borderColor: "green", borderWidth: "2px" }}>
            {this.props.children}
        </div>
    }
}
//#endregion
//#region App
interface AppProps {
    routeErrorDetails: string,
    clearRouteError:()=>void
}
class App extends React.Component<AppProps, undefined> {
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
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation">Nav/Matching</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/getComponentError">GetComponent/Error</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/relativeLinks">Relative links</Link>
            <Link style={linkStyle} activeStyle={linkActiveStyle} to="/relativeLinks/relativeLinksChild">Relative Links Child</Link>


            <ReactJsonContainer />
            <Modal isOpen={this.props.routeErrorDetails !== ""} onRequestClose={() => { this.props.clearRouteError() }}>
                <div>
                    <div>There has been an error !!!</div>
                    <div>{this.props.routeErrorDetails}</div>
                </div>
            </Modal>
            <Container>
                {this.props.children}
            </Container>
        </div>
    }
}

export const ConnectedApp = connect(
    (state: RouterAppState) => {
        return {
            routeErrorDetails: routeErrorSelector(state)
        }
    },
    (dispatch => {
        return {
            clearRouteError: function () {
                dispatch(clearRouteError())
            }
        }
    }
    )
)(App);

//#endregion
//#region mount dispatch wrapper
interface MountDispatchFunction {
    (isMount: boolean):void;
}
interface WrapperProps {
    mountUnmount: MountDispatchFunction
}

function wrapMountDispatch<P>(Component: React.ComponentClass<P>) {
    
    var wrapper = class MountWrapper extends React.Component<P & WrapperProps, any>{
        static displayName = getWrapperComponentName("MountWrapper", Component);
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
    var componentName = getWrappedComponentClassName(Component);
    var connected= connect(null, (dispatch => {
        var wrapperProps: WrapperProps= {
            mountUnmount: (isMount: boolean) => {
                dispatch(hookOrMountActionCreator(isMount ? "ComponentDidMount" : "ComponentWillUnmount", { componentName: componentName }));
            }
        }
        return wrapperProps;
    }))(wrapper);
    return connected;
}
//#endregion
//#region connected ReactJson
interface ReactJsonMapStateProps {
    src?: any
}
const ReactJsonContainer = connect((state: RouterAppState) => {
    return {
        src: {
            hookAndMounts: hooksAndMountsSelector(state)
        }
    } as ReactJsonMapStateProps
})(ReactJson);
//#endregion
//#region Introduction
export class Introduction extends React.Component<undefined, undefined> {
    render() {
        return <div>This is the introduction - the index route</div>
    }
}

//export const MountDispatchIntroduction = wrapMountDispatch(Introduction);
//#endregion
//#region Pathless
export class Pathless extends React.Component<undefined, undefined> {
    render() {
        return <div>
            <div>This component can have a child whose path is not a subpath</div>
            <Container>
                {this.props.children}
             </Container>
        </div>
    }
}

//export const MountDispatchPathless = wrapMountDispatch(Pathless);
export class PathlessIndex extends React.Component<undefined, undefined> {
    render() {
        return "This is the index route component";
    }
}
//export const MountDispatchPathlessIndex = wrapMountDispatch(PathlessIndex);
export class PathlessChild extends React.Component<undefined, undefined> {
    render() {
        return "This component has been rendered without its route being a subpath";
    }
}
//export const MountDispatchPathlessChild = wrapMountDispatch(PathlessChild);
//#endregion
//#region multiple
export class Multiple extends React.Component<RouteComponentProps<undefined,undefined>, undefined> {
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
//export const MountDispatchMultiple = wrapMountDispatch(Multiple);
export class MultipleChild1 extends React.Component<undefined, undefined> {
    render() {
        return "Child1 from Route components property";
    }
}
//export const MountDispatchMultipleChild1 = wrapMountDispatch(MultipleChild1);
export class MultipleChild2 extends React.Component<undefined, undefined> {
    render() {
        return "Child2 from Route components property";
    }
}
//export const MountDispatchMultipleChild2 = wrapMountDispatch(MultipleChild2);
//#endregion
//#region additional props
export class AdditionalProps extends React.Component<RouteComponentProps<undefined, undefined>, undefined> {
    render() {
        var additionalProp = (this.props.route as any).additionalProp.additional;
        return <div>{"Received additional prop from route " + additionalProp}</div>
    }
}
//export const MountDispatchAdditionalProps = wrapMountDispatch(AdditionalProps);
//#endregion
//#region leave hook
interface LeaveHookState {
    canLeave:boolean
}
export class LeaveHookComponent extends React.Component<RouteComponentProps<undefined, undefined>, LeaveHookState> {
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
//export const MountDispatchLeaveHook = wrapMountDispatch(LeaveHook);
//#endregion

//#region props from parent
interface PropsFromParentParentState {
    someState:string
}
export class PropsFromParentParent extends React.Component<undefined, PropsFromParentParentState>{
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
//export const MountDispatchPropsFromParentParent = wrapMountDispatch(PropsFromParentParent);
export class PropsFromParentChild extends React.Component<PropsFromParentParentState & RouteComponentProps<undefined, undefined>, undefined>{
    render() {
        return <div>
            <div>{"this prop has come from parent:" + this.props.someState}</div>
            <div>{"this prop ( location.pathname ) has come from the router: " + this.props.location.pathname}</div>

        </div>
    }
}





//export const MountDispatchPropsFromParentChild = wrapMountDispatch(PropsFromParentChild);
//#endregion
//#region navigation
interface NavigationDispatchProps {
    navThroughDispatch: (location: LocationDescriptor) => void
    toggle404Active:()=>void
}
interface NavigationStateToProps {
    is404Active:boolean
}
interface NavigationCompProps extends NavigationDispatchProps, NavigationStateToProps {

}
interface NavigationCompState {
    someState:number
}
class Navigation extends React.Component<NavigationCompProps, NavigationCompState>{
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
            <div>
                <div>Matching</div>
                <br />
                <div>
                    <div>Params</div>
                    <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/params/someParamValue1/greedySplat1MatchPart">Params 1</Link>
                    <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/params/someParamValue2/greedySplat2MatchPart">Params 2</Link>
                </div>
                <div>
                    <div>Optional</div>
                    <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/optionalPartNotOptional">Optional 1</Link>
                    <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/NotOptional">Optional 2</Link>
                </div>
            </div>
            <br />
            <div>--------------------------</div>
            <br />
            <div>
                <div>No match</div>
                <br />
                <br/>
                <Link style={linkStyle} activeStyle={linkActiveStyle} to="/navigation/noMatchingChildRoute">No matching child route</Link>
                <Link style={linkStyle} activeStyle={linkActiveStyle} to="/noMatchingRoute">No matching route</Link>
                <br />
                <button onClick={this.props.toggle404Active}>{this.props.is404Active ? "Deactivate 404" : "Activate 404"}</button>
            </div>
            <br />
            <div>--------------------------</div>
            <br />
            <div>
                <div>Query/Search & State</div>
                <br />
                <Link style={linkStyle} activeStyle={linkActiveStyle} to={{ pathname:"/navigation/querySearchState", search: "?someSearch", state: { someState: this.state.someState } }} >Search + State</Link>
                <Link style={linkStyle} activeStyle={linkActiveStyle} to={{ pathname: "/navigation/querySearchState", query: {someQuery1: "someQuery1Value",someQuery2:"someQuery2Value"},  state: { someState: this.state.someState } }} >Query + State</Link>
                <button onClick={this.incrementLinkState}>Increment link state</button>
            </div>

            <br />
            <div>--------------------------</div>
            <br />

            <button onClick={this.doPush}>Test push ( leave hook )</button>
            <br />
            <div>--------------------------</div>
            <br />

            <Container>
                {this.props.children}
            </Container>
        </div>
    }
}

//export const MountDispatchNavigation = wrapMountDispatch(connect(
//    (routerAppState: RouterAppState) => {
//        var stateToProps:NavigationStateToProps= {
//            is404Active: is404ActiveSelector(routerAppState)
//        }
//        return stateToProps;
//    },
//    (dispatch) => {
//        var mappedDispatch: NavigationDispatchProps = {
//            navThroughDispatch: function (location: LocationDescriptor) {
//                dispatch(push(location));
//            },
//            toggle404Active: function () {
//                dispatch(toggle404Active());
//            }
//        }
//        return mappedDispatch;
//})(Navigation));
export const ConnectedNavigation = connect(
    (routerAppState: RouterAppState) => {
        var stateToProps: NavigationStateToProps = {
            is404Active: is404ActiveSelector(routerAppState)
        }
        return stateToProps;
    },
    (dispatch) => {
        var mappedDispatch: NavigationDispatchProps = {
            navThroughDispatch: function (location: LocationDescriptor) {
                dispatch(push(location));
            },
            toggle404Active: function () {
                dispatch(toggle404Active());
            }
        }
        return mappedDispatch;
    })(Navigation);

function cloneLocation(location) {
    
    var clonedLocation = clone(location, []) as any;
    clonedLocation.query = clone(location.query, [])
    return clonedLocation;
}
function createNavigationComponent<P>(Component: React.ComponentClass<P>) {
    //var MountDispatchComponent = wrapMountDispatch(Component);
    var wrapper = class ReactJsonRoutePropsWrapper extends React.Component<P & RouteComponentProps<any, any>, undefined>{
        //static displayName = getWrapperComponentName("ReactJsonRoutePropsWrapper", MountDispatchComponent);
        static displayName = getWrapperComponentName("ReactJsonRoutePropsWrapper", Component);
        render() {
            var location = cloneLocation(this.props.location);
            //<MountDispatchComponent {...this.props} />
            return <div>
                <Component {...this.props} />

                <ReactJson src={{ location:location, params: this.props.params,routeParams:this.props.routeParams }} />
            </div>
        }
    }
    
    return wrapper;
}
export class PageNotFound extends React.Component<undefined, undefined>{
    render() {
        return <div>
            Page Not Found
        </div>
    }
}

class ParamParent extends React.Component<undefined, undefined>{
    render() {
        return <div>
            <div>ParamParent</div>
            <Container>
                {this.props.children}
            </Container>
            </div>
    }
}
class ParamChild extends React.Component<undefined, undefined>{
    render() {
        return <div>
            <div>ParamChild</div>
        </div>
    }
}
class Optional extends React.Component<undefined, undefined>{
    render() {
        return <div>Optional</div>
    }
}
class QuerySearchState extends React.Component<undefined, undefined>{
    render() {
        return <div>Query Search State</div>
    }
}
interface GetComponentErrorProps {
    toggleHandleRouterError: () => void,
    handleRouterError:boolean
}
class GetComponentError extends React.Component<GetComponentErrorProps, undefined>{
    render() {
        return <div>
            <div>The link below is to a route that provides the component using the getComponent method.</div>
            <div>To demonstrate that the component is provided lazily use the two links below which provide state that getComponent uses to determine the component</div>
            
            <StyledLink to={{ pathname: "/getComponentError/getComponent", state: { isComponent1: true } }}>Choose component 1</StyledLink>
            <Link style={linkStyle} activeStyle={linkActiveStyle}  to={{ pathname: "/getComponentError/getComponent", state: { isComponent1: false } }}>Choose component 2</Link>
            <br/>
            <div>The Router also allow for handling of errors - such as those thrown by getComponent</div>
            <div>The link below is matched by a route that will throw from getComponent</div>
            <Link to="/getComponentError/error">Throw</Link>
            <div>Use the button below to toggle adding a handler</div>
            <button onClick={() => { this.props.toggleHandleRouterError() }}>{this.props.handleRouterError?"Remove handler":"Add handler"}</button>
            <Container>
                {this.props.children}
            </Container>
            
        </div>
    }
}
export const ConnectedGetComponentError = connect((state: RouterAppState) => {
    return {
        handleRouterError: handleRouteErrorSelector(state)
    }
}, (dispatch) => {
    return {
        toggleHandleRouterError: function () {
            dispatch(toggleHandleRouteError());
        }
    }
})(GetComponentError);
export class GetComponentComp1 extends React.Component<undefined, undefined>{
    render() {
        return <div>Component 1</div>
    }
}
export class GetComponentComp2 extends React.Component<undefined, undefined>{
    render() {
        return <div>Component 2</div>
    }
}

export const ReactJsonRoutePropsParamParent = createNavigationComponent(ParamParent);
export const ReactJsonRoutePropsParamChild = createNavigationComponent(ParamChild);
export const ReactJsonRoutePropsOptional = createNavigationComponent(Optional);
export const ReactJsonRoutePropsQuerySearchState = createNavigationComponent(QuerySearchState);

//endregion


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

