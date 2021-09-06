/* eslint-disable no-undef */
const Articles = require('../models/articles');


exports.getArticles = async (id) => {
  try {
    let filter = {};
    if (id !== undefined) {
      filter.id = id;
    }
    const results = await Articles.find(filter);
    return results
  } catch (error) {
    console.log('error while getting articles', error)
  }

}

exports.saveArticle = async (article) => {

  const newArticle = new Articles(article);
  await newArticle.save()
    .then((result) => {
      console.log('the Article has been saved ', result);
      return true;
    })
    .catch((err) => {
      console.log('error saving the Article data: ', err)
      throw new Error(err);
    })
}

exports.updateArticle = async (id, article) => {
  const articles = await Articles.find({id: id});
  if (articles && articles.length > 0) {
    articleId = articles[0]._id

    return await Articles.findByIdAndUpdate({_id: articleId} , article, {
      new: true 
    }) 
    .then((result) => {
      console.log('the Article has been updated ', result);
      return {status: true, article: result} ;
    })
    .catch((err) => {
      console.log('error updating the Article data: ', err)
      throw new Error(err);
    })
  } else {
    return {status: false} 
  }
  // const articleUpdated = await Articles.findOneAndUpdate({id: id} , article, {
 

}

exports.deleteArticle = async (id) => {
  let filter = {};
  if (id !== undefined) {
    filter.id = id;
  }
  let articleId = null;

  // find the article
  const articles = await Articles.find(filter);
  console.log('articles found to be deletd', articles);
  if (articles && articles.length > 0) {
    articleId = articles[0]._id
    return await Articles.findByIdAndDelete(articleId)
      .then((result) => {
        console.log('the Article has been deleted ', result);
        return true;
      })
      .catch((err) => {
        console.log('error deleting the Article data: ', err)
        throw new Error(err);
      })
  } else {
    return false;
  }

}