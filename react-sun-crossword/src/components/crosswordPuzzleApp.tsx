
import * as React from "react";
import { CrosswordModel, ConvertCrosswordJsonToModel, CrosswordModelJson, SolvingMode } from '../models/index'
import { CrosswordPuzzleKeyEvents } from "./crosswordPuzzle";
import { Promise } from "es6-promise";
import Select = require("react-select")
import { TwoCol } from "./twoCol";
import { CrosswordPuzzleChooseDetail, CrosswordPuzzleJsonStore, CrosswordPuzzleDataStore} from "../helpers/stores";
import { crosswordPuzzleDataStore } from "../helpers/crosswordPuzzleDataStore"
import { crosswordPuzzleJsonStore } from "../helpers/crosswordPuzzleJsonStore"
import { EmailLogOn } from "./emailLogOn";




interface CrosswordPuzzleAppState {
    crosswordModel: CrosswordModel
}
export class CrosswordPuzzleApp extends React.Component<undefined, CrosswordPuzzleAppState> {
    //these are not going to change so no need for being props
    crosswordPuzzleJsonStore: CrosswordPuzzleJsonStore
    crosswordPuzzleDataStore: CrosswordPuzzleDataStore
    constructor(props) {
        super(props);
        this.crosswordPuzzleJsonStore = crosswordPuzzleJsonStore;
        this.crosswordPuzzleDataStore = crosswordPuzzleDataStore;
        this.state = { crosswordModel: null};
    }
    crosswordChosen = (crosswordModel: CrosswordModel) => {
        this.setState({ crosswordModel: crosswordModel });
    }
    render() {
        var leftContent = <CrosswordPuzzleChooserContainer crosswordChosen={this.crosswordChosen} crosswordPuzzleDataStore={this.crosswordPuzzleDataStore} crosswordPuzzleJsonStore={this.crosswordPuzzleJsonStore} />;
        var rightContent = <CrosswordPuzzleKeyEvents crosswordModel={this.state.crosswordModel} />
        if (this.state.crosswordModel === null) {
            rightContent=<div/>
        }
        return <TwoCol leftContent={leftContent} rightContent={rightContent}>
            
        </TwoCol>
        
    }
}

interface CrosswordPuzzleChooserContainerProps {
    crosswordPuzzleJsonStore: CrosswordPuzzleJsonStore
    crosswordPuzzleDataStore: CrosswordPuzzleDataStore
    crosswordChosen: (crosswordModel: CrosswordModel)=>void
}
interface CrosswordPuzzleChooserContainerState {
    chooseDetailsJson: CrosswordPuzzleChooseDetail[]
    chooseDetailsStore: CrosswordPuzzleChooseDetail[]
}
export class CrosswordPuzzleChooserContainer extends React.Component<CrosswordPuzzleChooserContainerProps, CrosswordPuzzleChooserContainerState> {
    jsonDetails: CrosswordPuzzleChooseDetail[]=[]
    constructor(props) {
        super(props);
        this.state = { chooseDetailsJson: [], chooseDetailsStore:[] };
    }
    
    filterDetails(storeDetails: CrosswordPuzzleChooseDetail[]) {
        var self = this;
        return this.jsonDetails.filter(function (jsDetail) {
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
    setChoicesFromJson() {
        var self = this;
        this.props.crosswordPuzzleJsonStore.getDetailsAsync().then(function (details) {
            console.log("Setting from json")
            self.jsonDetails = details;
            self.setState({ chooseDetailsJson: details });
        })
    }
    componentDidMount() {
        this.setChoicesFromJson();
        
    }
    crosswordChosen = (chosen: CrosswordPuzzleChooseDetail) => {
        var self = this;
        chosen.getAsync().then(function (chosenCrossword) {
            self.props.crosswordChosen(ConvertCrosswordJsonToModel(chosenCrossword));
        });
    }
    loggedIn = (isLoggedIn: boolean) => {
        if (isLoggedIn) {
            var self = this;
            console.log("Is logged in")
            this.props.crosswordPuzzleDataStore.getDetailsAsync().then(function (details) {
                console.log("Setting from store");
                var jsonOnlyDetails = self.filterDetails(details);
                console.log(jsonOnlyDetails.length);
                self.setState({ chooseDetailsJson: jsonOnlyDetails,chooseDetailsStore:details });
            });
        } else {
            console.log("Is not logged in");
            this.setState({ chooseDetailsJson: this.jsonDetails });
        }
    }
    render() {
        return (<div>
                <CrosswordPuzzleChooser chooseDetailsJson={this.state.chooseDetailsJson} chooseDetailsStore={this.state.chooseDetailsStore} crosswordChosen={this.crosswordChosen} />
                <EmailLogOn loggedIn={this.loggedIn}></EmailLogOn>
        </div>);
    }
}
interface CrosswordPuzzleChooserProps {
    chooseDetailsJson: CrosswordPuzzleChooseDetail[]
    chooseDetailsStore: CrosswordPuzzleChooseDetail[]
    crosswordChosen: (chosen: CrosswordPuzzleChooseDetail) => void;
}
interface CrosswordPuzzleChooserState {
    jsonSelectedValue: string,
    storeSelectedValue: string,
    userHasSelected: boolean
}
export class CrosswordPuzzleChooser extends React.Component<CrosswordPuzzleChooserProps, CrosswordPuzzleChooserState>{
    constructor(props) {
        super(props);
        this.state = { jsonSelectedValue: "", storeSelectedValue: "", userHasSelected: false };
    }
    //could also provide a value on the options and use that
    chosen: CrosswordPuzzleChooseDetail
    jsonOptionSelected = (option: any) => {
        this.chosen = option._chooseDetail as CrosswordPuzzleChooseDetail;
        //annoying - it is necessary for the Select component that I have used
        this.setState({ jsonSelectedValue: this.chosen.id,userHasSelected:true })
    }
    storeOptionSelected = (option: any) => {
        this.chosen = option._chooseDetail as CrosswordPuzzleChooseDetail;
        //annoying - it is necessary for the Select component that I have used
        this.setState({ storeSelectedValue: this.chosen.id,userHasSelected:true })
    }
    buttonClicked = () => {
        this.props.crosswordChosen(this.chosen);
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
    render() {
        
        //refactor to map method
        var jsonOptions = this.mapToOptions(this.props.chooseDetailsJson);
        var storeOptions = this.mapToOptions(this.props.chooseDetailsStore);
        return <div style={{height:"700px"}}>
            <Select options={jsonOptions} value={this.state.jsonSelectedValue} onChange={this.jsonOptionSelected} />
            <Select options={storeOptions} value={this.state.storeSelectedValue} onChange={this.storeOptionSelected} />

            <button disabled={!this.state.userHasSelected} onClick={this.buttonClicked}>Happy with selection ?</button>
            </div>
    }
}
