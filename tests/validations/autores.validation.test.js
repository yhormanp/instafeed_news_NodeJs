const { autores_schema } = require("../../validations/autores.validation");

test('Given an author object when everything is ok, then it should return a success messge ', () => {

    const author = {
        "name": "yhorman perez",
        "articles": ["abc1"]
        
    }

    const articleExpected = { "value": { ...author} }

    let result = autores_schema.validate(author);

    expect(result).toStrictEqual(articleExpected);
});
