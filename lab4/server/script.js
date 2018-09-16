const http = require('http');
const request = require('request');
const staticServer = require('node-static');
const file = new staticServer.Server('./client');
const controller = require("./utils");
const port = 3000;

let requestUrl = "https://vk.com";
const protocolReqUrl = requestUrl.split("/")[0];
const domainReqUrl = requestUrl.split("/")[2];

const requestHandler = (request, response) => {
    console.log(request.url);
    file.serve(request, response);
};

request(requestUrl, function (error, response, body) {
    if (error) {
        response.send(error);
        console.log('error:', error);
        return;
    }
    console.log('statusCode:', response && response.statusCode);
    let dataUrls = controller.createBodyDataHtml(body);
    const newData = controller.filterUrl(dataUrls, protocolReqUrl, domainReqUrl);
    console.log(newData);
});

const server = http.createServer(requestHandler);
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});