import * as React from "react";
import { SolvingMode } from "../models/index";
import { ClueLetterProps, FormatWord, FormatWordProps } from "./formatWord";
import { ClueNumber } from "./clueNumber";
import { TwoCol } from "./twoCol";
import { BackgroundColorStyle, commonColourStyles } from "./commonColourStyling";


export interface ClueContainerProps { wrapped: JSX.Element, isSelected: boolean, solvingMode: SolvingMode, isSolved: boolean, clueNumber: string, wordId:number,selected: (wordId: number) => void }

export class ClueContainer extends React.Component<ClueContainerProps, undefined> {
    _getBackgroundColorStyle(): BackgroundColorStyle {
       
        var solvingMode = this.props.solvingMode;
        
        var backgroundColorStyle: BackgroundColorStyle;

        var propName = "wordSelected";
        if (!this.props.isSelected) {
            propName = "notSelected";
        }
        var solvingModePropPart: string = "Guessing";
        if (solvingMode !== SolvingMode.Guessing) {
            if (this.props.isSolved) {
                solvingModePropPart = "Solved";
            } else {
                solvingModePropPart = "Unsolved";
                if (solvingMode === SolvingMode.Cheating) {
                    solvingModePropPart = "Cheating";
                }
            }
        }


        propName = propName + solvingModePropPart;

        backgroundColorStyle = commonColourStyles[propName];
        return backgroundColorStyle;
    };
    selected = () => {
        this.props.selected(this.props.wordId);
    }
    shouldComponentUpdate(nextProps: ClueContainerProps, nextState) {
        var shouldUpdate = false;
        for (var p in nextProps) {
            if (this.props[p] !== nextProps[p]) {
                shouldUpdate = true;
                break;
            }
        }
        return shouldUpdate;
    }
    render() {
        var leftContent = <ClueNumber number={this.props.clueNumber} />
        var rightContent = this.props.wrapped;
        var backgroundColor = this._getBackgroundColorStyle().backgroundColor;
        return <div style={{
            backgroundColor: backgroundColor,
            padding: '10px',
            overflow: 'hidden' }} onClick={this.selected}>
            <TwoCol leftPercentage={10} leftContent={leftContent} rightContent={rightContent} /> 
            </div>

    }
}

export interface ClueFormatProps extends FormatWordProps {
    text: string,
    format: string,
    isSolved: boolean
}
export class ClueFormat extends React.Component<ClueFormatProps, undefined>{
    render() {      
        return (<div>
            <div style={{padding:'2px'}}>
                <ClueText text={this.props.text} />
            </div>
            <div style={{ padding: '2px' }}>
                <FormatWord isSolved={this.props.isSolved} format={this.props.format} clueLetters={this.props.clueLetters} />
            </div>
        </div>);
    }
}
export interface ClueTextProps {
    text: string,
}
export class ClueText extends React.Component<ClueTextProps, undefined>{
    render() {

        return <div  dangerouslySetInnerHTML={{ __html: this.props.text }}></div>
    }
}
//export interface ClueProps extends ClueContainerProps {
//    clueTextFormat: ClueTextFormat
//    clueLetters:ClueLetterProps[]
//}

//export class Clue extends React.Component<ClueProps, undefined> {
//    render() {
//        return <ClueContainer isSelected={this.props.isSelected} clueNumber={this.props.clueNumber} isSolved={this.props.isSolved} solvingMode={this.props.solvingMode}>
//            <div>{this.props.clueTextFormat.text}</div>
//            <FormatWord format={this.props.clueTextFormat.format} clueLetters={this.props.clueLetters} />
//        </ClueContainer>
//    }
//}
export interface ClueTextFormat {
    text: string,
    format:string
}
export interface GroupedClueProps {
    clueTextFormats: ClueTextFormat[],
    clueLetters: ClueLetterProps[],
    isSolved: boolean,

}
export class GroupedClue extends React.Component<GroupedClueProps, undefined> {
    render() {
        var clueTextFormats = this.props.clueTextFormats;
        var compareFormat: string;
        var formatsSame = true;
        for (var i = 0; i < clueTextFormats.length; i++) {
            var format = clueTextFormats[i].format;
            if (compareFormat) {
                formatsSame = compareFormat === format;
                if (!formatsSame) {
                    break;
                }
            } else {
                compareFormat = format;
            }
        }
        
        if (formatsSame) {
            return (<div>
                {this.props.clueTextFormats.map((clueTextFormat, index) => {
                    return <div style={{ paddingBottom:'2px' }}><ClueText key={index} text={clueTextFormat.text + " /"} /></div>
                })}
                
                <FormatWord isSolved={this.props.isSolved} format={compareFormat} clueLetters={this.props.clueLetters} />
                </div>)
        } else {
            return <div>
                {clueTextFormats.map((clueTextFormat, index) => {
                    return <div>
                        <ClueFormat isSolved={this.props.isSolved} clueLetters={this.props.clueLetters} format={clueTextFormat.format} text={clueTextFormat.text} key={index} />
                        </div>
                })}
                </div>
        }
        

    }
}


