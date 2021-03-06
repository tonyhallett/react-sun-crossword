﻿import { CrosswordPuzzleDataStore, CrosswordPuzzleChooseDetail } from "./stores";
import { auth,database } from './firebaseApp'
import { CrosswordModelJson } from "../models/index";

class FirebaseUserStore implements CrosswordPuzzleDataStore {
    saveCrosswordAsync(crossword: CrosswordModelJson): Promise<{}> {
        return new Promise(function (resolve, reject) {
            var lookupJson = { id: crossword.id, datePublished: crossword.datePublished, title: crossword.title };
            //should be done as a transaction 
            //if offline and not bothering waiting - what do you do when there is an error ?!
            console.log("In user store save crossword Promise");
            database.ref('users/' + auth.currentUser.uid + '/crosswords/' + crossword.id).set(crossword).then(function () {
                console.log("Saved user crossword");
                database.ref('users/' + auth.currentUser.uid + '/crosswordLookups/' + lookupJson.id).set(lookupJson).then(function (err) {
                    console.log("Saved user crossword and lookup");
                    resolve();
                }).catch(function (err) {
                    console.log("Houston we have a problem with firebase user crossword lookup");
                    reject(err);
                });

                   
                
            }).catch(function (err) {
                console.log("Houston we have a problem with updating firebase user crossword");
                reject(err);
            });
             
        });
        
    }

    getDetailsAsync(): Promise<CrosswordPuzzleChooseDetail[]> {
        var self = this;
        return new Promise<CrosswordPuzzleChooseDetail[]>(function (resolve, reject) {
            var connectedRef = database.ref(".info/connected");
            connectedRef.on("value", function (snap) {
                if (snap.val() === true) {
                    var lookupsPath = "users/" + auth.currentUser.uid + "/crosswordLookups"
                    var lookups = database.ref(lookupsPath);
                    //https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot
                    lookups.once('value').then(function (snapshot) {
                        var details: CrosswordPuzzleChooseDetail[] = [];
                        snapshot.forEach(function (childSnapshot) {
                            var childKey = childSnapshot.key;
                            var childData = childSnapshot.val();
                            details.push(new FirebaseUserStoreChooseDetail(self, childData.title, childData.id, childData.datePublished as string));
                            return false
                        });
                        resolve(details);

                    }).catch(function (err) {
                        //do something 
                        console.log("Error getting details")
                        reject(err);
                    });
                } else {
                    reject({ message: "Not connected"});
                }
            });

            
        })
    }
    getCrosswordAsync(id: string): Promise<CrosswordModelJson> {
        console.log("Getting user crossword");
        return new Promise<CrosswordModelJson>(function (resolve, reject) {
            var connectedRef = database.ref(".info/connected");
            connectedRef.on("value", function (snap) {
                if (snap.val() === true) {
                    database.ref("users/" + auth.currentUser.uid + "/crosswords/" + id).once("value").then(function (snapshot) {
                        var crossword = snapshot.val() as CrosswordModelJson;
                        console.log("user crossword downloaded");
                        resolve(crossword);
                    }).catch(function (err) {
                        //do something
                        console.log("Error getting crossword ");
                        reject(err);
                    });
                } else {
                    reject({ message:"Not connected"})
                }
            });
             
        });

    }
}
//same as for public store apart from bool inStore - refactor to import and remove this
class FirebaseUserStoreChooseDetail implements CrosswordPuzzleChooseDetail {

    store: FirebaseUserStore
    constructor(store: FirebaseUserStore, title: string, id: string, datePublished: string) {
        this.inStore = true;
        this.title = title;
        this.id = id;
        this.datePublished = new Date(datePublished);
        this.store = store;

    }
    inStore: boolean;
    getAsync(): Promise<CrosswordModelJson> {
        return this.store.getCrosswordAsync(this.id);
    }
    title: string;
    id: string;
    datePublished: Date;


}
export var crosswordPuzzleDataStore: CrosswordPuzzleDataStore = new FirebaseUserStore();

