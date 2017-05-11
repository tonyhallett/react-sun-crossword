// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import * as ReactDOM from "react-dom";

import { CrosswordPuzzleLoader } from "./components/CrosswordPuzzleLoader";

ReactDOM.render(
    <CrosswordPuzzleLoader/>,
    document.getElementById("example")
);
