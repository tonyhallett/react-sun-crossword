"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require("firebase");
var appToExport = firebase.initializeApp({
    apiKey: "AIzaSyBHE9S_e2-OeQ1_2_MY_heKj1Ex0Yh-j-Y",
    databaseURL: "https://react-sun-crossword.firebaseio.com/",
});
exports.auth = appToExport.auth();
exports.database = appToExport.database();
exports.app = appToExport;
//# sourceMappingURL=firebaseApp.js.map