import { CrosswordLookupJson, CrosswordModelJson } from "../models/index";
import { database } from './firebaseApp'

export interface IConnectedDatabase {
    connectionChanged(callback: (isConnected: boolean) => void);
    listenForPublicCrosswordLookups(callback: (lookups: CrosswordLookupJson[]) => void);
    listenForUserCrosswordLookups(uid: string, callback: (lookups: CrosswordLookupJson[]) => void);
    getPublicCrossword(id: string): Promise<CrosswordModelJson>;
    getUserCrossword(uid: string, id: string): Promise<CrosswordModelJson>
    saveUserCrossword(uid: string, id: string, crossword: any, crosswordLookup: any): Promise<UserSaveDetails>
}
export interface UserSaveDetails {
    uid: string,
    crosswordId:string
}

class FirebaseDatabase implements IConnectedDatabase {
    saveUserCrossword(uid: string, id: string, crossword: any, crosswordLookup: any): Promise<any> {
        return new Promise<UserSaveDetails>(function (resolve, reject) {
            var updatedUserData = {};
            var users = database.ref('users');
            updatedUserData[uid + '/crosswords/' + id] = crossword;
            updatedUserData[uid + '/crosswordLookups/' + id] = crosswordLookup;
            users.update(updatedUserData).then(function () {
                resolve({uid:uid,crosswordId:id});
            }).catch(function (err) {
                reject(err);
            });
            //database.ref('users/' + uid + '/crosswords/' + id).set(crossword).then(function () {
            //    console.log("Saved user crossword");
            //    database.ref('users/' + uid + '/crosswordLookups/' + id).set(crosswordLookup).then(function (err) {
            //        console.log("Saved user crossword and lookup");
            //        resolve();
            //    }).catch(function (err) {
            //        console.log("Houston we have a problem with firebase user crossword lookup");
            //        reject(err);
            //    });



            //}).catch(function (err) {
            //    console.log("Houston we have a problem with updating firebase user crossword");
            //    reject(err);
            //});
        });
        
    }

    

    connected: boolean
    connectionChangedCallback: (isConnected: boolean) => void
    connectedRef: firebase.database.Reference;
    constructor() {
        this.connectedRef = database.ref(".info/connected");
        var self = this;
        this.connectedRef.on("value", function (snap) {
            var connected = false;
            if (snap.val() === true) {
                connected = true;
            }
            self.connected = connected;
            if (self.connectionChangedCallback) {
                self.connectionChangedCallback(connected);
            }
        });
    }
    getPublicCrossword(id: string): Promise<CrosswordModelJson> {
        return new Promise<CrosswordModelJson>(function (resolve, reject) {
            database.ref("crosswords/" + id).once("value").then(function (snapshot) {
                    var crossword = snapshot.val() as CrosswordModelJson;
                    resolve(crossword);
                }).catch(function (err) {
                    console.log("Error getting public crossword ");
                    reject(err);
                })
        });
    }
    getUserCrossword(uid: string, id: string): Promise<CrosswordModelJson> {
        return new Promise<CrosswordModelJson>(function (resolve, reject) {
            database.ref("users/" + uid + "/crosswords/" + id).once("value").then(function (snapshot) {
                var crossword = snapshot.val() as CrosswordModelJson;
                resolve(crossword);
            }).catch(function (err) {
                console.log("Error getting user crossword ");
                reject(err);
            });
        });
        
    }
    //will need to stop listening for these
    listenForUserCrosswordLookups(uid: string, callback: (lookups: CrosswordLookupJson[]) => void) {
        database.ref("users/" + uid + "/crosswordLookups").on('value', function (snapshot: firebase.database.DataSnapshot) {
            var lookups: CrosswordLookupJson[] = [];
            snapshot.forEach(function (ss) {
                lookups.push(ss.val() as CrosswordLookupJson);
                return false;
            });
            callback(lookups);
        });
    }
    
    listenForPublicCrosswordLookups(callback: (lookups: CrosswordLookupJson[]) => void) {
        database.ref("crosswordLookups").on('value', function (snapshot: firebase.database.DataSnapshot) {
            var lookups: CrosswordLookupJson[] = [];
            snapshot.forEach(function (ss) {
                lookups.push(ss.val() as CrosswordLookupJson);
                return false;
            });
            callback(lookups);
        });
    }

    connectionChanged(callback: (isConnected: boolean) => void) {
        this.connectionChangedCallback = callback;
        if (this.connected) {
            callback(true);
        }

    }
}

export var connectedDatabase: IConnectedDatabase = new FirebaseDatabase();
