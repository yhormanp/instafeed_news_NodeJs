/* eslint-disable no-undef */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

exports.dbConnect = async () => {
    mongoose.connection.on('connecting', () =>{
        console.log('connecting to mongodb');
    });

    mongoose.connection.on('connected', () =>{
        console.log('connection to mongodb was stablished successfully');
    });

    try {
        const dbURI = process.env.DATABASE_URI;
        console.log('url database');
        await mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})    
    } catch (error) {
        console.log('mongodb connection failed: ', error);
    }

    
}

