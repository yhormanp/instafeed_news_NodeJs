const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    id: {
        type: String,
    },
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    modifiedAt: {
        type: String,
    },
    publishedAt: {
        type: String,
    },
    url: {
        type: String,
    },
    keywords: {
        type: Array,
    },
    readMins: {
        type: Number
    },
    source: {
        type: String
    }
})

const Articles = mongoose.model('article', articleSchema)

module.exports = Articles;