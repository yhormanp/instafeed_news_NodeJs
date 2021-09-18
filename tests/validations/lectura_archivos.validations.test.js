const { lectura_schema } = require("../../validations/lectura_archivos.validation")



test('Given an article object when everything is ok, then it should return a success messge ', () => {
    const article = {
        "id": "abc1",
        "title": "mytitle",
        "author": "authorName",
        "modifiedAt": "07/24/2021",
        "publishedAt": null,
        "url": null,
        "keywords": ["palabra1", "palabra2", "palabra3"],
        "readMins": 20,
        "source": "ARTICLE"
    }

    const articleExpected = { "value": { ...article, modifiedAt: new Date('2021-07-24T05:00:00.000Z') } }

    let result = lectura_schema.validate(article);

    expect(result).toStrictEqual(articleExpected);
});

test('Given an article object when id is not present , then it should return an error message', () => {
    const article = {
        "title": "mytitle",
        "author": "authorName",
        "modifiedAt": "07/24/2021",
        "publishedAt": null,
        "url": null,
        "keywords": ["palabra1", "palabra2", "palabra3"],
        "readMins": 20,
        "source": "ARTICLE"
    }

    const messageExpected = '"id" is required';

    let result = lectura_schema.validate(article);

    expect( result.error.details[0].message).toStrictEqual(messageExpected);
})


test('Given an article object when keywords has no items on it , then it should return an error message', () => {
    const article = {
        "id": "abc2",
        "title": "mytitle",
        "author": "authorName",
        "modifiedAt": "07/24/2021",
        "publishedAt": null,
        "url": null,
        "keywords": [],
        "readMins": 20,
        "source": "ARTICLE"
    }

    const messageExpected = '"keywords" must contain at least 1 items';

    let result = lectura_schema.validate(article);

    expect( result.error.details[0].message).toStrictEqual(messageExpected);
})


test('Given an article object when keywords has no items on it , then it should return an error message', () => {
    const article = {
        "id": "abc2",
        "title": "mytitle",
        "author": "authorName",
        "modifiedAt": "07/24/2021",
        "publishedAt": null,
        "url": null,
        "keywords": [],
        "readMins": 20,
        "source": "ARTICLE"
    }

    const messageExpected = '"keywords" must contain at least 1 items';

    let result = lectura_schema.validate(article);

    expect( result.error.details[0].message).toStrictEqual(messageExpected);
})



test('Given an article object when source is not an allowed value, then it should return an error message', () => {
    const article = {
        "id": "abc2",
        "title": "mytitle",
        "author": "authorName",
        "modifiedAt": "07/24/2021",
        "publishedAt": null,
        "url": null,
        "keywords": ["palabra1"],
        "readMins": 20,
        "source": "GOYA"
    }

    const messageExpected = '"source" must be one of [ARTICLE, BLOG, TWEET, NEWSPAPER]';

    let result = lectura_schema.validate(article);

    expect( result.error.details[0].message).toStrictEqual(messageExpected);
})
