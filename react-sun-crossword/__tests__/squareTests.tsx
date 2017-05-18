///<reference types="jest"/>
import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { mount, shallow, ReactWrapper } from 'enzyme';
import * as CrosswordModel from '../src/models/index';
import { Square, SquareProps } from '../src/components/square'
import { SquareLetter, SquareLetterProps } from '../src/components/squareLetter'
import { SquareNumber, SquareNumberProps } from '../src/components/squareNumber'
//probably should test that have set the module correctly !
import { commonColourStyles, BackgroundColorStyle } from '../src/components/commonColourStyling'
import { xpit,pit, pits } from '../node_modules/jestextensions/index'

describe('<Square />', () => {
    describe('should style the background color appropriately when is blank', () => {
        const wrapper = mount(<Square guess="" letter="" isSelected={false} isWordSelected={false} solvingMode={CrosswordModel.SolvingMode.Cheating} number="" identifier="id" selected={() => { }} />);
        var domNode = wrapper.getDOMNode() as HTMLElement;
        expect(domNode.style.backgroundColor).toBe(commonColourStyles.blank.backgroundColor);
    })
    describe('should style the background color of the root node for selection state and solving mode combinations given the guess and the letter', () => {
        var letter, solvedGuess;
        letter = solvedGuess = "Y";
        var unsolvedGuess = "N";

        pit('NotSelected, Cheating, Unsolved', false, false, CrosswordModel.SolvingMode.Cheating, unsolvedGuess, commonColourStyles.notSelectedCheating);
        pit('Selected,Cheating, Unsolved', true, true, CrosswordModel.SolvingMode.Cheating, unsolvedGuess, commonColourStyles.selectedCheating);
        pit('WordSelected,Cheating, Unsolved', false, true, CrosswordModel.SolvingMode.Cheating, unsolvedGuess, commonColourStyles.wordSelectedCheating);

        pit('NotSelected, Cheating, Solved', false, false, CrosswordModel.SolvingMode.Cheating, solvedGuess, commonColourStyles.notSelectedSolved);
        pit('Selected,Cheating,Solved', true, true, CrosswordModel.SolvingMode.Cheating, solvedGuess, commonColourStyles.selectedSolved);
        pit('WordSelected,Cheating,Solved', false, true, CrosswordModel.SolvingMode.Cheating, solvedGuess, commonColourStyles.wordSelectedSolved);

        //guessing is just selected 
        pit('NotSelected, Guessing', false, false, CrosswordModel.SolvingMode.Guessing, "", commonColourStyles.notSelectedGuessing);
        pit('Selected,Guessing', true, true, CrosswordModel.SolvingMode.Guessing, "", commonColourStyles.selectedGuessing);
        pit('WordSelected,Guessing', false, true, CrosswordModel.SolvingMode.Guessing, "", commonColourStyles.wordSelectedGuessing);


        pit('NotSelected,Solving, Solved', false, false, CrosswordModel.SolvingMode.Solving, solvedGuess, commonColourStyles.notSelectedSolved);
        pit('Selected,Solving, Solved', true, true, CrosswordModel.SolvingMode.Solving, solvedGuess, commonColourStyles.selectedSolved);
        pit('WordSelected,Solving,Solved', false, true, CrosswordModel.SolvingMode.Solving, solvedGuess, commonColourStyles.wordSelectedSolved);

        pit('NotSelected,Solving, Unsolved', false, false, CrosswordModel.SolvingMode.Solving, unsolvedGuess, commonColourStyles.notSelectedUnsolved);
        pit('Selected,Solving,Unsolved', true, true, CrosswordModel.SolvingMode.Solving, unsolvedGuess, commonColourStyles.selectedUnsolved);
        pit('WordSelected,Solving, Unsolved', false, true, CrosswordModel.SolvingMode.Solving, unsolvedGuess, commonColourStyles.wordSelectedUnsolved);

        pits((isSelected: boolean, isWordSelected: boolean, solvingMode: CrosswordModel.SolvingMode, guess: string, backgroundStyle: BackgroundColorStyle) => {
            const wrapper = mount(<Square guess={guess} letter={letter} isSelected={isSelected} isWordSelected={isWordSelected} solvingMode={solvingMode} number="" identifier="id" selected={() => { }} />);
            var domNode = wrapper.getDOMNode() as HTMLElement;
            expect(domNode.style.backgroundColor).toBe(backgroundStyle.backgroundColor);
        });
    });
    
    describe('should have a <SquareNumber/> inside with the number prop ', () => {
        pit('no number');
        pit('number');

        pits((number: string) => {
            const wrapper = mount(<Square guess="" letter="" isSelected={true} isWordSelected={true} solvingMode={CrosswordModel.SolvingMode.Guessing} number={number} identifier="id" selected={() => { }} />);
            expect(wrapper.find(SquareNumber).prop("number")).toBe(number);
        });
    });
    describe('should have a <SquareLetter/> inside ', () => {
        var letter = "L";
        var guess = "G";
        pit('with letter prop the guess when guessing', CrosswordModel.SolvingMode.Guessing,true);
        pit('with letter prop the guess when solving', CrosswordModel.SolvingMode.Solving,true);
        pit('with letter prop the letter when cheating', CrosswordModel.SolvingMode.Cheating,false);
        pits((solvingMode,squareLetterLetterIsGuess) => {
            var expectedLetterProperty = letter;
            if (squareLetterLetterIsGuess) {
                expectedLetterProperty = guess;
            }

            const wrapper = mount(<Square guess={guess} letter={letter} isSelected={true} isWordSelected={true} solvingMode={solvingMode} number="" identifier="id" selected={() => { }} />);
            //note that if does not find then will not be null, but will have length 0, and there will be an exception trying to get prop() later
            expect(wrapper.find(SquareLetter).prop("letter")).toBe(expectedLetterProperty);
        });
    });
    describe('should raise the selected event when the containing element receives click event passing the identifier', () => {
        var selectedHandler = jest.fn();
        var identifier = { id: 1 };
        const wrapper = mount(<Square guess="" letter="A" isSelected={false} isWordSelected={false} solvingMode={CrosswordModel.SolvingMode.Cheating} number="" identifier={identifier} selected={selectedHandler} />);
        wrapper.simulate("click");
        expect(selectedHandler).toBeCalledWith(identifier);
    })
});