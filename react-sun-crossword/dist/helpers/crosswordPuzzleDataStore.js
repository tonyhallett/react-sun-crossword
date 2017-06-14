"use strict";
var firebaseApp_1 = require("./firebaseApp");
var FirebaseUserStore = (function () {
    function FirebaseUserStore() {
    }
    FirebaseUserStore.prototype.saveCrosswordAsync = function (crossword) {
        return new Promise(function (resolve, reject) {
            var lookupJson = { id: crossword.id, datePublished: crossword.datePublished, title: crossword.title };
            //should be done as a transaction 
            //if offline and not bothering waiting - what do you do when there is an error ?!
            console.log("In user store save crossword Promise");
            firebaseApp_1.database.ref('users/' + firebaseApp_1.auth.currentUser.uid + '/crosswords/' + crossword.id).set(crossword).then(function () {
                console.log("Saved user crossword");
                firebaseApp_1.database.ref('users/' + firebaseApp_1.auth.currentUser.uid + '/crosswordLookups/' + lookupJson.id).set(lookupJson).then(function (err) {
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
    };
    FirebaseUserStore.prototype.getDetailsAsync = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            var connectedRef = firebaseApp_1.database.ref(".info/connected");
            connectedRef.on("value", function (snap) {
                if (snap.val() === true) {
                    var lookupsPath = "users/" + firebaseApp_1.auth.currentUser.uid + "/crosswordLookups";
                    var lookups = firebaseApp_1.database.ref(lookupsPath);
                    //https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot
                    lookups.once('value').then(function (snapshot) {
                        var details = [];
                        snapshot.forEach(function (childSnapshot) {
                            var childKey = childSnapshot.key;
                            var childData = childSnapshot.val();
                            details.push(new FirebaseUserStoreChooseDetail(self, childData.title, childData.id, childData.datePublished));
                            return false;
                        });
                        resolve(details);
                    }).catch(function (err) {
                        //do something 
                        console.log("Error getting details");
                        reject(err);
                    });
                }
                else {
                    reject({ message: "Not connected" });
                }
            });
        });
    };
    FirebaseUserStore.prototype.getCrosswordAsync = function (id) {
        console.log("Getting user crossword");
        return new Promise(function (resolve, reject) {
            var connectedRef = firebaseApp_1.database.ref(".info/connected");
            connectedRef.on("value", function (snap) {
                if (snap.val() === true) {
                    firebaseApp_1.database.ref("users/" + firebaseApp_1.auth.currentUser.uid + "/crosswords/" + id).once("value").then(function (snapshot) {
                        var crossword = snapshot.val();
                        console.log("user crossword downloaded");
                        resolve(crossword);
                    }).catch(function (err) {
                        //do something
                        console.log("Error getting crossword ");
                        reject(err);
                    });
                }
                else {
                    reject({ message: "Not connected" });
                }
            });
        });
    };
    return FirebaseUserStore;
}());
//same as for public store apart from bool inStore - refactor to import and remove this
var FirebaseUserStoreChooseDetail = (function () {
    function FirebaseUserStoreChooseDetail(store, title, id, datePublished) {
        this.inStore = true;
        this.title = title;
        this.id = id;
        this.datePublished = new Date(datePublished);
        this.store = store;
    }
    FirebaseUserStoreChooseDetail.prototype.getAsync = function () {
        return this.store.getCrosswordAsync(this.id);
    };
    return FirebaseUserStoreChooseDetail;
}());
exports.crosswordPuzzleDataStore = new FirebaseUserStore();
//# sourceMappingURL=crosswordPuzzleDataStore.js.map