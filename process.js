/* eslint-disable no-undef */

const fs = require('fs')
const { lectura_schema } = require('./validations/lectura_archivos.validation')

const validation = async (fileLocaltion) => {
  try {
    const data = fs.readFileSync(__dirname + fileLocaltion , 'utf8')
    const response = await lectura_schema.validate(JSON.parse(data))

    if(response.error){
      throw new Error(response.error)
    }
    console.log('response', response)
  } catch (err) {
    console.error(err)
  }
}

validation('/lectura_validacion_archivos/article.json');