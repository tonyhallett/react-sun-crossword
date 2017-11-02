"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebaseApp_1 = require("./firebaseApp");
var FirebaseDatabase = (function () {
    function FirebaseDatabase() {
        this.connectedRef = firebaseApp_1.database.ref(".info/connected");
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
    FirebaseDatabase.prototype.saveUserCrossword = function (uid, id, crossword, crosswordLookup) {
        return new Promise(function (resolve, reject) {
            var updatedUserData = {};
            var users = firebaseApp_1.database.ref('users');
            updatedUserData[uid + '/crosswords/' + id] = crossword;
            updatedUserData[uid + '/crosswordLookups/' + id] = crosswordLookup;
            users.update(updatedUserData).then(function () {
                resolve({ uid: uid, crosswordId: id });
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
    };
    FirebaseDatabase.prototype.getPublicCrossword = function (id) {
        return new Promise(function (resolve, reject) {
            firebaseApp_1.database.ref("crosswords/" + id).once("value").then(function (snapshot) {
                var crossword = snapshot.val();
                resolve(crossword);
            }).catch(function (err) {
                console.log("Error getting public crossword ");
                reject(err);
            });
        });
    };
    FirebaseDatabase.prototype.getUserCrossword = function (uid, id) {
        return new Promise(function (resolve, reject) {
            firebaseApp_1.database.ref("users/" + uid + "/crosswords/" + id).once("value").then(function (snapshot) {
                var crossword = snapshot.val();
                resolve(crossword);
            }).catch(function (err) {
                console.log("Error getting user crossword ");
                reject(err);
            });
        });
    };
    //will need to stop listening for these
    FirebaseDatabase.prototype.listenForUserCrosswordLookups = function (uid, callback) {
        firebaseApp_1.database.ref("users/" + uid + "/crosswordLookups").on('value', function (snapshot) {
            var lookups = [];
            snapshot.forEach(function (ss) {
                lookups.push(ss.val());
                return false;
            });
            callback(lookups);
        });
    };
    FirebaseDatabase.prototype.listenForPublicCrosswordLookups = function (callback) {
        firebaseApp_1.database.ref("crosswordLookups").on('value', function (snapshot) {
            var lookups = [];
            snapshot.forEach(function (ss) {
                lookups.push(ss.val());
                return false;
            });
            callback(lookups);
        });
    };
    FirebaseDatabase.prototype.connectionChanged = function (callback) {
        this.connectionChangedCallback = callback;
        if (this.connected) {
            callback(true);
        }
    };
    return FirebaseDatabase;
}());
exports.connectedDatabase = new FirebaseDatabase();
//# sourceMappingURL=connectedDatabase.js.map