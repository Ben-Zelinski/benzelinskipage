const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/git_activity', (req, res) => {
  res.status(202).send('Hello');
})

// Github Activity Webhook
app.post('/git_activity', (req, res) => {
  fs.writeFileSync('git_activity.json', JSON.stringify(req.body));
  res.status(200).send();
});

// Error handler
app.use((err, req, res, _next) => {
  console.log(err); // Writes more extensive information to the console log
  res.status(404).send(err.message);
});

// Listener
app.listen(port, () => {
  console.log(`Your app is up and running! Get some!`);
});