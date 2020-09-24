const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();

const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/git_activity', (req, res) => {
  res.status(202).send('Hello');
});

// Github Activity Webhook
app.post('/git_activity', (req, res) => {
  res.status(202).send();

  MongoClient.connect('mongodb://localhost:27017/git_activity',
    (err, client) => {
      if (err) throw err;

      const db = client.db('git_activity');
      const { body } = req;

      if (body.pusher) {
        db.collection('pushes').insertOne({
          repo: body.repository.full_name,
          pusher: body.pusher.name,
          pushed_at: body.repository.updated_at,
        });

        body.commits.forEach((commit) => {
          db.collection('commits').insertOne({
            repo: body.repository.full_name,
            committer: commit.committer.name,
            message: commit.message,
            modified: commit.modified,
            commited_at: commit.timestamp,
          });
        });
      } else {
        db.collection('repos').insertOne({
          repo: body.repository.full_name,
          sender: body.sender.login,
          updated_at: body.repository.updated_at,
          action: body.action,
        });
      }
    });
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