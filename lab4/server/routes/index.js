const rq = require('request'),
    controller = require("../utils"),
    errors = require('restify-errors');

module.exports = (server) => {
    async function getAllStatus(newData) {
        newData.map((item) => {
            rq(item.url, function(error, resp) {
                console.log("url: " +  item.url + ", status: " + resp.statusCode);
            })
        });
    }
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

                let start, stop;
                start = (new Date()).getTime();

                rq(requestUrl, function(error, resp, body) {
                    if (error) {
                        return next(new errors.InvalidArgumentError("Некорректный URL"));
                    }

                    console.log("Запрашиваемый URL", requestUrl, "statusCode:", resp && resp.statusCode);

                    const dataUrls = controller.createBodyDataHtml(body);
                    const newData = controller.filterUrl(dataUrls, protocolReqUrl, domainReqUrl);
                    const pomiseData = getAllStatus(newData);

                    pomiseData
                        .then(() => {
                            stop = (new Date()).getTime();
                            const workTime = (stop - start) / 1000;
                            console.log("Общее время поиска: " + workTime + "сек. Всего ссылок: " + newData.length);
                        }).catch(() => {
                            return next(new errors.BadGatewayError("Неудалось получить данные по статусам *_*"));
                    });

                    response.send(JSON.stringify(newData));
                    next();
                });
            }
        }
    });
};