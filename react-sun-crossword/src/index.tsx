import * as React from "react";
import * as ReactDOM from "react-dom";
import { DynamicContextProvider } from "./router_test/dynamicContext";

ReactDOM.render(
   <DynamicContextProvider/>,

    document.getElementById("example")
);
