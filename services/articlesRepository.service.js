/* eslint-disable no-undef */
const Articles = require('../models/articles');


exports.getArticles = async (id) => {
  try {
    console.log('getting articles')
    let filter = {};
    console.log('validate id', id);
    if (id !== undefined) {
      filter.id = id;
    }
    const results = await Articles.find(filter);
    return results
  } catch (error) {
    console.log('error while getting articles', error)
  }

}