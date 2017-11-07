import * as React from "react";
import { BrowserRouter,Link,Route } from 'react-router-dom'
export class DemoRouterApp extends React.Component<undefined, undefined> {
    render() {
        return <BrowserRouter>
            <RouterAwareApp />
        </BrowserRouter>
    }
}

export class RouterAwareApp extends React.Component<undefined, undefined> {
    render() {
        return <div>
            <Link to="/react-sun-crossword/">Introduction</Link>
            <Link to="/react-sun-crossword/settings">Settings</Link>
            <Link to="/react-sun-crossword/crossword">Crossword</Link>

            <Route exact path="/react-sun-crossword/" component={Introduction} />
            <Route path="/react-sun-crossword/settings" component={Settings} />
            <Route path="/react-sun-crossword/crossword" component={Crossword} />

            </div>
    }
}

export class Introduction extends React.Component<undefined, undefined> {
    render() {
        return <div>This is an introduction</div>
    }
}
export class Settings extends React.Component<undefined, undefined> {
    render() {
        return <div>This is settings where will look at local storage</div>
    }
}

export class Crossword extends React.Component<undefined, undefined> {
    render() {
        return <div>This is where have to have chooser and the crossword, clues, buttons etc</div>
    }
}


