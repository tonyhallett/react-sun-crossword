
import * as React from "react";
import { CrosswordModel, ConvertCrosswordJsonToModel, ConvertCrosswordModelToJson, CrosswordModelJson, SolvingMode } from '../models/index'
import { CrosswordPuzzleKeyEvents } from "./crosswordPuzzle";
import { Promise } from "es6-promise";
import Select = require("react-select")
import { TwoCol } from "./twoCol";
import { CrosswordPuzzleChooseDetail, CrosswordPuzzleJsonStore, CrosswordPuzzleDataStore} from "../helpers/stores";
import { crosswordPuzzleDataStore } from "../helpers/crosswordPuzzleDataStore"
import { crosswordPuzzleJsonStore } from "../helpers/crosswordPuzzleJsonStore"
import { EmailLogOn, EmailLogOnComp, ButtonProps } from "./emailLogOn";
import { auth } from '../helpers/firebaseApp'
import Button = require('muicss/lib/react/button');
import { database } from "../helpers/firebaseApp";
import 'firebase/database';

interface MuiButtonProps extends ButtonProps{
    color:string
}
class MuiButton extends React.Component<MuiButtonProps, null>{
    constructor(props) {
        super(props);
    }
    muiMouseDown = () => {
        this.props.onClick();
    }
    render() {
        return <Button disabled={this.props.disabled} color={this.props.color} onMouseDown={this.muiMouseDown} >{this.props.text}</Button>
    }
}

interface CrosswordPuzzleAppState {
    crosswordModel: CrosswordModel,
    userLoggedIn: string,
    //chooseDetailsJson: CrosswordPuzzleChooseDetail[]
    //chooseDetailsStore: CrosswordPuzzleChooseDetail[]
    //jsonSelectedCrossword: CrosswordPuzzleChooseDetail,
    //storeSelectedCrossword: CrosswordPuzzleChooseDetail,
    //jsonCrosswordsLoading: boolean,
    //storeCrosswordsLoading: boolean,
    //firebaseConnected:boolean
}
export class CrosswordPuzzleApp extends React.Component<undefined, CrosswordPuzzleAppState> {
    //these are not going to change so no need for being props
    crosswordPuzzleJsonStore: CrosswordPuzzleJsonStore
    crosswordPuzzleDataStore: CrosswordPuzzleDataStore
    currentCrosswordInStore=false
    constructor(props) {
        super(props);
        this.crosswordPuzzleJsonStore = crosswordPuzzleJsonStore;
        this.crosswordPuzzleDataStore = crosswordPuzzleDataStore;
        this.state = { crosswordModel: null, userLoggedIn: null};
        
    }
    componentDidMount() {
        auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
        //this.setChoices();
    }
    /*
    filterDetails(storeDetails: CrosswordPuzzleChooseDetail[], jsonDetails: CrosswordPuzzleChooseDetail[]) {
        return jsonDetails.filter(function (jsDetail) {
            var match = true;
            for (var j = 0; j < storeDetails.length; j++) {
                if (storeDetails[j].id === jsDetail.id) {
                    match = false;
                    break;
                }
            }
            return match;
        });

    }
    setChoices(jsonSelectedCrossword: CrosswordPuzzleChooseDetail=null, storeSelectedCrossword: CrosswordPuzzleChooseDetail=null) {
        var self = this;
        if (this.state.userLoggedIn) {
            this.setState({ jsonCrosswordsLoading: true,storeCrosswordsLoading:true });
            Promise.all([crosswordPuzzleJsonStore.getDetailsAsync(), crosswordPuzzleDataStore.getDetailsAsync()]).then(function (combinedDetails) {

                var publicDetails = combinedDetails[0];
                var userDetails = combinedDetails[1];
                var publicOnlyDetails = self.filterDetails(userDetails, publicDetails);
                self.setState({ chooseDetailsJson: publicOnlyDetails, chooseDetailsStore: userDetails, jsonSelectedCrossword: jsonSelectedCrossword, storeSelectedCrossword: storeSelectedCrossword });
            }).catch(function (err) {
                //to do - a ui for this
                console.log("Error getting public and saved crosswords: " + err.message);
                window.setTimeout(function () {
                    //clear the error message then
                    console.log("trying again for public and saved");
                    self.setChoices();
                }, 1000);
            }).then(function () {
                self.setState({ jsonCrosswordsLoading: false, storeCrosswordsLoading: false });
            });

        } else {
            this.setState({ jsonCrosswordsLoading: true });
           
            crosswordPuzzleJsonStore.getDetailsAsync().then(function (details) {
                console.log("Have received the public details");
                self.setState({ chooseDetailsJson: details, chooseDetailsStore: null, jsonSelectedCrossword: jsonSelectedCrossword, storeSelectedCrossword: storeSelectedCrossword });
            }).catch(function (err) {
                //to do 
                console.log("Error getting public crosswords: " + err.message); 
                //conditionally on the error message - 
                window.setTimeout(function () {
                    //clear the error message then
                    console.log("trying again for public");
                    self.setChoices();
                }, 1000);
            }).then(function () {
                self.setState({ jsonCrosswordsLoading: false });
            });
        }
    }
    jsonCrosswordSelected = (crossword: CrosswordPuzzleChooseDetail) => {
        this.setState({ jsonSelectedCrossword: crossword })
    }
    storeCrosswordSelected = (crossword: CrosswordPuzzleChooseDetail) => {
        this.setState({ storeSelectedCrossword:crossword})
    }
    jsonCrosswordChosen = () => {
        this.crosswordChosen(this.state.jsonSelectedCrossword);
    }
    storeCrosswordChosen= () => {
        this.crosswordChosen(this.state.storeSelectedCrossword);
    }
    //this will only be visible if signed in
    saveUserCrossword = () => {
        //will be done by the store
        console.log("trying to save crossword for : " + auth.currentUser.displayName);
        var modelJson = ConvertCrosswordModelToJson(this.state.crosswordModel);

        var rerender = !this.currentCrosswordInStore;
        var self = this;
        this.crosswordPuzzleDataStore.saveCrosswordAsync(modelJson).then(function () {
            self.currentCrosswordInStore = true;
            if (rerender) {
                console.log("re-rendering")
                self.setChoices(null, self.state.jsonSelectedCrossword);
            }
        }).catch(function () {
            //to do
            console.log("!!!! error saving crossword to store")
        });

    }
    crosswordChosen = (crosswordDetail: CrosswordPuzzleChooseDetail) => {
        var self = this;
        crosswordDetail.getAsync().then(function (chosenCrossword) {
            //do saving here - if necessary - will then need dirty management
            var crosswordModel = ConvertCrosswordJsonToModel(chosenCrossword);
            self.currentCrosswordInStore = crosswordDetail.inStore;
            console.log("current crossword in store: " + self.currentCrosswordInStore);
            var jsonSelectedCrossword: CrosswordPuzzleChooseDetail = null;
            var storeSelectedCrossword: CrosswordPuzzleChooseDetail = null;
            if (self.currentCrosswordInStore) {
                storeSelectedCrossword = crosswordDetail;
            } else {
                jsonSelectedCrossword = crosswordDetail
            }
            self.setState({ crosswordModel: crosswordModel, jsonSelectedCrossword: jsonSelectedCrossword,storeSelectedCrossword:storeSelectedCrossword });
        });

    }
    */
    onAuthStateChanged(user: firebase.User) {
        var loggedIn = user !== null;
        this.setState({ userLoggedIn: user.uid })
        //this.setChoices();
    }
    //going to have to deal with saving of old one here

    
    
