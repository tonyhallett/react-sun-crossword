// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
"use strict";
var React = require("react");
var ReactDOM = require("react-dom");
var crosswordPuzzleApp_1 = require("./components/crosswordPuzzleApp");
//ReactDOM.render(
//    <CrosswordPuzzleLoader/>,
//    document.getElementById("example")
//);
//CrosswordPuzzleApp
ReactDOM.render(React.createElement(crosswordPuzzleApp_1.CrosswordPuzzleApp, null), document.getElementById("example"));
//# sourceMappingURL=index.js.map