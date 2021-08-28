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