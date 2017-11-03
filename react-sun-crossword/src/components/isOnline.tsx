import * as React from "react";



interface IsOnlineState {
    isOnline: boolean
}

export class IsOnline extends React.Component<undefined, IsOnlineState> {
    constructor(props) {
        super(props);
        
        this.state = { isOnline: false };
    }
    onlineChanged = () => {
        this.setState({ isOnline: navigator.onLine });
    }
    componentDidMount() {
        window.addEventListener("online", this.onlineChanged);
        window.addEventListener("offline", this.onlineChanged);
        this.setState({ isOnline: navigator.onLine });
    }
    render() {
        return <div>{this.state.isOnline?"Online":"Offline"}</div>
    }
}