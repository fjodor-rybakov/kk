const rq = require('request'),
    controller = require("../utils",
    errors = require('restify-errors'));

module.exports = (server) => {
    server.post("/get_data_urls", (request, response, next) => {
        if (next) {
            console.log(next);
            next();
        }

        if (request) {
            const requestUrl = request.body.url;

            if (requestUrl) {
                const protocolReqUrl = requestUrl.split("/")[0];
                const domainReqUrl = requestUrl.split("/")[2];

                rq(requestUrl, function handlerRequestUrl(error, resp, body) {
                    if (error) {
                        return next(new errors.InvalidArgumentError("Некорректный URL"));
                    }
                    console.log('statusCode:', resp && resp.statusCode);
                    const dataUrls = controller.createBodyDataHtml(body);
                    const newData = controller.filterUrl(dataUrls, protocolReqUrl, domainReqUrl);
                    // console.log(newData);
                    response.send(JSON.stringify(newData));
                    next();
                });
            }
        }
    });
};