"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuredRadium_1 = require("../configuredRadium");
var react_transition_group_1 = require("react-transition-group");
var withInOnMount_1 = require("./withInOnMount");
var withAutoOut_1 = require("./withAutoOut");
var colourChangeTransition_1 = require("./colourChangeTransition");
var colourChangeTransition_2 = require("./colourChangeTransition");
exports.ColourChangeType = colourChangeTransition_2.ColourChangeType;
var RadiumTransition = configuredRadium_1.ConfiguredRadium(react_transition_group_1.Transition);
exports.AutoOutInOnMount = withAutoOut_1.withAutoOut(withInOnMount_1.withInOnMount(RadiumTransition));
exports.AutoOutInOnMountColourChangeRadiumTransition = colourChangeTransition_1.withColourChangeTransitionFn(exports.AutoOutInOnMount);
//# sourceMappingURL=transitions.js.map