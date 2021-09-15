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
var cors = require('cors')
const helmet = require("helmet");
const {
  dbConnect
} = require('./utils/dbConnect');
const auth = require('./utils/auth');
const {
  sessionPOST
} = require('./Controllers/sessions.controller');
const {
  usersCreatePOST,
  usersGET,
  usersGETById,
  usersDeleteById
} = require('./Controllers/users.controller');

require('./models/users');
require('./utils/passport');
const port = 8080;

const app = express();
app.use(cors())
app.use(helmet());
app.use(express.json())




app.get('/articles', articlesGET);
app.get('/articles/:id', articlesGETId);
app.post('/articles', auth.checkToken, auth.checkAdminRoles, articlesPOST);
app.patch('/articles/:id', articlesPATCHId);
app.put('/articles/:id', auth.checkToken, auth.checkAdminRoles, articlesPUT);
app.delete('/articles/:id', auth.checkToken, auth.checkAdminRoles, articlesDELETE)


app.get('/authors', authorsGET);
app.get('/authors/:id', authorsGETId);
app.post('/authors', auth.checkToken, auth.checkAdminRoles, authorsPOST);
app.patch('/authors/:id', authorsPATCHId);
app.put('/authors/:id', auth.checkToken, auth.checkAdminRoles, authorsPUT);
app.delete('/authors/:id', auth.checkToken, auth.checkAdminRoles, authorsDELETE);

app.post('/sessions', sessionPOST)

app.get('/users', usersGET)
app.post('/users/', auth.checkToken, auth.checkAdminRoles, usersCreatePOST)
app.get('/users/:id', usersGETById)
app.delete('/users/:id', auth.checkToken, auth.checkAdminRoles, usersDeleteById)


dbConnect()
  .then(() => {
    app.listen(port, () => console.log(`NodeJs server listening port ${port}`))
  });