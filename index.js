const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;

const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlEncoded({ extended: false }));
app.use(bodyParser.json());

app.get('/git_activity', (req, res) => {
  res.status(202).send('Hello');
})

// Github Activity Webhook
app.post('/git_activity', async (req, res) => {
  res.status(202).send();
  await MongoClient.connect('mongodb://localhost:27017/git_activity');
    (err, client) => {
      if (err) throw err;

      const db = client.db('git_activity');
      const body = req.body;
      
      if (body.comment) {
        db.collection('commits').insert({
          repo: body.repository.full_name,
          sender: body.sender.login,
          created_at: body.comment.created_at,
          comment: body.comment.body,
        });
      } else if (body.pusher) {
        db.collection('pushes').insert({
          repo: body.repository.full_name,
          pusher: body.pusher.name,
          pushed_at: body.repository.updated_at,
          commits: body.commits,
        });
      } else {
        db.collection('repos').insert({
          repo: body.repository.full_name,
          sender: body.sender.login,
          updated_at: body.repository.updated_at,
          action: body.action,
        });
      }
      console.log(db.repos[0], db.pushes[0], db.commits[0]);
    }
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