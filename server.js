const express = require("express");
const cors = require('cors');
const fetch = require('node-fetch');
const db = require('./db.js').db
const storage = require('./db.js').files
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

// Promise error catch function
const catcher = (e) => {
  console.log('I have  this error in a Promise:',e)
}

app.listen(port, () => {
 console.log("The API is running on port " + port);
});

// setInterval(function(){ console.log("hi")},1000);

// Every 20 secs fetch the new image
setInterval(saveImgtoGcloud,20000);

function saveImgtoGcloud(){

  // Camera URL
  const url = 'https://us-central1-core-228912.cloudfunctions.net/raspberry-pi-a7?apiKey=MFDW!!HQ_!CCPK?Q?QJEGAKQ!ENFM%3C%3E(XGQ}BXAMM%3CQ:'
  
  // Create a root reference
  var storageRef = storage.ref();
  var date = new Date(); 
  var uid =  'img'+date.getTime() +'.jpeg'

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
    const urlb2 = 'https://eyes-dot-project-path4.appspot.com/countpeople'
    // postData(urlb2,{"img":aa})
    ref.put(aa).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
    }).catch(catcher);
  }).catch(catcher);
  
}

function postData(url ='',data = ''){
  return fetch(url,{
    method:'POST',
    mode:'cors',
    cache:'no-cache',
    credendials:'same-origin',
    headers:{
      'x-api-key': '881a0268-87fa-42a0-a83a-4f70d209636f',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:{"img": data},
  }).then(res=>console.log(res)).catch(catcher);
}



var formData = new FormData();

formData.append('username', 'abc123');

fetch( 'https://eyes-dot-project-path4.appspot.com/countpeople', {
  method: 'PUT',
  body: formData
})
.then(response => response.json())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', JSON.stringify(response)));