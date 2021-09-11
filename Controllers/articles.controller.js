/* eslint-disable no-undef */
const {
  validatePropertySchema
} = require("../process");
const {
  getArticles,
  saveArticle,
  updateArticle,
  deleteArticle
} = require("../services/articlesRepository.service");
const {
  saveAuthor
} = require("../services/authorsRepository.service");
const {
  lectura_schema
} = require("../validations/lectura_archivos.validation");

const articlesGET = async (req, res) => {
  const listOfArticles = await getArticles();
  if (listOfArticles && listOfArticles.length > 0) {
    res.status(201).send(listOfArticles);
  } else {
    res.status(201).send('There is not article to be shown');
  }
}

const articlesPOST = async (req, res) => {

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

  // first create the author and obtain the ID
  const authorResponse = await saveAuthor({
    name: req.body.author
  });
  if (authorResponse.error) {
    res.status(400).send(authorResponse.message);
  } else {
    newArticle.author = authorResponse.author._id
    const response = lectura_schema.validate(newArticle);
    if (response.error) {
      res.status(400).send(response.error);
    } else {
      await saveArticle(newArticle);
      res.status(201).send('the article has been saved');
    }
  }
};


const articlesGETId = async (req, res) => {
  const idParam = req.params.id ? req.params.id : null;
  const listOfArticles = await getArticles(idParam);
  if (listOfArticles.length > 0) {
    res.status(201).send(listOfArticles);
  } else {
    res.status(201).send('There is not article to be shown');
  }
}

const articlesPATCHId = async (req, res) => {
  const idParam = req.params.id ? req.params.id : null;
  validatePropertySchema(req.body, async (error, results) => {
    if (error) {
      res.status(400).send(error);
    } else if (results) {

      const response = await updateArticle(idParam, req.body);
      if (response.status) {
        // replaceArticleInMemory(dataInMemory, response.article);
        res.status(200).send(`the article ${idParam} has been updated`)
      } else {
        res.status(404).send(`the article ${idParam} does not exist`)
      }
    }
  });
};



const articlesPUT = async (req, res) => {
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

  const response = lectura_schema.validate(newArticle);
  if (response.error) {
    res.status(400).send(response.error);
  } else {
    const response = await updateArticle(idParam, newArticle);
    console.log('response received', response);
    if (response.status) {
      // replaceArticleInMemory(dataInMemory, response.article);
      res.status(200).send(`the article ${idParam} has been updated`)
    } else {
      res.status(404).send(`the article ${idParam} does not exist`)
    }
  }
}


const articlesDELETE = async (req, res) => {
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
}



module.exports = {
  articlesGET,
  articlesPOST,
  articlesGETId,
  articlesPATCHId,
  articlesPUT,
  articlesDELETE
}