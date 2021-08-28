/* eslint-disable no-undef */
const express = require('express');
const {
  validateArticleSchema
} = require('./process');
const {
  getArticles
} = require('./services/articlesRepository.service');
const {
  dbConnect
} = require('./utils/dbConnect');
const app = express();
const port = 8080;
let dataInMemory = [];

app.use(express.json())

app.get('/articles', async (req, res) => {
  const listOfArticles = await getArticles();
  if (listOfArticles && listOfArticles.length > 0) {
    res.status(201).send(listOfArticles);
  } else {
    res.status(201).send('There is not article to be shown');
  }
})

app.get('/articles/:id', async (req, res) => {
      const idParam = req.params.id ? req.params.id : null;
      console.log(idParam);
      const listOfArticles = await getArticles(idParam);
      if (listOfArticles.length > 0) {
        res.status(201).send(listOfArticles);
      } else {
        res.status(201).send('There is not article to be shown');
      }
    })

    app.post('/articles', (req, res) => {
      const {
        id,
        title,
        author,
        modifiedAt,
        publishedAt,
        url,
        keywords,
        readMins,
        source
      } = req.body;

      const newArticle = {
        id,
        title,
        author,
        modifiedAt,
        publishedAt,
        url,
        keywords,
        readMins,
        source
      }

      validateArticleSchema(JSON.stringify(newArticle), (error, results) => {
        if (error) {
          res.status(400).send(error);
        } else if (results) {
          dataInMemory.push(newArticle);
          res.status(201).send(results);
        }
      });
      res.send('received');
    })

    dbConnect()
    .then(() => {
      getArticles().then((results) => {
        dataInMemory = results; 
        app.listen(port, () => console.log(`NodeJs server listening port ${port}`))
      });
      
    });