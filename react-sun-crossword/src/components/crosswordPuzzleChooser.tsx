import * as React from "react";
import { connectedDatabase } from "../helpers/connectedDatabase"
import { CrosswordLookupJson, CrosswordModelJson } from "../models/index";
import { EmailLogOnComp, EmailLogOnCompProps} from "./emailLogOn";
import { auth } from '../helpers/firebaseApp'
import Select = require("react-select")

//export import Select = require("react-select")
import { SimpleButtonProps } from "./simpleButtonProps";
import { MuiButtonWrapper } from "./muiWrappedButton";


function displayNameHOC<P>(Component: React.ComponentClass<P>, displayName: string): React.ComponentClass<P> {

    class DisplayNameComponent extends React.Component<P, any>{

        render() {
            return <Component {...this.props} />
        }
    }
    var cc = DisplayNameComponent as React.ComponentClass<P>;
    cc.displayName = displayName;
    return cc;
}

class DefaultDatabaseDisconnectedMessageComponent extends React.Component<DatabaseDisconnectedMessageProps, {}>{
    render() {
        return <div>{this.props.disconnectedMessage}</div>
    }
}
export interface DefaultSelectChooserButtonProps {
    ButtonType?: React.ComponentClass<SimpleButtonProps>
    buttonProps?: any
}
export interface DefaultSelectChooserProps extends SelectChooserProps, DefaultSelectChooserButtonProps {
    
}
interface DefaultSelectChooserState {
    selectedValue:string
}
export class DefaultSelectChooser extends React.Component<DefaultSelectChooserProps, DefaultSelectChooserState>{
    
    public static defaultProps: Partial<DefaultSelectChooserProps> = {
        ButtonType: MuiButtonWrapper
       
    };
    constructor(props) {
        super(props);
        this.state = { selectedValue: null };
    }
    buttonClicked = () => {
        this.props.lookupSelected(this.state.selectedValue);
    }
    optionChange = (option: Select.Option) => {
        var selectedValue: string;
        if (option) {
            selectedValue = option.value as string;
        }
        this.setState({ selectedValue: selectedValue})
    }
    mapOptions = (): Select.Option[] => {
        var options = [];
        if (this.props.crosswordLookups) {
            options= this.props.crosswordLookups.map(function (crosswordLookup) {
                var mappedOption: Select.Option = {
                    label: crosswordLookup.title,
                    value: crosswordLookup.id
                }
                return mappedOption
            })
        }
        return options;
    }
    render() {
        var Button = displayNameHOC(this.props.ButtonType, "Button");
        return <div>
            <Select.Creatable value={this.state.selectedValue} onChange={this.optionChange} disabled={this.props.disabled} isLoading={this.props.isLoadingLookups} placeholder={this.props.placeholderText} options={this.mapOptions()} />
            <div style={{paddingTop:"10px"}}>
                <Button {...this.props.buttonProps} text="Play Crossword" onClick={this.buttonClicked} disabled={this.props.disabled || !this.state.selectedValue} />
            </div>
            </div>
    }
}
class DefaultSelectChooserContainer extends React.Component<SelectChooserContainerProps, {}>{
    render() {
        var content;
        if (this.props.isPublic) {
            content = this.props.children;
        } else {
            content=<div>{this.props.children[1]}{this.props.children[0]}</div>

        }

        return <fieldset style={{ borderRadius: "5px", borderColor: "#2F4F4F" }}>
            <legend>{this.props.header}</legend>
            {content}
            </fieldset>
    }
}


export interface CrosswordPuzzleChooserProps {
    disconnectedMessage?: string,
    DatabaseDisconnectedMessageComponent?: React.ComponentClass<DatabaseDisconnectedMessageProps>,
    databaseDisconnectedMessageComponentProps?: any,
    emailLogOnStyleProps?: any,
    emailSignInWording?: string,
    emailSignOutWording?: string
    SelectChooser?: React.ComponentClass<SelectChooserProps>
    selectChooserProps?: any,
    SelectChooserContainer?: React.ComponentClass<SelectChooserContainerProps>
    selectChooserContainerProps?: any,
    publicSelectChooserHeader?: string
    userSelectChooserHeader?: string
    userLoggedIn: string,
    crosswordSelected: (crosswordModelJson: CrosswordModelJson) => void,
    placeholderSelectWording?: string,
    userPlaceholderSignedOutWording?: string,
}
interface CrosswordPuzzleChooserState {
    databaseDisconnected: boolean,
    publicLookupsLoading: boolean,
    userLookupsLoading: boolean,
    publicCrosswordLookups: CrosswordLookupJson[],
    userCrosswordLookups: CrosswordLookupJson[]
}

