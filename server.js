/* eslint-disable no-undef */
const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;

app.get('/articles', (req, res) => {
    const fileLocaltion = '/db.json'
    let dbData = fs.readFileSync(__dirname + fileLocaltion, 'utf8')
    console.log('validation', dbData);
    dataInMemory = JSON.parse(`[${dbData.slice(0, dbData.length -1)}]`);
    res.send(dataInMemory);
})

app.get('/articles/:id', (req, res) => {
    const idParam = req.params.id ? req.params.id : 0;
    const fileLocaltion = '/db.json'
    let dbData = fs.readFileSync(__dirname + fileLocaltion, 'utf8')
    dataInMemory = JSON.parse(`[${dbData.slice(0, dbData.length -1)}]`);

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

app.listen(port, () => {
    console.log(`the application is running on the port ${port}`)
})