"use strict";
const Color = require("Color");
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
    }
];
var changeAmount = 0.1;
var selectionModes = [{
        mode: 'notSelected',
        change: 0
    }, {
        mode: 'selected',
        change: 1
    }, {
        mode: 'wordSelected',
        change: 2
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
exports.commonColourStyles = styles;
//# sourceMappingURL=commonColourStyling.js.map