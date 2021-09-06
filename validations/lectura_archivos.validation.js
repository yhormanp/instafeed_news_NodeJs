/* eslint-disable no-undef */
const Joi = require('joi');
exports.lectura_schema = Joi.object({
    id: Joi.string()
        .alphanum()
        .min(3)
        .max(36)
        .required(),
    title: Joi.string()
        .min(3)
        .max(255),
    author: Joi.string()
        .min(3)
        .max(100),
    modifiedAt: Joi.date().less('now'),
    //   .alphanum()
    //   .min(3)
    //   .max(255),
    publishedAt: Joi.date().less('now')
        .allow(null).allow(''),
    url: Joi.alternatives().conditional('publishedAt', {is: null, then: Joi.string()
        .allow(null).allow(''), otherwise: Joi.string().required()}),
    keywords: Joi.array()
        .items(Joi.string())
        .min(1)
        .max(3),
    readMins: Joi.number()
        .integer()
        .min(1)
        .max(20)
        .required(),
    source: Joi.string().case('upper')
        .valid("ARTICLE", "BLOG", "TWEET", "NEWSPAPER")
        .required()
})

exports.idSchema = Joi.string()
.alphanum()
.min(3)
.max(36)
.required();

exports.titleSchema = Joi.string()
.min(3)
.max(255);

exports.authorSchema = Joi.string()
.min(3)
.max(100);

exports.modifiedAtSchema = Joi.date().less('now');

exports.publishedAtSchema = Joi.date().less('now')
.allow(null).allow('');

exports.urlSchema = Joi.alternatives().conditional('publishedAt', {is: null, then: Joi.string()
    .allow(null).allow(''), otherwise: Joi.string().required()});

exports.keywordsSchema = Joi.array()
.items(Joi.string())
.min(1)
.max(3);

exports.readMinsSchema =  Joi.number()
.integer()
.min(1)
.max(20)
.required();

exports.sourceSchema = Joi.string().case('upper')
.valid("ARTICLE", "BLOG", "TWEET", "NEWSPAPER")
.required();