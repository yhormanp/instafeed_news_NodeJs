/* eslint-disable no-undef */
const async = require('async')
const fs = require('fs')
const util = require('util')
const { nameSchema, articlesSchema } = require('./validations/autores.validation')
const {
  lectura_schema,
  idSchema,
  titleSchema,
  authorSchema,
  modifiedAtSchema,
  publishedAtSchema,
  urlSchema,
  keywordsSchema,
  readMinsSchema,
  sourceSchema

} = require('./validations/lectura_archivos.validation')

const validationSync = async (fileLocaltion) => {
  try {
    const data = fs.readFileSync(__dirname + fileLocaltion, 'utf8')
    const response = await lectura_schema.validate(JSON.parse(data))
    if (response.error) {

      // write data in invalid.json 
      appendToAFile("invalid.json", JSON.stringify(response.value) + ",")

    } else {
      // write data in db.json
      appendToAFile("db.json", JSON.stringify(response.value) + ",")
    }
  } catch (err) {
    console.error(err)
  }
}

const asyncValidation = (fileLocaltion) => {

  return function (callback) {
    // getlist of files 
    const readFile = util.promisify(fs.readFile)
    readFile(fileLocaltion).then((fileContent) => {
      // const response = lectura_schema.validate(JSON.parse(fileContent))
      // if (response.error) {
      //   // write data in invalid.json 
      //   appendToAFile("invalid.json", JSON.stringify(response.value) + ",")
      //   callback(response.error, false);
      //   // throw new Error(response.error)
      // } else {
      //   // write data in db.json
      //   appendToAFile("db.json", JSON.stringify(response.value) + ",")
      //   callback(null, true);
      // }
      validateArticleSchema(fileContent, callback);
    }).catch((error) => {
      console.log('error', error)
    })
  }
}

const appendToAFile = async (fileLocation, content) => {

  fs.appendFile(__dirname + "/" + fileLocation, content, err => {
    if (err) {
      console.error(err)
    }
  })
}

exports.validateArticleSchema = (fileContent, callback) => {
  const response = lectura_schema.validate(JSON.parse(fileContent))
  if (response.error) {
    // write data in invalid.json 
    appendToAFile("invalid.json", JSON.stringify(response.value) + ",")
    callback(response.error, false);
    // throw new Error(response.error)
  } else {
    // write data in db.json
    appendToAFile("db.json", JSON.stringify(response.value) + ",")
    callback(null, true);
  }
}

exports.validatePropertySchema = (objectReceived, callback) => {
  console.log('validting property', objectReceived)
  // validae every property sent
  let listOfErrors = [];
  let response = null;
  for (const property in objectReceived) {
    switch (property) {
      case 'id':
        response = idSchema.validate(objectReceived[property]);
        break;
      case 'title':
        response = titleSchema.validate(objectReceived[property]);
        break;
      case 'author':
        response = authorSchema.validate(objectReceived[property]);
        break;
      case 'modifiedAt':
        response = modifiedAtSchema.validate(objectReceived[property]);
        break;
      case 'PublishedAt':
        response = publishedAtSchema.validate(objectReceived[property]);
        break;
      case 'url':
        response = urlSchema.validate(objectReceived[property]);
        break;
      case 'keywords':
        response = keywordsSchema.validate(objectReceived[property]);
        break;
      case 'readMins':
        response = readMinsSchema.validate(objectReceived[property]);
        break;
      case 'source':
        response = sourceSchema.validate(objectReceived[property]);
        break;
    }

    if (response.error) {
      listOfErrors.push({
        status: 'error',
        message: response.error
      });
    }
  }

  if (listOfErrors.length >= 1) {
    callback(listOfErrors, false);
  } else {
    callback(null, true);
  }
}

exports.validatePropertySchemaAuthor = (objectReceived, callback) => {
  // validae every property sent
  let listOfErrors = [];
  let response = null;
  for (const property in objectReceived) {
    switch (property) {
      case 'name':
        response = nameSchema.validate(objectReceived[property]);
        break;
      case 'articles':
        response = articlesSchema.validate(objectReceived[property]);
        break;
    }

    if (response.error) {
      listOfErrors.push({
        status: 'error',
        message: response.error
      });
    }
  }

  if (listOfErrors.length >= 1) {
    callback(listOfErrors, false);
  } else {
    callback(null, true);
  }
}

exports.replaceArticleInMemory = (datainMemory, articleUpdated) => {
  console.log('checking datainMemory', datainMemory, articleUpdated);
  const articleIndex = datainMemory.findIndex((article) => {
    console.log('values', article._id.toString(), articleUpdated._id.toString())
    return article._id.toString() === articleUpdated._id.toString()
  });
  console.log('checking article index', articleIndex);
  if( articleIndex !== -1){
    datainMemory[articleIndex] = articleUpdated;
  }
}

exports.validateSeveralFiles = async (folderWithArticles) => {
  try {
    // getlist of files  files
    const readDir = util.promisify(fs.readdir)
    const listOfFiles = await readDir(folderWithArticles)

    const functionsToExecute = [];

    listOfFiles.forEach(element => {
      functionsToExecute.push(asyncValidation(`./articles/${element}`));
    });

    async.parallel(functionsToExecute, (err, results) => {
      console.log('errors found', err);
      console.log('results found', results);
    })
  } catch (error) {
    console.error(error)
  }
}

// validation('/lectura_validacion_archivos/article.json');
// validateSeveralFiles('./articles');