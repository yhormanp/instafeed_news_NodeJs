/* eslint-disable no-undef */
const { Articles } = require('../models/articles');
const logger = require('../utils/logger');


exports.getArticles = async (id) => {
  try {
    let filter = {};
    if (id !== undefined) {
      filter.id = id;
    }
    logger.info('articles GET requested');
    const results = await Articles.find(filter);
    logger.info('articles GET returned', results);
    return results
  } catch (error) {
    console.log('error while getting articles', error)
  }

}

exports.getArticlesByAuthor = async (authorId) => {
  logger.info('articles By Author requested');
  try {
    const results = await Articles.find({author: authorId})
    logger.info('articles By Author returned');
    return results;
  } catch (error) {
    console.log('error while getting articles by author', error)
  }
}

exports.saveArticle = async (article) => {
  logger.info('Save article requested');
  const newArticle = new Articles(article);
  await newArticle.save()
    .then((result) => {
      logger.info('Article has been saved');
      return true;
    })
    .catch((err) => {
      logger.info('error saving the Article data: ', err);
      throw new Error(err);
    })
}

exports.updateArticle = async (id, article) => {
  logger.info('update article requested');
  const articles = await Articles.find({id: id});
  if (articles && articles.length > 0) {
    articleId = articles[0]._id

    return await Articles.findByIdAndUpdate({_id: articleId} , article, {
      new: true 
    }) 
    .then((result) => {
      console.log('the Article has been updated: ', err)

      return {status: true, article: result} ;
    })
    .catch((err) => {
      logger.info('error updating the Article data: ', err);
      throw new Error(err);
    })
  } else {
    return {status: false} 
  }

}

exports.deleteArticlesByAuthor = async ( authorId) => {
  logger.info('delete article by author requested');
  return await Articles.deleteMany({"author": authorId},
  ).then((result) => {
    logger.info(`the Articles with the author ${authorId} have been deleted `, result);
    return result;
  })
  .catch((err) => {
    logger.info(`Error deleting the Articles with author ${authorId}: `, err)
    throw new Error(err);
  })
}

exports.deleteArticle = async (id) => {
  logger.info('delete article requested');
  let filter = {};
  if (id !== undefined) {
    filter.id = id;
  }
  let articleId = null;

  // find the article
  const articles = await Articles.find(filter);
  logger.info('articles found to be deletd', articles);
  if (articles && articles.length > 0) {
    articleId = articles[0]._id
    return await Articles.findByIdAndDelete(articleId)
      .then((result) => {
        logger.info('the Article has been deleted ', result);
        return result;
      })
      .catch((err) => {
        logger.info('error deleting the Article data: ', err)
        throw new Error(err);
      })
  } else {
    return null;
  }

}