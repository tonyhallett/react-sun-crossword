import * as React from "react";
import * as ReactDOM from "react-dom";


import { CrosswordPuzzleApp } from "./components/crosswordPuzzleApp";
import { DemoRouterApp } from "./router_test/DemoRouterApp"

//ReactDOM.render(
//    <CrosswordPuzzleApp/>,
//    document.getElementById("example")
//);

ReactDOM.render(
    <DemoRouterApp />,
    document.getElementById("example")
);