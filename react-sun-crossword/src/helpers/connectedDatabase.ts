import { CrosswordLookupJson } from "../models/index";

export interface IConnectedDatabase {
    connectionChanged(callback: (isConnected: boolean) => void);
    //callback signature to change
    listenForPublicCrosswordLookups(callback: (lookups: CrosswordLookupJson[]) => void);
    listenForUserCrosswordLookups(uid: string, callback: (lookups: CrosswordLookupJson[]) => void);
}
//assume that this will need to import the firebaseApp

class FirebaseDatabase implements IConnectedDatabase {
    listenForUserCrosswordLookups(uid: string, callback: (lookups: CrosswordLookupJson[]) => void) {
        throw new Error('Method not implemented.');
    }

    listenForPublicCrosswordLookups(callback: (lookups: CrosswordLookupJson[]) => void) {
        throw new Error('Method not implemented.');
    }

    connectionChanged(callback: (isConnected: boolean) => void) {
        throw new Error('Method not implemented.');
    }
}

export var connectedDatabase: IConnectedDatabase = new FirebaseDatabase();
