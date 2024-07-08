const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: '', 
  database: 'technology_article_db' 
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

app.get('/articles', (req, res) => {
  let sql = 'SELECT * FROM articles';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching articles:', err);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    res.json(results);
  });
});

app.get('/articles/:id', (req, res) => {
  const articleId = req.params.id;
  let sql = 'SELECT * FROM articles WHERE id = ?';
  db.query(sql, [articleId], (err, result) => {
    if (err) {
      console.error('Error fetching article:', err);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    res.json(result[0]);
  });
});

app.post('/articles', (req, res) => {
  let article = req.body;
  let sql = 'INSERT INTO articles SET ?';
  db.query(sql, article, (err, result) => {
    if (err) {
      console.error('Error adding article:', err);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    res.send('Article added...');
  });
});

app.put('/articles/:id', (req, res) => {
  const { id } = req.params;
  const { title, body, image_url } = req.body;
  const sql = 'UPDATE articles SET title = ?, body = ?, image_url = ? WHERE id = ?';
  db.query(sql, [title, body, image_url, id], (err, result) => {
    if (err) {
      console.error('Error updating article:', err);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    res.send({ message: 'Article updated successfully', result });
  });
});

app.delete('/articles/:id', (req, res) => {
  let sql = 'DELETE FROM articles WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting article:', err);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    res.send('Article deleted...');
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
