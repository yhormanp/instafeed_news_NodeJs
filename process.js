/* eslint-disable no-undef */
const async = require('async')
const fs = require('fs')
const util = require('util')
const {
  lectura_schema
} = require('./validations/lectura_archivos.validation')

const validationSync = async (fileLocaltion) => {
  try {
    const data = fs.readFileSync(__dirname + fileLocaltion, 'utf8')
    const response = await lectura_schema.validate(JSON.parse(data))
    console.log('response', response.value)
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



