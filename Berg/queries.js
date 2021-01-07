const { Pool } = require('pg');

const pool = new Pool({
  user: 'bziggz',
  host: 'localhost',
  database: 'git_activity',
  password: 'bziggz',
  port: 5432,
});

const createRecord = (table, ...columns) => {
  pool.query('INSERT INTO $1 ()')
}

const psqlRepo = (mongodoc) => {
  mongodoc.forEach((item) => {
    pool.query('INSERT INTO repos (document_id, received_at, repo_name) VALUES ($1, $2, $3)', [item.id, item.updated_at, item.repo]);
    const repoID = pool.query('SELECT id FROM repos WHERE repos.name = $1', [item.repo]);
    pool.query('INSERT INTO repo_histories (repo_id, received_at, action) VALUES ($1, $2, $3)', [repoID, item.updated_at, item.action]);
  });
};

const psqlCommit = (mongodoc, push) => {
  mongodoc.forEach((item) => {
    const pushID = pool.query('SELECT id FROM pushes WHERE pushes.document_id = $1', push);
    const repoID = pool.query('SELECT id FROM repos WHERE repos.name = $1', [item.repo]);
    pool.query('INSERT INTO commits (document_id, received_at, repo_id, push_id) VALUES ($1, $2, $3, $4)', [item.id, item.committed_at, repoID, pushID]);
  });
};

const psqlPush = (mongodoc) => {
  mongodoc.forEach((item) => {
    const repoID = pool.query('SELECT id FROM repos WHERE repos.name = $1', [item.repo]);
    pool.query('INSERT INTO commits (document_id, received_at, repo_id) VALUES ($1, $2, $3)', [item.id, item.committed_at, repoID]);
  });
};

module.exports = {
  psqlRepo,
  psqlCommit,
  psqlPush,
};
