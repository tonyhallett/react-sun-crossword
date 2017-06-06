import * as Color from "Color";


//these all have the same initial lightness but in rgb which is not ideal
//the values are too dark - so is there a way 
//to provide as hsl !

//these are hsl(x, y, 50%) until call the lightness value
var initialLightness = 95;

var solvedColor = Color("rgb(0, 255, 0)").lightness(initialLightness);
var notSolvedColor = Color("rgb(220, 20, 60)").lightness(initialLightness);


var greyColor = Color("rgb(242, 242, 242)").lightness(95);
var cheatColor = greyColor;

var notSelectedGuessingRgb = "rgb(247, 247, 247)";	
var blankRgb = "rgb(51, 51, 51)";
var blackRgb = "rgb(51, 51, 51)";

var notSelectedSolutionModeColours = [
    {
        mode: 'Guessing',
        color: greyColor
    }, {
        mode: 'Solved',
        color: solvedColor
    }, {
        mode: 'Unsolved',
        color: notSolvedColor
    }, {
        mode: 'Cheating',
        color: cheatColor
    }]

var changeAmount = 0.1;
var selectionModes = [{
    mode:'notSelected',
    change:0
}, {
    mode:'selected',
    change: 3
    }, {
        mode: 'wordSelected',
        change: 1
    }

];


export interface BackgroundColorStyle {
    backgroundColor:string
}
//can do better with the Record type
interface CommonColourStyles {
    notSelectedGuessing: BackgroundColorStyle,
    selectedGuessing: BackgroundColorStyle,
    wordSelectedGuessing: BackgroundColorStyle,
    notSelectedSolved: BackgroundColorStyle,
    selectedSolved: BackgroundColorStyle,
    wordSelectedSolved: BackgroundColorStyle,
    notSelectedUnsolved: BackgroundColorStyle,
    selectedUnsolved: BackgroundColorStyle,
    wordSelectedUnsolved: BackgroundColorStyle,
    notSelectedCheating: BackgroundColorStyle,
    selectedCheating: BackgroundColorStyle,
    wordSelectedCheating: BackgroundColorStyle,
    notSelected: BackgroundColorStyle,
    selected: BackgroundColorStyle,
    wordSelected: BackgroundColorStyle,
    blank: BackgroundColorStyle,
    letter: BackgroundColorStyle,
    letterSolved: BackgroundColorStyle

}
var styles: CommonColourStyles = {

} as CommonColourStyles;

selectionModes.forEach((selectionMode) => {
    notSelectedSolutionModeColours.forEach(notSelectedSolutionModeColour => {
        styles[selectionMode.mode + notSelectedSolutionModeColour.mode] = {
            backgroundColor: notSelectedSolutionModeColour.color.darken(changeAmount * selectionMode.change).rgb().toString()
        }
    })
});

styles.notSelectedGuessing.backgroundColor = notSelectedGuessingRgb;
styles.blank = { backgroundColor: blankRgb };
styles.letter = { backgroundColor: blackRgb };
styles.letterSolved = {
    backgroundColor: solvedColor.darken(0.7).rgb().toString()
}
export var commonColourStyles: CommonColourStyles = styles as CommonColourStyles
