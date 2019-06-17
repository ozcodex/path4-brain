const express = require("express");
const cors = require('cors');
const fetch = require('node-fetch');
const db = require('./db.js').db
const firebase = require('firebase/app');
const storage = require('./db.js').files;
var md5 = require('md5');
const app = express();
const port = 8084;

app.use(cors());

app.get('/hello', function (req, res) {
  res.json({ message: 'Hello Nerds' })
});

app.get('/random', function (req, res) {
  db.collection('messages').get()
    .then(snapshot => {
      let rand_pos = Math.floor(Math.random() * snapshot.size);
      let word = snapshot.docs[rand_pos].data();
      // this object has this structure:
      // { text: string }
      res.json(word);
    })
      .catch(err => {
      console.log('Error getting collection messages in /random', err);
    });
});

app.listen(port, () => {
 console.log("The API is running on port " + port);
});

// setInterval(function(){ console.log("hi")},1000);

// Global Variables
var uploadedImagesDB = []
var lastImageMd5Hash = 'dsadsad'
// Every 20 secs fetch the new image
setInterval(saveImgtoGcloud, 5 * 1000); // sec * milli
// Delete old images to save space on gCloud
setInterval(deleteOldImages, 1 * 60 * 1000); // min * sec * milli

// Promise error catch function
const catcher = (e) => {
  console.log('I have  this error in a Promise:',e);
  reset();
}

function reset(){
  lastImageMd5Hash = 'dasdasd';
}

function saveImgtoGcloud(){

  // Camera URL
  const url = 'https://us-central1-core-228912.cloudfunctions.net/raspberry-pi-a7?apiKey=MFDW!!HQ_!CCPK?Q?QJEGAKQ!ENFM%3C%3E(XGQ}BXAMM%3CQ:'
  
  // Create a root reference
  var storageRef = storage.ref();
  var date = new Date(); 
  var time = date.getTime();
  var uid =  'img'+time +'.jpeg';
  var ftime = firebase.firestore.Timestamp.fromDate(date);
  // Create a reference to the created uid(location of bucket in firestore)
  var ref = storageRef.child(uid);
  fetch(url)
  .then(res => res.arrayBuffer())
  // Gets the response and returns it as a arrayBuffer()
  .then(blob=> {
    // Here's where you get access to the blob
    // And you can use it for whatever you want
    // Like calling ref().put(blob)
    var aa = new Uint8Array(blob)

    // check if new image or not
    var md5Hash = md5(aa);
    if (lastImageMd5Hash == md5Hash) {
      console.log("Same image, ignoring!")
      return;
    }

    lastImageMd5Hash = md5Hash;
    console.log("!!!!!!!New image, Updating!!!!!!")

    // Create file metadata to update
    var newMetadata = {
      cacheControl: 'public',
      contentType: 'image/jpeg'
    }
    const urlb2 = 'https://eyes-dot-project-path4.appspot.com/rcnn/countpeople'
    postData(urlb2, aa,uid,ftime).catch(catcher).then(function(res){
      ref.put(aa,newMetadata).then(function(snapshot) {
        console.log('Uploaded new image!');
        inserData(res,uid,ftime);

        uploadedImagesDB.push({
          name: uid,
          uploadedAt: (new Date()).getTime()
        });
      }).catch(catcher);
    });    
  }).catch(catcher);
}

function postData(url,data,uid,ftime){
  return fetch(url,{
    method:'POST',
    mode:'cors',
    headers:{
      'x-api-key': '881a0268-87fa-42a0-a83a-4f70d209636f',
    },
    body: data,
  })
  .then(res=>res.json())  
}

function inserData(data,uid,fftime){
  console.log('Inserting new update to DB!');
  var docRef = db.collection('images').doc(uid);
  var setAda = docRef.set({
    counter:data["totalCount"],
    filename:uid,
    time:fftime
  })
}

function deleteOldImages() {
  console.log("Deleting old images. possible images to delete: " + uploadedImagesDB.length);

  for (i=0; i < uploadedImagesDB.length; i++) {
    var imgObj = uploadedImagesDB.shift();
    if ((new Date()).getTime() - imgObj.uploadedAt > 2*60*1000) {
      var storageRef = storage.ref();
      var desertRef = storageRef.child(imgObj.name);
      
      desertRef.delete().then(function() {
        // File deleted successfully
        console.log("Deleted image: " + imgObj.name);
      }).catch(catcher);
    }
    else {
      uploadedImagesDB.push(imgObj);
    }
  }
}

