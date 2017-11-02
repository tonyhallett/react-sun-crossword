"use strict";
const Color = require("Color");
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
    }
];
var changeAmount = 0.3;
var selectionModes = [{
        mode: 'notSelected',
        change: 0
    }, {
        mode: 'selected',
        change: 2
    }, {
        mode: 'wordSelected',
        change: 1
    }
];
var styles = {};
selectionModes.forEach(selectionMode => {
    notSelectedSolutionModeColours.forEach(notSelectedSolutionModeColour => {
        styles[selectionMode.mode + notSelectedSolutionModeColour.mode] = {
            backgroundColor: notSelectedSolutionModeColour.color.darken(changeAmount * selectionMode.change).rgb().toString()
        };
    });
});
styles.notSelectedGuessing.backgroundColor = whiteRgb;
styles.blank = { backgroundColor: blackRgb };
exports.commonColourStyles = styles;
//# sourceMappingURL=commonColourStyling.js.map