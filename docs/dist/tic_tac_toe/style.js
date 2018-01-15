"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = require("Color");
var Radium = require("Radium");
var fontFamilies = require("./fontFamilies");
var translate3d = function (a, b, c) { return "translate3d(" + a + "px, " + b + "px, " + c + "px)"; };
function createShakeKeyframes(shakeDistance) {
    var noShake = {
        transform: translate3d(0, 0, 0)
    };
    var downShake = {
        transform: translate3d(-shakeDistance, 0, 0)
    };
    var upShake = {
        transform: translate3d(shakeDistance, 0, 0)
    };
    /*
    without pause ( easy enough to calculate based upon a pause percent)
    return {
        from: noShake,
        '10%': downShake,
        '20%': upShake,
        '30%': downShake,
        '40%': upShake,
        '50%': downShake,
        '60%': upShake,
        '70%': downShake,
        '80%': upShake,
        '90%': downShake,
        to: noShake
    };
    */
    return {
        from: noShake,
        '10%': downShake,
        '20%': upShake,
        '30%': downShake,
        '40%': upShake,
        '50%': downShake,
        '60%': noShake,
        to: noShake
    };
}
exports.thButtonFontWeight = "bold";
//these have been taken from https://www.w3schools.com/colors/colors_picker.asp
var scoreboardBackgroundColor = "rgb(226, 220, 207)";
exports.buttonBackgroundColor = "rgb(226, 220, 207)";
var hoverButtonBackground = Color(exports.buttonBackgroundColor).lighten(0.1);
exports.componentBackgroundColor = "rgb(207, 197, 175)";
var indicatorWinningSquareColor = Color(exports.componentBackgroundColor).lighten(0.1);
exports.ticTacToeSquareBorderWidth = 5;
exports.backgroundColor = "orange";
var startEndBoxShadow = "0 0 5px 2px " + exports.backgroundColor + " inset";
var focusKeyframes = {
    '0%': {
        boxShadow: startEndBoxShadow
    },
    '50%': {
        boxShadow: "0 0 10px 5px " + exports.backgroundColor + " inset"
    },
    '100%': {
        boxShadow: startEndBoxShadow
    }
};
exports.focusAnimationStyle = {
    animationName: Radium.keyframes(focusKeyframes),
    animationDuration: "2000ms",
    animationIterationCount: "infinite",
    animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)"
};
var shakeKeyframes = createShakeKeyframes(5);
exports.shakeAnimationStyle = {
    animationName: Radium.keyframes(shakeKeyframes),
    animationDuration: "2000ms",
    animationIterationCount: "infinite",
};
var boxShadowHover = "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)";
exports.buttonHoverFocusBrightnessAnimationStyle = {
    animationName: Radium.keyframes({
        "100%": {
            backgroundColor: hoverButtonBackground
        }
    }),
    animationDuration: "1s",
    animationFillMode: "forwards"
};
exports.buttonHoverShadowStyle = {
    boxShadow: boxShadowHover,
};
exports.fontSize = 20;
exports.pulseIncrease = 1.5;
var scoreboardPadding = 5;
var ticTacToeSquareFontSize = 80;
//override scoreboard.cellStyle with noughtCrossStyle for the player cells
exports.style = {
    winDrawContainerStyle: { fontWeight: "bold", margin: "0 auto", width: "80%", textAlign: "center", fontSize: exports.fontSize },
    componentBackgroundColor: exports.componentBackgroundColor,
    componentBoxShadow: {
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
        transition: "all 0.3s cubic-bezier(.25, .8, .25, 1)"
    },
    componentBoxShadowHover: {
        ":hover": { boxShadow: boxShadowHover }
    },
    componentMargin: 10,
    borderRadius: 5,
    loadingIndicator: {
        cellStyle: {
            backgroundColor: exports.componentBackgroundColor,
            width: 20,
            height: 20,
            fontSize: 10,
            textAlign: "center",
            fontWeight: "bold"
        },
        winningCellStyle: {
            animationName: Radium.keyframes({
                '100%': {
                    fontSize: 18,
                    backgroundColor: indicatorWinningSquareColor
                }
            }),
            animationDuration: "1s",
            animationIterationCount: "infinite",
            animationDirection: "alternate"
        }
    },
    scoreboard: {
        cellStyle: {
            paddingTop: scoreboardPadding,
            paddingBottom: scoreboardPadding,
            textAlign: "center",
            fontSize: exports.fontSize,
            backgroundColor: scoreboardBackgroundColor,
            fontFamily: fontFamilies.textFontFamilyWithDefault
        },
        noughtCrossStyle: {
            fontFamily: fontFamilies.noughtCrossFontFamilyWithDefault
        },
        rowStyle: {
            borderTopWidth: 1, borderTopColor: "black", borderTopStyle: "solid",
            height: exports.fontSize * exports.pulseIncrease + 2 * scoreboardPadding
        },
        winColour: "green",
        loseColour: "red",
        drawColour: "orange",
        thFontWeight: exports.thButtonFontWeight
    },
    ticTacToeSquare: {
        style: {
            verticalAlign: "center",
            textAlign: "center", width: 100, height: 100,
            borderColor: "white", borderStyle: "solid", borderWidth: 0, fontSize: ticTacToeSquareFontSize, fontFamily: fontFamilies.noughtCrossFontFamilyWithDefault,
        },
        focusAnimation: {
            startEndBoxShadow: "0 0 5px 2px ",
            fiftyPercentBoxShadow: "0 0 10px 5px ",
            animationProps: {
                animationDuration: "2000ms",
                animationIterationCount: "infinite",
                animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)"
            }
        }
    },
    ticTacToeSquareBorderWidth: exports.ticTacToeSquareBorderWidth,
    cursor: {
        fontSize: ticTacToeSquareFontSize / 2
    }
};
//# sourceMappingURL=style.js.map