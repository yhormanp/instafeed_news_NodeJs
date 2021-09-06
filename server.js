/* eslint-disable no-undef */
const express = require('express');
const {
  validateArticleSchema,
  validatePropertySchema,
  replaceArticleInMemory
} = require('./process');
const {
  getArticles,
  saveArticle,
  deleteArticle,
  updateArticle
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

app.post('/articles', async (req, res) => {
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

  validateArticleSchema(JSON.stringify(newArticle), async (error, results) => {
    if (error) {
      res.status(400).send(error);
    } else if (results) {
      dataInMemory.push(newArticle);
      await saveArticle(newArticle);
      res.status(201).send('the article has been saved');
    }
  });

});

app.get('/articles/:id', async (req, res) => {
  const idParam = req.params.id ? req.params.id : null;
  const listOfArticles = await getArticles(idParam);
  if (listOfArticles.length > 0) {
    res.status(201).send(listOfArticles);
  } else {
    res.status(201).send('There is not article to be shown');
  }
})

app.patch('/articles/:id', async (req, res) => {
  const idParam = req.params.id ? req.params.id : null;
  validatePropertySchema(req.body, async (error, results) => {
    if (error) {
      res.status(400).send(error);
    } else if (results) {

      const response = await updateArticle(idParam, req.body);
      if (response.status) {
         replaceArticleInMemory(dataInMemory, response.article);
        res.status(200).send(`the article ${idParam} has been updated`)
      } else {
        res.status(404).send(`the article ${idParam} does not exist`)
      }
    }
  });
})

app.put('/articles/:id', async (req, res) => {
  const idParam = req.params.id ? req.params.id : null;
  const newArticle = {
    id: req.body.id,
    title: req.body.title,
    author: req.body.author,
    modifiedAt: req.body.modifiedAt,
    publishedAt: req.body.publishedAt,
    url: req.body.url,
    keywords: req.body.keywords,
    readMins: req.body.readMins,
    source: req.body.source
  }

  validateArticleSchema(JSON.stringify(newArticle), async (error, results) => {
    if (error) {
      res.status(400).send(error);
    } else if (results) {
      const response = await updateArticle(idParam, newArticle);
      console.log('response received', response);
      if (response.status) {
        replaceArticleInMemory(dataInMemory, response.article);
        res.status(200).send(`the article ${idParam} has been updated`)
      } else {
        res.status(404).send(`the article ${idParam} does not exist`)
      }

    }
  });

})



app.delete('/articles/:id', async (req, res) => {
  try {
    const idParam = req.params.id ? req.params.id : null;
    const response = await deleteArticle(idParam);
    console.log('response received', response);
    if (response) {
      res.status(204).send(`the article ${idParam} has been deleted`)
    } else {
      res.status(404).send(`the article ${idParam} does not exist`)
    }
  } catch (error) {
    res.status(404).send(`Error raised deleting the article ${idParam}`)
  }
})


app.get('/test', async (req, res) => {
  res.send(dataInMemory);
})

dbConnect()
  .then(() => {
    getArticles().then((results) => {
      dataInMemory = results;
      app.listen(port, () => console.log(`NodeJs server listening port ${port}`))
    });
  });