export class CrosswordPuzzleChooser extends React.Component<CrosswordPuzzleChooserProps, CrosswordPuzzleChooserState> {
    public static defaultProps: Partial<CrosswordPuzzleChooserProps> = {
        disconnectedMessage: "Disconnected",
        DatabaseDisconnectedMessageComponent: DefaultDatabaseDisconnectedMessageComponent,
        SelectChooser: DefaultSelectChooser,
        SelectChooserContainer: DefaultSelectChooserContainer,
        publicSelectChooserHeader: "Public crosswords:",
        userSelectChooserHeader: "User crosswords:",
        placeholderSelectWording:"Select",
        userPlaceholderSignedOutWording: "to access saved crosswords",
        emailSignInWording: "Sign in",
        emailSignOutWording:"Sign out"
        
    };
    constructor(props) {
        super(props);
        this.state = {
            databaseDisconnected: true, publicLookupsLoading: false, userLookupsLoading: false, publicCrosswordLookups: null, userCrosswordLookups:null
        }
    }
    componentWillReceiveProps(nextProps: CrosswordPuzzleChooserProps) {
        if (nextProps.userLoggedIn !== this.props.userLoggedIn) {
            this.addDatabaseListeners(nextProps.userLoggedIn);
        }
    }
    //should do in ctor ?
    componentDidMount() {
        connectedDatabase.connectionChanged(this.connectionChanged.bind(this));
    }
    
    private listeningForPublic:boolean
    private listeningForUser:boolean
    //given that public will have new pushed to it - do I need two events
    private publicLookups: CrosswordLookupJson[]=null
    private userLookups: CrosswordLookupJson[]=null
    manageLookups(lookups: CrosswordLookupJson[], isPublic: boolean) {
        var lookupsLoadingsFalseProperty = "publicLookupsLoading";
        if (isPublic) {
            this.publicLookups = lookups;
        } else {
            this.userLookups = lookups;
            lookupsLoadingsFalseProperty ="userLookupsLoading"
        }
        var filteredPublicLookups: CrosswordLookupJson[] = []
        if (this.publicLookups) {
            for (var i = 0; i < this.publicLookups.length; i++) {
                var inUserCrosswords = false;
                var publicLookup = this.publicLookups[i];
                if (this.userLookups !== null) {
                    for (var j = 0; j < this.userLookups.length; j++) {
                        var userLookup = this.userLookups[j];
                        if (publicLookup.id === userLookup.id) {
                            inUserCrosswords = true;
                            break;
                        }
                    }
                }
                if (!inUserCrosswords) {
                    filteredPublicLookups.push(publicLookup);
                }
            }
        }


        var newState = {
            publicCrosswordLookups: filteredPublicLookups,
            userCrosswordLookups: this.userLookups
        }
        newState[lookupsLoadingsFalseProperty] = false;
        this.setState(newState);
    }
    publicLookupsChanged(lookups: CrosswordLookupJson[]) {
        this.manageLookups(lookups, true);
    }
    userLookupsChanged(lookups: CrosswordLookupJson[]) {
        this.manageLookups(lookups, false);
    }
    publicLookupSelected=(id: string)=> {
        var self = this;
        connectedDatabase.getPublicCrossword(id).then(function (crosswordModelJson) {
            self.props.crosswordSelected(crosswordModelJson);
        })
    }
    userLookupSelected=(id: string)=> {
        var self = this;
        connectedDatabase.getUserCrossword(this.props.userLoggedIn, id).then(function (crosswordModelJson) {
            self.props.crosswordSelected(crosswordModelJson);
        });
    }
    addDatabaseListeners(userLoggedIn:string) {
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
        this.addDatabaseListeners(this.props.userLoggedIn);
    }
    render() {
        var SelectChooser = displayNameHOC( this.props.SelectChooser,"SelectChooser");//!important to do this for intellisense even without the displayNameHOC
        var SelectChooserContainer = displayNameHOC(this.props.SelectChooserContainer, "SelectChooserContainer");

        return <div>
            <this.props.DatabaseDisconnectedMessageComponent {...this.props.databaseDisconnectedMessageComponentProps} disconnectedMessage={this.state.databaseDisconnected ? this.props.disconnectedMessage : "\u200B"} />
            <SelectChooserContainer isPublic={true} header={this.props.publicSelectChooserHeader}>
                <SelectChooser  placeholderText={this.props.placeholderSelectWording + " public crosswords: " }  lookupSelected={this.publicLookupSelected} crosswordLookups={this.state.publicCrosswordLookups} isLoadingLookups={this.state.publicLookupsLoading} isPublic={true} disabled={this.state.databaseDisconnected} {...this.props.selectChooserProps} />
            </SelectChooserContainer>
            <SelectChooserContainer isPublic={false} header={this.props.userSelectChooserHeader}>
                <SelectChooser placeholderText={(this.props.placeholderSelectWording + " saved crosswords: ") + (this.props.userLoggedIn ? "" : this.props.emailSignInWording + " " + this.props.userPlaceholderSignedOutWording)} lookupSelected={this.userLookupSelected} crosswordLookups={this.state.userCrosswordLookups} isLoadingLookups={this.state.userLookupsLoading} isPublic={false} disabled={this.state.databaseDisconnected || (this.props.userLoggedIn === null)} {...this.props.selectChooserProps} />
                <EmailLogOnComp signInTitle={this.props.emailSignInWording} signOutTitle={this.props.emailSignOutWording} auth={auth}  {...this.props.emailLogOnStyleProps}  ></EmailLogOnComp>
            </SelectChooserContainer>
        </div>
    }
}



export interface DatabaseDisconnectedMessageProps {
    disconnectedMessage:string
}
export interface SelectChooserProps {
    disabled: boolean,
    isPublic: boolean,
    isLoadingLookups: boolean,
    crosswordLookups: CrosswordLookupJson[],
    lookupSelected: (id: string) => void,
    placeholderText: string
}

export interface SelectChooserContainerProps {
    header: string,
    isPublic: boolean

}
