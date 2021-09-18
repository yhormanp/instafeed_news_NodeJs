/* eslint-disable no-undef */
const {
  Authors
} = require("../models/authors");
const logger = require("../utils/logger");

exports.getAuthorById = async (id) => {
  logger.info('get author by id requested');
  try {
    let filter = {};
    if (id !== undefined) {
      filter._id = id;
    }
    const results = await Authors.find(filter);
    return results
  } catch (error) {
    logger.info('error while getting authors', error)
  }
}

exports.getAuthorByName = async (author) => {
  logger.info('get author by name requested');
  try {
    const existentAuthor = await Authors.find({
      name: author.name
    });

    if (existentAuthor && existentAuthor.length > 0) {
      return {
        error: true,
        message: 'The author already exists',
        author: existentAuthor[0]
      };
    } else {
      return {
        error: false,
        author: null
      }
    }
  } catch (error) {
    logger.info('error while getting authors', error)
    throw Error(err);
  }
}


exports.saveAuthor = async (author) => {
  logger.info('save author requested');
  // validate if the Author already exists
  const existentAuthor = await Authors.find({
    name: author.name
  });
  if (existentAuthor && existentAuthor.length > 0) {
    return {
      error: true,
      message: 'The author already exists',
      author: existentAuthor
    };
  } else {
    const newAuthor = new Authors(author);
    logger.info('author to be saved', author);
    return await newAuthor.save()
      .then((result) => {
        logger.info('the Author has been saved ', result);
        return {
          error: false,
          author: result
        };
      })
      .catch((err) => {
        logger.info('error saving the Author data: ', err)
        throw Error(err);
      })
  }
}

exports.removeArticlesInAuthor = async (authorId, existentElement) => {
  logger.info('remove articles in Author requested');
  return await Authors.updateMany({
    "_id": authorId
  }, {
    $pull: {
      articles: {
        // $in: existentElement
        $in: [existentElement]
      }
    }
  })
}

exports.addArticlesInAuthor = async (authorId, newElement) => {
  logger.info('add articles in  author requested');
  return await Authors.updateOne({
    "_id": authorId
  }, {
    $addToSet: {
      articles: {
        $each: newElement
      }
    },
    new: true
  });
}


exports.updateAuthor = async (id, author) => {
  logger.info('update author requested');
  return await Authors.findByIdAndUpdate({
      _id: id
    }, author, {
      new: true
    })
    .then((result) => {
      logger.info('the author has been updated ', result);
      return {
        status: true,
        author: result
      };
    })
    .catch((err) => {
      logger.info('error updating the author data: ', err)
      throw Error(err);
    })
}


exports.deleteAuthor = async (id) => {
  logger.info('delete author requested');
  // find the article
  const authors = await Authors.find({
    _id: id
  });
  logger.info('authors found to be deletd', authors);
  if (authors && authors.length > 0) {
    articleId = authors[0]._id
    return await Authors.findByIdAndDelete({
        _id: id
      })
      .then((result) => {
        logger.info('the Author has been deleted ', result);
        return true;
      })
      .catch((err) => {
        logger.info('error deleting the Author data: ', err)
        throw Error(err);
      })
  } else {
    return false;
  }

}