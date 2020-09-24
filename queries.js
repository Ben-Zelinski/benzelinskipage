const { Pool } = require('pg');

const pool = new Pool({
  user: 'bziggz',
  host: 'localhost',
  database: 'git_activity',
  password: 'bziggz',
  port: 5432,
});

const psqlRepo = (mongodoc) => {
  mongodoc.forEach((item) => {

  });
};

const psqlCommit = (mongodoc) => {
  mongodoc.forEach((item) => {

  });
};

const psqlPush = (mongodoc) => {
  mongodoc.forEach((item) => {

  });
};

module.exports = {
  psqlRepo,
  psqlCommit,
  psqlPush,
};