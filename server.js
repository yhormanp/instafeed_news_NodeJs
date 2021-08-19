/* eslint-disable no-undef */
const express = require('express');
const fs = require('fs');
const {
    validateArticleSchema
} = require('./process');
const app = express();
const port = 8080;
let dataInMemory = [];

app.use(express.json())

app.get('/articles', (req, res) => {
    // const fileLocaltion = '/db.json'
    // let dbData = fs.readFileSync(__dirname + fileLocaltion, 'utf8')
    // console.log('validation', dbData);
    // dataInMemory = JSON.parse(`[${dbData.slice(0, dbData.length -1)}]`);
    res.send(dataInMemory);
})

app.get('/articles/:id', (req, res) => {
    const idParam = req.params.id ? req.params.id : 0;
    // const fileLocaltion = '/db.json'
    // let dbData = fs.readFileSync(__dirname + fileLocaltion, 'utf8')
    // dataInMemory = JSON.parse(`[${dbData.slice(0, dbData.length -1)}]`);

    if (idParam !== 0) {
        const recordFound = dataInMemory.find((record) => {
            return record.id === idParam
        });

        if (recordFound) {
            res.send(recordFound);
        } else {
            res.status(404).send('the id sent does not exists or its invalid')
        }
    } else {
        res.status(404).send('the id sent does not exists or its invalid')
    }

})

app.post('/articles', (req, res) => {
    const {
        id,
        title,
        author,
        modifiedAt,
        publishedAt,
        url,
        keywords,
        readMins,
        source
    } = req.body;

    const newArticle = {
        id,
        title,
        author,
        modifiedAt,
        publishedAt,
        url,
        keywords,
        readMins,
        source
    }

    validateArticleSchema(JSON.stringify(newArticle), (error, results) => {
        if (error) {
            res.status(400).send(error);
        } else if (results) {
            dataInMemory.push(newArticle);
            res.status(201).send(results);
        }
    });
    res.send('received');
})



app.listen(port, () => {
    const fileLocaltion = '/db.json'
    if(fs.existsSync(__dirname + fileLocaltion)){
        let dbData = fs.readFileSync(__dirname + fileLocaltion, 'utf8')
        dataInMemory =  JSON.parse(`[${dbData.slice(0, dbData.length -1)}]`);
        console.log("Listening on port 3001, the db.json file was found");
        console.log(`the application is running on the port ${port}`)
    } else {
        console.log(`The server is runnig but there is not db.json to read`)
    }
   
})