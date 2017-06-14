import * as React from "react";
import { connectedDatabase } from "../helpers/connectedDatabase"
import { CrosswordLookupJson } from "../models/index";

export interface CrosswordPuzzleChooserProps {
    disconnectedMessage?: string,
    DatabaseDisconnectedMessageComponent?: React.ComponentClass<DatabaseDisconnectedMessageProps>,
    databaseDisconnectedMessageComponentProps?: any
    SelectChooser?: React.ComponentClass<SelectChooserProps>
    selectChooserProps?: any,
    publicSelectChooserHeader?:string
    userSelectChooserHeader?: string
    userLoggedIn:string
}
interface CrosswordPuzzleChooserState {
    databaseDisconnected: boolean,
    publicLookupsLoading: boolean,
    userLookupsLoading:boolean
}
//need real ones !
class DefaultDatabaseDisconnectedMessageComponent extends React.Component<DatabaseDisconnectedMessageProps, {}>{
    render() {
        return <div>{this.props.disconnectedMessage}</div>
    }
}
class DefaultSelectChooser extends React.Component<SelectChooserProps, {}>{
    render() {
        return <div></div>
    }
}

export class CrosswordPuzzleChooser extends React.Component<CrosswordPuzzleChooserProps, CrosswordPuzzleChooserState> {
    public static defaultProps: Partial<CrosswordPuzzleChooserProps> = {
        disconnectedMessage: "Disconnected",
        DatabaseDisconnectedMessageComponent: DefaultDatabaseDisconnectedMessageComponent,
        SelectChooser: DefaultSelectChooser,
        publicSelectChooserHeader: "Public crosswords:",
        userSelectChooserHeader:"User crosswords:"
    };
    constructor(props) {
        super(props);
        this.state = {
            databaseDisconnected: true, publicLookupsLoading: false, userLookupsLoading:false
        }

    }
    componentWillReceiveProps(nextProps: CrosswordPuzzleChooserProps) {
        if (nextProps.userLoggedIn !== this.props.userLoggedIn) {
            this.addRemoveListeners(nextProps.userLoggedIn);
        }
    }
    //should do in ctor ?
    componentDidMount() {
        connectedDatabase.connectionChanged(this.connectionChanged.bind(this));
    }
    
    private listeningForPublic:boolean= false
    private listeningForUser:boolean=false
    //given that public will have new pushed to it - do I need two events
    private publicLookups: CrosswordLookupJson[];
    private userLookups: CrosswordLookupJson[];
    publicLookupsChanged(lookups: CrosswordLookupJson[]) {
        this.setState({ publicLookupsLoading: false })
    }
    userLookupsChanged(lookups:CrosswordLookupJson[]) {
        this.setState({ userLookupsLoading: false })
    }
    addRemoveListeners(userLoggedIn:string) {
        //might have asynchronous issues with state.....
        if (!this.state.databaseDisconnected) {
            if (!this.listeningForPublic) {
                connectedDatabase.listenForPublicCrosswordLookups(this.publicLookupsChanged.bind(this));
                this.listeningForPublic = true;
                this.setState({ publicLookupsLoading: true });
            }
            
            if (userLoggedIn && !this.listeningForUser) {
                connectedDatabase.listenForUserCrosswordLookups(userLoggedIn, this.userLookupsChanged.bind(this));
                this.listeningForUser = true;
                this.setState({ userLookupsLoading: true });
            }
        }
    }
    connectionChanged(isConnected: boolean) {
        this.setState({ databaseDisconnected: !isConnected})
        this.addRemoveListeners(this.props.userLoggedIn);
    }
    render() {
        var SelectChooser = displayNameHOC( this.props.SelectChooser,"SelectChooser");//!important to do this for intellisense even without the displayNameHOC

        return <div>
            <this.props.DatabaseDisconnectedMessageComponent {...this.props.databaseDisconnectedMessageComponentProps} disconnectedMessage={this.state.databaseDisconnected ? this.props.disconnectedMessage : ""} />
            <SelectChooser isLoadingLookups={this.state.publicLookupsLoading} isPublic={true} header={this.props.publicSelectChooserHeader} disabled={this.state.databaseDisconnected} {...this.props.selectChooserProps} />
            <SelectChooser isLoadingLookups={this.state.userLookupsLoading} isPublic={false} header={this.props.userSelectChooserHeader} disabled={this.state.databaseDisconnected} {...this.props.selectChooserProps} />
        </div>
    }
}

function displayNameHOC<P>(Component: React.ComponentClass<P>, displayName: string): React.ComponentClass<P> {
    
    class DisplayNameComponent extends React.Component<P, any>{
            
            render() {
                return <Component {...this.props}/>
            }
    }
    var cc = DisplayNameComponent as React.ComponentClass<P>;
    cc.displayName = displayName;
    return cc;
}

export interface DatabaseDisconnectedMessageProps {
    disconnectedMessage:string
}
export interface SelectChooserProps {
    disabled: boolean,
    header: string,
    isPublic: boolean,
    isLoadingLookups:boolean
}
