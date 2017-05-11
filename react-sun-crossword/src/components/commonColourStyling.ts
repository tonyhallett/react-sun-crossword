import * as Color from "Color";


//these all have the same initial lightness but in rgb which is not ideal
//the values are too dark - so is there a way 
//to provide as hsl !

//these are hsl(x, y, 50%) until call the lightness value
var initialLightness = 80;

var greenColor = Color("rgb(0, 255, 17)").lightness(initialLightness);
var redColor = Color("rgb(255, 13, 0)").lightness(initialLightness);
var orangeColor = Color("rgb(255, 132, 0)").lightness(initialLightness);
var yellowColor = Color("rgb(217, 255, 0)").lightness(initialLightness);
var blueColor = Color("rgb(0, 106, 255)").lightness(initialLightness);



//this will be added in at the end
var whiteRgb = "rgb(255, 255, 255)";	
var blackRgb = "rgb(0, 0, 0)";

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

var changeAmount = 0.3;
var selectionModes = [{
    mode:'notSelected',
    change:0
}, {
    mode:'selected',
    change: 2
    }, {
        mode: 'wordSelected',
        change: 1
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
    blank: BackgroundColorStyle

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
(styles as CommonColourStyles).blank = { backgroundColor: blackRgb };
export  var commonColourStyles:CommonColourStyles =styles as CommonColourStyles