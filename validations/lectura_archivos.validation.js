/* eslint-disable no-undef */
const Joi = require('joi');
exports.lectura_schema = Joi.object({
    id: Joi.string()
        .alphanum()
        .min(3)
        .max(36)
        .required(),
    title: Joi.string()
        .alphanum()
        .min(3)
        .max(255),
    author: Joi.string()
        .alphanum()
        .min(3)
        .max(100),
    modifiedAt: Joi.date().less('now'),
    //   .alphanum()
    //   .min(3)
    //   .max(255),
    publishedAt: Joi.date().less('now')
        .allow(null).allow(''),
    url: Joi.string()
        .allow(null).allow(''),
    // .pattern(new RegExp('^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)'))
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