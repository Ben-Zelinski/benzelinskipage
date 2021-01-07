const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const fs = require("fs");

require('dotenv').config();
const port = process.env.PORT;
const host = process.env.HOST;
const dbURL = process.env.DATABASE_URL;

const TimeAgo = require("javascript-time-ago");
const en = require("javascript-time-ago/locale/en");
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const app = express();

//app.set('views', './views');
//app.set('view engine', 'pug');

//app.use(express.static('views'));
app.use(express.static('.'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Get data from commit database
app.get("/", async (req, res) => {
  let documents = [];
  const client = new MongoClient(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    documents = await client
      .db("git_activity")
      .collection("commits")
      .find()
      .sort({ $natural: -1 })
      .limit(5)
      .toArray();
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }

  res.render('index', { documents, timeAgo });
});

// Endpoint for github webhook
app.post("/git_activity", async (req, res) => {
    const client = new MongoClient(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const jsonObj = req.body;
  const { repository, sender } = jsonObj;

  if (!repository.private && jsonObj.commits) {
    const data = {
      repo: repository.name,
      repoPath: repository.full_name,
      repoUrl: repository.html_url,
      senderAvatar: sender.avatar_url,
      senderUrl: sender.html_url,
      commits: jsonObj.commits,
    };

    const commits = data.commits.filter(
      (commit) => commit.committer.name === "Benjamin Zelinski"
    );

    if (commits.length > 0) {
      data.commits = commits;

      try {
        await client.connect();
        await client.db('git_activity').collection('commits').insertOne(data);
      } catch (e) {
        console.log(e);
      } finally {
        await client.close();
      }
    }
  }
  res.status(202).send();
});

// Error handler
app.use((err, req, res, _next) => {
  console.log("Error");
  res.status(404).send("There has been an error. Oops!");
});

// Listener
app.listen(port, host, () => {
  console.log(`benzelinski.com is listening on port ${port} of ${host}!`);
});