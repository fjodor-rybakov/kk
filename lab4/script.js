const http = require('http');
const request = require('request');
const cheerio = require("cheerio");
const port = 3000;

let requestUrl = "https://vk.com";
const protocolReqUrl = requestUrl.split("/")[0];
const domainReqUrl = requestUrl.split("/")[2];
const templateUrl = /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

const requestHandler = (request, response) => {
    console.log(request.url);
    response.end('Hello Node.js Server!');
};

const createBodyDataHtml = (body) => {
    let dataUrls = [];
    let page = cheerio.load(body);
    page('a').each(function(){
        dataUrls.push({
            url: page(this).attr('href')
        });
    });
    return dataUrls;
};

const restoreUrl = (url) => {
    let valueUrl = url;
    if (valueUrl[0] === "/" && valueUrl[1] === "/") {
        valueUrl = protocolReqUrl + valueUrl;
    } else {
        if (valueUrl[0] === "/") {
            valueUrl = protocolReqUrl + "//" + domainReqUrl + valueUrl;
        } else {
            valueUrl = protocolReqUrl + "//" + domainReqUrl + "/" + valueUrl;
        }
    }
    return valueUrl;
};

const filterUrl = (dataUrls) => {
    const newData = [];
    let valueUrl;
    let tempValue;
    for (let i = 0; i < dataUrls.length; i++) {
        tempValue = dataUrls[i]["url"];

        if (tempValue) {
            if (tempValue.search(templateUrl)) {
                tempValue = restoreUrl(tempValue);
                valueUrl = tempValue.split("/");
            } else {
                valueUrl = tempValue.split("/");
            }

            if (valueUrl[2] === domainReqUrl) {
                newData.push({
                    url: tempValue
                });
            }
        }
    }
    return newData;
};

request(requestUrl, function (error, response, body) {
    if (error) {
        response.send(error);
        console.log('error:', error);
        return;
    }
    console.log('statusCode:', response && response.statusCode);
    // console.log('body:', body);
    console.log("-----------------------------------------------");
    let dataUrls = createBodyDataHtml(body);
    // console.log(cards);
    console.log("-----------------------------------------------");
    const newData = filterUrl(dataUrls);
    // response.send(newData);
    console.log(newData);
});

const server = http.createServer(requestHandler);
server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});