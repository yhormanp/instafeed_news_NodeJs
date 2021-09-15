/* eslint-disable no-undef */
const express = require('express');
const {
  articlesGET,
  articlesPOST,
  articlesGETId,
  articlesPUT,
  articlesPATCHId,
  articlesDELETE
} = require('./Controllers/articles.controller');
const {
  authorsGET,
  authorsGETId,
  authorsPOST,
  authorsPATCHId,
  authorsPUT,
  authorsDELETE
} = require('./Controllers/authors.controller');

const {
  dbConnect
} = require('./utils/dbConnect');
const app = express();
const port = 8080;

app.use(express.json())
app.get('/articles', articlesGET);
app.get('/articles/:id', articlesGETId);
app.post('/articles', articlesPOST);
app.patch('/articles/:id', articlesPATCHId);
app.put('/articles/:id', articlesPUT);
app.delete('/articles/:id', articlesDELETE)


app.get('/authors', authorsGET);
app.get('/authors/:id', authorsGETId);
app.post('/authors', authorsPOST);
app.patch('/authors/:id', authorsPATCHId);
app.put('/authors/:id', authorsPUT);
app.delete('/authors/:id', authorsDELETE);

dbConnect()
  .then(() => {
    app.listen(port, () => console.log(`NodeJs server listening port ${port}`))
  });