/* eslint-disable no-undef */
const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const {v4: uuidv4}= require('uuid');

const authorSchema = new Schema ({
    _id: {
        type: String, default: function genUUID() {
            return uuidv4()
        }
    },
    name: {
        type: String,
    },
    articles: {
        type: Array,
    },

});

const Authors = mongoose.model('author', authorSchema);

module.exports = { Authors }
