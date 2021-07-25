/* eslint-disable no-undef */

const fs = require('fs')
const { lectura_schema } = require('./validations/lectura_archivos.validation')

const validation = async (fileLocaltion) => {
  try {
    const data = fs.readFileSync(__dirname + fileLocaltion , 'utf8')
    const response = await lectura_schema.validate(JSON.parse(data))
    console.log ('response', response.value)
    if(response.error){
      
      // write data in invalid.json 
      appendToAFile("invalid.json", JSON.stringify(response.value) + ",")
      // throw new Error(response.error)

    } else {
      // write data in db.json
      appendToAFile("db.json", JSON.stringify(response.value) + ",")
    }
  } catch (err) {
    console.error(err)
  }
}



const appendToAFile = async (fileLocation, content) => {
  fs.appendFile(__dirname + "/" + fileLocation, content, err => {
    if (err) {
      console.error(err)
    }
  }
  )
}

validation('/lectura_validacion_archivos/article.json');