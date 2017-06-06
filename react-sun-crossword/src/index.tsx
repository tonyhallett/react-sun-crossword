// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

import * as React from "react";
import * as ReactDOM from "react-dom";

import { CrosswordPuzzleLoader } from "./components/CrosswordPuzzleLoader";
import { Lightbulb } from "./components/lightbulb";
import { Lightbulbs } from "./components/Lighbulbs";
import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";

//ReactDOM.render(
//    <CrosswordPuzzleLoader/>,
//    document.getElementById("example")
//);
//CrosswordPuzzleApp
ReactDOM.render(
    <CrosswordPuzzleApp/>,
    document.getElementById("example")
);