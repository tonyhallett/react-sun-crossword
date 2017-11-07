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
            <Link to="/">Introduction</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/crossword">Crossword</Link>

            <Route exact path="/" component={Introduction} />
            <Route path="/settings" component={Settings} />
            <Route path="/crossword" component={Crossword} />

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


