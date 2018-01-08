import { ConfiguredRadium } from "../configuredRadium";
import { Transition } from "react-transition-group";
import { withInOnMount } from "./withInOnMount";
import { withAutoOut } from "./withAutoOut";
import { withColourChangeTransitionFn } from "./colourChangeTransition";
export {  ColourChangeType } from "./colourChangeTransition";

const RadiumTransition = ConfiguredRadium(Transition);
export const AutoOutInOnMount = withAutoOut(withInOnMount(RadiumTransition))
export const AutoOutInOnMountColourChangeRadiumTransition = withColourChangeTransitionFn(AutoOutInOnMount);