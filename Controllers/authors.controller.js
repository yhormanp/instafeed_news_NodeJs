/* eslint-disable no-undef */
const {
    validatePropertySchemaAuthor
} = require("../process");
const { deleteArticlesByAuthor } = require("../services/articlesRepository.service");
const {
    saveAuthor,
    updateAuthor,
    deleteAuthor,
    getAuthorById
} = require("../services/authorsRepository.service");
const {
    autores_schema
} = require("../validations/autores.validation");


const authorsGET = async (req, res) => {
    const listOfAuthors = await getAuthorById();
    if (listOfAuthors && listOfAuthors.length > 0) {
        res.status(200).send(listOfAuthors);
    } else {
        res.status(200).send('There is not authors to be shown');
    }
}

const authorsPOST = async (req, res) => {

    const newAuthor = {
        name: req.body.name,
        articles: req.body.articles
    }

    const response = autores_schema.validate(newAuthor);
    if (response.error) {
        res.status(400).send(response.error);
    } else {
        const responseSaveAuthor = await saveAuthor(newAuthor);
        if (responseSaveAuthor.error) {
            res.status(400).send(responseSaveAuthor.message);
        } else {
            res.status(201).send('the author has been saved');
        }

    }
};


const authorsGETId = async (req, res) => {
    const idParam = req.params.id ? req.params.id : null;
    const listOfAuthors = await getAuthorById(idParam);
    if (listOfAuthors.length > 0) {
        res.status(200).send(listOfAuthors);
    } else {
        res.status(200).send('There is not author to be shown');
    }
}

const authorsPATCHId = async (req, res) => {
    const idParam = req.params.id ? req.params.id : null;
    validatePropertySchemaAuthor(req.body, async (error, results) => {
        if (error) {
            res.status(400).send(error);
        } else if (results) {

            const response = await updateAuthor(idParam, req.body);
            if (response.status) {
                // replaceArticleInMemory(dataInMemory, response.article);
                res.status(200).send(`the article ${idParam} has been updated`)
            } else {
                res.status(404).send(`the article ${idParam} does not exist`)
            }
        }
    });
};



const authorsPUT = async (req, res) => {
    const idParam = req.params.id ? req.params.id : null;
    const newAuthor = {
        name: req.body.name,
        articles: req.body.articles
    }

    const response = autores_schema.validate(newAuthor);
    if (response.error) {
        res.status(400).send(error);
    } else {
        const response = await updateAuthor(idParam, newAuthor);
        console.log('response received', response);
        if (response.status) {
            // replaceArticleInMemory(dataInMemory, response.article);
            res.status(200).send(`the author ${idParam} has been updated`)
        } else {
            res.status(404).send(`the author ${idParam} does not exist`)
        }
    }
}



const authorsDELETE = async (req, res) => {
    const idParam = req.params.id ? req.params.id : null;
    try {
        const authorDeletionResponse = await deleteAuthor(idParam);
        // borrar todos los articulos asociados
        const articlesDeletionReponse = await deleteArticlesByAuthor(idParam);

        Promise.all([authorDeletionResponse, articlesDeletionReponse])
        .then(() => {
            res.status(204).send(`the author ${idParam} has been deleted`)
        })
        .catch((error) => {
            res.status(404).send(`Error raised deleting the author ${idParam}, ${error}`)
        })

    } catch (error) {
        res.status(404).send(`Error raised deleting the author ${idParam}, ${error}`)
    }
}



    module.exports = {
    authorsGET,
    authorsPOST,
    authorsGETId,
    authorsPATCHId,
    authorsPUT,
    authorsDELETE
}