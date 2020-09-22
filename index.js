const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.json());

// Github Activity Webhook
app.post('/git_activity', (req, res) => {
  console.log(req.body);
  res.status(200).end();
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