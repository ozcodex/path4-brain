const express = require("express");
const cors = require('cors');
const db = require('./db.js')
const app = express();

const port = 8080;

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
