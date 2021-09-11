/* eslint-disable no-undef */
const Joi = require('joi');

exports.autores_schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .required(),
    articles: Joi.array()
        .items(Joi.string())

})

exports.nameSchema = Joi.string()
    .min(3)
    .max(255)
    .required();


exports.articlesSchema = Joi.array()
    .items(Joi.string());