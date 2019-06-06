const storage = require('firebase/storage');
const firebase = require('firebase/app');
const firestore = require('firebase/firestore');
global.XMLHttpRequest = require("xhr2");
const noop = ()=>{};

const firebaseConfig = {
  apiKey: "AIzaSyCxvZl2ki_Zetmkd-F-5R5PSKlY7Q-VFAE",
  authDomain: "project-path4.firebaseapp.com",
  databaseURL: "https://project-path4.firebaseio.com",
  projectId: "project-path4",
  // storageBucket: "project-path4.appspot.com",
  storageBucket:"images-path4",
  messagingSenderId: "574572197316",
  appId: "1:574572197316:web:315283222621ab55"
};

firebase.initializeApp(firebaseConfig);

noop(firestore)
noop(storage)

const db = firebase.firestore();
const files = firebase.storage();

module.exports = {db, files};
