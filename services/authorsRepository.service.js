/* eslint-disable no-undef */
const {
  Authors
} = require("../models/authors");

exports.getAuthorById = async (id) => {
  try {
    let filter = {};
    if (id !== undefined) {
      filter._id = id;
    }
    const results = await Authors.find(filter);
    return results
  } catch (error) {
    console.log('error while getting authors', error)
  }
}

exports.getAuthorByName = async (author) => {
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
    console.log('error while getting authors', error)
    throw Error(err);
  }
}


exports.saveAuthor = async (author) => {
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
    console.log('author to be saved', author);
    return await newAuthor.save()
      .then((result) => {
        console.log('the Author has been saved ', result);
        return {
          error: false,
          author: result
        };
      })
      .catch((err) => {
        console.log('error saving the Author data: ', err)
        throw Error(err);
      })
  }
}

exports.removeArticlesInAuthor = async (authorId, existentElement) => {
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
  console.log('validating id', id);
  return await Authors.findByIdAndUpdate({
      _id: id
    }, author, {
      new: true
    })
    .then((result) => {
      console.log('the author has been updated ', result);
      return {
        status: true,
        author: result
      };
    })
    .catch((err) => {
      console.log('error updating the author data: ', err)
      throw Error(err);
    })
}


exports.deleteAuthor = async (id) => {
  // find the article
  const authors = await Authors.find({
    _id: id
  });
  console.log('authors found to be deletd', authors);
  if (authors && authors.length > 0) {
    articleId = authors[0]._id
    return await Authors.findByIdAndDelete({
        _id: id
      })
      .then((result) => {
        console.log('the Author has been deleted ', result);
        return true;
      })
      .catch((err) => {
        console.log('error deleting the Author data: ', err)
        throw Error(err);
      })
  } else {
    return false;
  }

}