﻿import * as firebase from 'firebase'
var appToExport = firebase.initializeApp({
    apiKey: "AIzaSyBHE9S_e2-OeQ1_2_MY_heKj1Ex0Yh-j-Y",
    databaseURL: "https://react-sun-crossword.firebaseio.com/",
});

export var auth = appToExport.auth();
export var database = appToExport.database();
export var app = appToExport;
