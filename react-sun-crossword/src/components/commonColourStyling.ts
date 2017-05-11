import * as Color from "Color";
///******************** to resolve
//Will have a an issue with consistency on the lightness in terms of percentage increase

var greenColor = Color("rgb(0, 255, 17)");
var redColor = Color("rgb(255, 13, 0)");
var orangeColor = Color("rgb(255, 132, 0)");
var yellowColor = Color("rgb(217, 255, 0)");
var blueColor = Color("rgb(0, 106, 255)");
//this will be added in at the end
var whiteRgb = "rgb(255, 255, 255)";	

var notSelectedSolutionModeColours = [
    {
        mode: 'Guessing',
        color: blueColor
    }, {
        mode: 'Solved',
        color: greenColor
    }, {
        mode: 'Unsolved',
        color: redColor
    }, {
        mode: 'Cheating',
        color: orangeColor
    }]

var changeAmount = 0.1;
var selectionModes = [{
    mode:'notSelected',
    change:0
}, {
    mode:'selected',
    change: 1
    }, {
        mode: 'wordSelected',
        change: 2
    }

];

//#p1 {background-color: rgb(255, 0, 0);}   /* red */
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

}
var styles:any = {

}
selectionModes.forEach(selectionMode => {
    notSelectedSolutionModeColours.forEach(notSelectedSolutionModeColour => {
        styles[selectionMode.mode + notSelectedSolutionModeColour.mode] = {
            backgroundColor: notSelectedSolutionModeColour.color.darken(changeAmount * selectionMode.change).rgb().toString()
        }
    })
});

(styles as CommonColourStyles).notSelectedGuessing.backgroundColor = whiteRgb;
export  var commonColourStyles:CommonColourStyles =styles as CommonColourStyles