/* eslint-disable no-undef */
const http = require("http");
const url = require("url");
const fs = require('fs')

let dataInMemory = [];

const server = http.createServer(function (req, res) {
  let parsedURL = url.parse(req.url, true);
  let path = parsedURL.pathname;
  // parsedURL.pathname  parsedURL.query
  // standardize the requested url by removing any '/' at the start or end
  // '/folder/to/file/' becomes 'folder/to/file'
  path = path.replace(/^\/+|\/+$/g, "");
  let qs = parsedURL.query;
  let headers = req.headers;
  let method = req.method.toLowerCase();

  req.on("data", function () {
    
  });
  req.on("end", function () {
    //request part is finished... we can send a response now
    console.log("send a response");
    let sections = path.split('/');
    let data = {
      path: path,
      id: sections.length > 1 ? sections[1] : 0,
      queryString: qs,
      headers: headers,
      method: method
    };

    //we will use the standardized version of the path
    let route =
      typeof routes[sections[0]] !== "undefined" ? routes[sections[0]] : routes["notFound"];

    //pass data incase we need info about the request
    //pass the response object because router is outside our scope
    route(data, res);
  });
});

server.listen(3001, function () {
  const fileLocaltion = '/db.json'
  let dbData = fs.readFileSync(__dirname + fileLocaltion, 'utf8')
  dataInMemory = [JSON.parse(dbData)];
  console.log("Listening on port 3001");
});

let routes = {
  "articles": function (data, res) {
    // this function called if the path is 'Articles'
    let payloadStr = JSON.stringify(dataInMemory);

    if (data.id !== 0) {
      const recordFound = dataInMemory.find((record) => {
        return record.id === data.id
      });

      if (recordFound) {
        payloadStr = JSON.stringify(recordFound);
      } else {
        payloadStr = "Record not found";
      }
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end("\n");
  }
};