import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { TwoCol } from "./twoCol";
import { ClueContainer, ClueFormat, GroupedClue } from "./clueContainer";
import { SolvingMode } from "../models/index";
import { ClueLetterProps } from "./formatWord";
import { Scrollbars } from 'react-custom-scrollbars';
//-----------------------------------------------  top level that determines if is grouped or not
export interface ClueProps {
    clueNumber: string,
    isSolved: boolean,
    solvingMode: SolvingMode,
    isSelected: boolean,
    text: string,
    format: string,
    clueLetters: ClueLetterProps[],
    wordId:number
}
export interface ClueProviderProps {
    name: string,
    acrossClues: ClueProps[],
    downClues:ClueProps[]
}
//should have a base interface for ClueSelected
export interface CrosswordCluesProps {
    grouping: boolean,
    clueProviders: ClueProviderProps[]
    clueSelected: (isAcross: boolean,wordId:number)=>void

}
interface GroupedMappedClue {
    clueNumber: string,
    wordId: number,
    isSolved: boolean,
    solvingMode: SolvingMode,
    isSelected: boolean,
    clueTextFormats: { text: string, format: string }[],
    clueLetters: ClueLetterProps[]
}
export class CroswordClues extends React.Component<CrosswordCluesProps, undefined> {
    mapNonGroupedToWrapped(clues:ClueProps[]): WrappedClue[]{
        return clues.map(clue => {
            return {
                clueNumber:clue.clueNumber,
                isSelected: clue.isSelected,
                isSolved: clue.isSolved,
                solvingMode: clue.solvingMode,
                wordId: clue.wordId,
                wrappedElement: <ClueFormat isSolved={clue.isSolved} clueLetters={clue.clueLetters} format={clue.format} text={clue.text} />
            }
        })
    }
    mapFirst(clues: ClueProps[]): GroupedMappedClue[] {
        return clues.map(clue => {
            var mapped = {
                clueNumber: clue.clueNumber,
                wordId: clue.wordId,
                isSolved: clue.isSolved,
                solvingMode: clue.solvingMode,
                isSelected: clue.isSelected,
                clueTextFormats: [{ text: clue.text, format: clue.format }],
                clueLetters: clue.clueLetters
            };
            return mapped;
        });
    }
    getWrappedClues(groupedMappedClues: GroupedMappedClue[]) {
        return groupedMappedClues.map(groupedMappedClue => {
            var wrappedElement = <GroupedClue clueTextFormats={groupedMappedClue.clueTextFormats} isSolved={groupedMappedClue.isSolved} clueLetters={groupedMappedClue.clueLetters} />
            var wrappedClue: WrappedClue = {
                clueNumber: groupedMappedClue.clueNumber,
                isSelected: groupedMappedClue.isSelected,
                wordId: groupedMappedClue.wordId,
                solvingMode: groupedMappedClue.solvingMode,
                isSolved: groupedMappedClue.isSolved,
                wrappedElement: wrappedElement
            }
            return wrappedClue
        });
    }   
    render() {//grouping or not grouping should render in the same div ( same width)
        if (this.props.grouping) {
            var allAcrossClues = []
            var allDownClues = []
            var numAcross: number;
            var numDown: number;

            var clueProviders = this.props.clueProviders;
            var firstClueProvider = clueProviders[0];
            var firstAcrossClues = firstClueProvider.acrossClues;
            var firstDownClues = firstClueProvider.downClues;

            
            var mappedAcrossClues = this.mapFirst(firstAcrossClues);
            var mappedDownClues = this.mapFirst(firstDownClues);
            for (var i = 1; i < clueProviders.length; i++) {
                var clueProvider = clueProviders[i];
                var clueProviderAcrossClues = clueProvider.acrossClues;
                for (var j = 0; j < clueProviderAcrossClues.length; j++) {
                    var acrossClue = clueProviderAcrossClues[j];
                    mappedAcrossClues[j].clueTextFormats.push({ text: acrossClue.text, format: acrossClue.format });
                }
                var clueProviderDownClues = clueProvider.downClues;
                for (var j = 0; j < clueProviderDownClues.length; j++) {
                    var downClue = clueProviderDownClues[j];
                    mappedDownClues[j].clueTextFormats.push({ text: downClue.text, format: downClue.format });
                }
            }

            var acrossWrappedClues = this.getWrappedClues(mappedAcrossClues);
            var downWrappedClues = this.getWrappedClues(mappedDownClues);
            
            
            return <div style={{ width: '600px' }}>
            <Tabs >
                <TabList>
                    <Tab>{"Clues"}</Tab>
                    
                </TabList>
                
                <TabPanel >
                    <AcrossDownClues clueSelected={this.props.clueSelected} acrossClues={acrossWrappedClues} downClues={downWrappedClues} />
                </TabPanel>
                
                
            </Tabs>
            </div>
        }
        return <div style={{ width: '600px' }}>
            <Tabs>
                <TabList>
                    {this.props.clueProviders.map((cp, index) => {
                        return <Tab key={index}>{cp.name}</Tab>
                    })}
                </TabList>
                {this.props.clueProviders.map((cp, index) => {
                    
                    return <TabPanel key={index}>
                        <AcrossDownClues clueSelected={this.props.clueSelected} acrossClues={this.mapNonGroupedToWrapped(cp.acrossClues)} downClues={this.mapNonGroupedToWrapped(cp.downClues)} />
                    </TabPanel>
                })}
            </Tabs>
        </div>

    }
}
//---------------------------------------
export interface AcrossDownCluesProps {
    acrossClues: WrappedClue[],
    downClues: WrappedClue[],
    clueSelected: (isAcross: boolean, wordId: number) => void;
}
export class AcrossDownClues extends React.Component<AcrossDownCluesProps, undefined> {
    render() {
        //var leftContent = <Scrollbars style={{ width: 500, height: 300 }}><div style={{ padding:'5px' }}>{this.getLeftText()}</div></Scrollbars>
        //var rightContent = <Scrollbars style={{ width: 500, height: 300 }}><div style={{ padding: '5px' }}>{this.getRightText()}</div></Scrollbars>
        var containerStyle = {height: '800px',width:'600px' }
        var leftContent = <AcrossOrDownClues clueSelected={this.props.clueSelected} isAcross={true} clues={this.props.acrossClues}></AcrossOrDownClues>
            
        var rightContent = <AcrossOrDownClues clueSelected={this.props.clueSelected} isAcross={false} clues={this.props.downClues} ></AcrossOrDownClues>;
        return <div style={containerStyle}> <TwoCol leftContent={leftContent} rightContent={rightContent} /></div>
    }
}
export interface AcrossOrDownCluesProps {
    isAcross: boolean,
    clues: WrappedClue[],
    clueSelected: (isAcross: boolean, wordId: number) => void;
    //will need the selected callback
}
export interface WrappedClue {
    wrappedElement: JSX.Element,
    clueNumber: string,
    wordId:number,
    isSolved: boolean,
    solvingMode: SolvingMode,
    isSelected:boolean
}
export class AcrossOrDownClues extends React.Component<AcrossOrDownCluesProps, undefined> {
    clueSelected = (wordId: number) => {
        this.props.clueSelected(this.props.isAcross, wordId);
    }
    render() {
        return (<div>
            <div style={{padding:'5px'}}>{this.props.isAcross ? "Across" : "Down"}</div>
            <Scrollbars style={{ width: '300px', height: '800px' }}>
                {this.props.clues.map((clue, index) => {
                    var border = '1px black solid';
                    var style: React.CSSProperties = {
                        borderTop: "",
                        borderBottom: ""
                        
                    }
                    if (index !== this.props.clues.length) {
                        style.borderTop = border;
                    } else {
                        style.borderBottom = border;
                    }
                    return <div style={style} key={index}>
                        <ClueContainer wrapped={clue.wrappedElement} key={index} selected={this.clueSelected} clueNumber={clue.clueNumber} wordId={clue.wordId} isSolved={clue.isSolved} solvingMode={clue.solvingMode} isSelected={clue.isSelected}>
                    
                        </ClueContainer>
                    </div>
                    
                })}
            </Scrollbars>
        </div>)
    }
}