    render() {
        //<button disabled={!this.state.userLoggedIn} onClick={this.saveUserCrossword}>Click to save</button>
        //<CrosswordPuzzleChooser storeCrosswordsLoading={this.state.storeCrosswordsLoading} jsonCrosswordsLoading={this.state.jsonCrosswordsLoading} userLoggedIn={this.state.userLoggedIn} jsonCrosswordSelected={this.jsonCrosswordSelected} storeCrosswordSelected={this.storeCrosswordSelected} storeCrosswordChosen={this.storeCrosswordChosen} jsonCrosswordChosen={this.jsonCrosswordChosen} jsonSelectedCrossword={this.state.jsonSelectedCrossword} storeSelectedCrossword={this.state.storeSelectedCrossword} chooseDetailsJson={this.state.chooseDetailsJson} chooseDetailsStore={this.state.chooseDetailsStore} />
        var leftContent = <div>
            
            </div>
        var rightContent = <CrosswordPuzzleKeyEvents crosswordModel={this.state.crosswordModel} />
        if (this.state.crosswordModel === null) {
            rightContent=<div/>
        }
        return <TwoCol leftContent={leftContent} rightContent={rightContent}>
            
        </TwoCol>
        
    }
    
}

interface CrosswordPuzzleChooserOldProps {
    chooseDetailsJson: CrosswordPuzzleChooseDetail[]
    chooseDetailsStore: CrosswordPuzzleChooseDetail[]
    jsonSelectedCrossword: CrosswordPuzzleChooseDetail,
    storeSelectedCrossword: CrosswordPuzzleChooseDetail,
    jsonCrosswordSelected: (crossword: CrosswordPuzzleChooseDetail) => void
    storeCrosswordSelected: (crossword: CrosswordPuzzleChooseDetail) => void
    jsonCrosswordChosen: () => void
    storeCrosswordChosen: () => void
    jsonCrosswordsLoading: boolean
    storeCrosswordsLoading:boolean
    userLoggedIn:boolean
}
interface CrosswordPuzzleChooserOldState {
    savedSelectFocused: boolean,
    publicSelectFocused:boolean
}
export class CrosswordPuzzleChooserOld extends React.Component<CrosswordPuzzleChooserOldProps, CrosswordPuzzleChooserOldState>{
    constructor(props) {
        super(props);
        this.state = { publicSelectFocused: false, savedSelectFocused:false }
    }
    
