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
  saveAuthor,
  getAuthorByName,
  addArticlesInAuthor,
  removeArticlesInAuthor
} = require("../services/authorsRepository.service");
const {
  lectura_schema
} = require("../validations/lectura_archivos.validation");
// const {
//   deleteArticleFromAuthorArticlesList
// } = require("./authors.controller");

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


  // update the articles property in the author object, only if it already exists
  const responseProcessAuthor = await addArticleInAuthor({
    name: req.body.author,
    articles: [req.body.id]
  }, )

  console.log('response per author', responseProcessAuthor);
  if (responseProcessAuthor.error) {
    res.status(400).send(responseProcessAuthor.message);
  } else {
    newArticle.author = responseProcessAuthor.author._id
    const response = lectura_schema.validate(newArticle);
    if (response.error) {
      res.status(400).send(response.error);
    } else {
      await saveArticle(newArticle);
      res.status(201).send('the article has been saved');
    }
  }
};


const addArticleInAuthor = async (author) => {
  // validate if the author exist
  const getAuthorResponse = await getAuthorByName(author);
  console.log('getting author by name', getAuthorResponse);
  if (getAuthorResponse.error) {
    return await addArticlesInAuthor(getAuthorResponse.author._id, author.articles)
      .then(() => {
        return {
          error: false,
          author: getAuthorResponse.author
        };
      })
      .catch((err) => {
        console.log('error updating the Author data: ', err)
        throw Error(err);
      })
  } else {
    // if that author does not exists, then create a new author and return the author Id
    console.log('saving new author', author);
    return await saveAuthor(author)
      .then((authorResult) => {
        return authorResult;
      })
      .catch((err) => {
        console.log('error saving the Author data: ', err)
        throw Error(err);
      })
  }

}



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
  const idParam = req.params.id ? req.params.id : null;
  try {

    const deleteArticleResponse = await deleteArticle(idParam);
    console.log('response received', deleteArticleResponse);
    if (deleteArticle !== null) {
      const removeArticleResponse = removeArticlesInAuthor(deleteArticleResponse.author, idParam);

      Promise.all([removeArticleResponse, deleteArticleResponse])
        .then(() => {
          res.status(204).send('the article has been deleted')
        })
    }

    // const deleteFromAuthorResponse = await deleteArticleFromAuthorArticlesList(deleteArticleResponse);



  } catch (error) {
    res.status(404).send(`Error raised deleting the article ${idParam}, ${error}`)
  }
}



module.exports = {
  articlesGET,
  articlesPOST,
  articlesGETId,
  articlesPATCHId,
  articlesPUT,
  articlesDELETE,

}