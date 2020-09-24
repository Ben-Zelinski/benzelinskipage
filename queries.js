const { Pool } = require('pg');

const pool = new Pool({
  user: 'bziggz',
  host: 'localhost',
  database: 'git_activity',
  password: 'bziggz',
  port: 5432,
});

const psqlRepo = (mongodoc) => {
  console.log(mongodoc);
};

const psqlCommit = (mongodoc) => {
  console.log(mongodoc);
};

const psqlPush = (mongodoc) => {
  console.log(mongodoc);
};

module.exports = {
  psqlRepo,
  psqlCommit,
  psqlPush
};