    mapToOptions(chooseDetails: CrosswordPuzzleChooseDetail[]) {
        if (chooseDetails) {
            return chooseDetails.map(function (chooseDetail) {
                return { label: chooseDetail.title, value: chooseDetail.id, _chooseDetail: chooseDetail }
            });
        } else {
            return [];
        }
        
    }
    optionToDetail(option: any): CrosswordPuzzleChooseDetail {
        var selectedDetail: CrosswordPuzzleChooseDetail
        if (option) {
            selectedDetail = option._chooseDetail as CrosswordPuzzleChooseDetail;
        } else {
            selectedDetail = null;
        }
        return selectedDetail
    }
    jsonOptionChange = (option:any)=>{
        this.props.jsonCrosswordSelected(this.optionToDetail(option));
    }
    storeOptionChange = (option:any) => {
        this.props.storeCrosswordSelected(this.optionToDetail(option));
    }
    savedOnFocus = ()=>{
        this.setState({ savedSelectFocused: true })
    }
    savedOnBlur = ()=>{
        this.setState({ savedSelectFocused:false})
    }
    publicOnFocus = ()=>{
        this.setState({ publicSelectFocused: true })
    }
    publicOnBlur = ()=>{
        this.setState({ publicSelectFocused: false })
    }
    render() {
        var jsonOptions = this.mapToOptions(this.props.chooseDetailsJson);
        var storeOptions = this.mapToOptions(this.props.chooseDetailsStore);
        var displayWhenLoggedOut = this.props.userLoggedIn ? "none" : "block";
        var displayWhenLoggedIn = this.props.userLoggedIn ? "block" : "none";

        var borderColor = "grey";
        var unfocusedBorderColor = borderColor;
        var focusedBorderColor = "blue";
        var fieldsetBorder = "1px " + borderColor + " solid";
        var placeholderTextColour = "rgb(51,51,51)";
        var placeholderDisabledTextColour = "grey"
        
        var signInTitle = "Sign in";
        var savedSelectPlaceholderText = this.props.userLoggedIn ? "Select saved crosswords:" : signInTitle + " to access saved crosswords:" ;
        var savedSelectPlaceholder = <div style={{ color: this.props.userLoggedIn ? placeholderTextColour : placeholderDisabledTextColour }}>{savedSelectPlaceholderText}</div>
        var publicSelectPlaceholder = <div style={{ color: placeholderTextColour}}>Select public crossword:</div>
        return <div style={{ height: "700px" }}>
            <h2>Select a crossword</h2>
            
            <fieldset style={{ borderRadius: "8px", border: fieldsetBorder }}>
                <legend>Saved crosswords:</legend>
                <div style={{ borderRadius: "8px", marginBottom: "10px", border: fieldsetBorder }}>
                    <EmailLogOnComp signInButtonProps={{ style: { color: "red", outlineWidth:"0px"} }} focusColor={focusedBorderColor} signInTitle={signInTitle} signOutTitle="Sign out" reLoginWait={1000} auth={auth} ></EmailLogOnComp>
                </div>
                <Select isLoading={this.props.storeCrosswordsLoading} placeholder={savedSelectPlaceholder} onFocus={this.savedOnFocus} onBlur={this.savedOnBlur} style={{ borderColor: this.state.savedSelectFocused ? focusedBorderColor : unfocusedBorderColor }} disabled={!this.props.userLoggedIn} options={storeOptions} value={this.props.storeSelectedCrossword !== null ? this.props.storeSelectedCrossword.id : null} onChange={this.storeOptionChange} />
                <Button  color="accent" disabled={this.props.storeSelectedCrossword === null} onMouseUp={this.props.storeCrosswordChosen}>Play crossword</Button>
                
            </fieldset>
            
            <fieldset style={{ borderRadius: "8px", border: fieldsetBorder}}>
                <legend>Public crosswords:</legend>
                <Select isLoading={this.props.jsonCrosswordsLoading} placeholder={publicSelectPlaceholder} onFocus={this.publicOnFocus} onBlur={this.publicOnBlur} style={{ borderColor: this.state.publicSelectFocused ? focusedBorderColor : unfocusedBorderColor }} options={jsonOptions} value={this.props.jsonSelectedCrossword !== null ? this.props.jsonSelectedCrossword.id : null} onChange={this.jsonOptionChange} />
                <Button color="accent" disabled={this.props.jsonSelectedCrossword === null} onMouseUp={this.props.jsonCrosswordChosen}>Play crossword</Button>
               
            </fieldset>

            
        </div>
    }
}
