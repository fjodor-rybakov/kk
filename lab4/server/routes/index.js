const rqp = require("request-promise"),
    controller = require("../utils"),
    errors = require('restify-errors'),
    templateUrl = /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;


module.exports = (server) => {
    let allLinks = [];
    let acceptLinks = [];
    let rejectLinks = [];

    server.post("/get_data_urls", handleGetData);

    async function handleGetData(request, response, next) {
        let requestUrl = request.body.url;

        await checkCorrectUrl(requestUrl, response, next);

        allLinks = [];
        acceptLinks = [];
        rejectLinks = [];

        let start, stop;
        start = (new Date()).getTime();

        await getAllData(requestUrl).then((data) => {
            allLinks = data;
        });

        stop = (new Date()).getTime();
        const workTime = (stop - start) / 1000;
        console.log("Общее время поиска: " + workTime + "сек. Всего ссылок: " + allLinks.length);
        let dataWork = {workTime: workTime, countLinks: allLinks.length};

        allLinks.map((item) => {
            if (item.status >= 400) {
                rejectLinks.push(item);
            } else {
                acceptLinks.push(item);
            }
        });

        const data = {acceptLinks, rejectLinks, dataWork};
        response.send(JSON.stringify(data));
    }

    function getAllData(requestUrl) {
        return new Promise(async resolve => {
            let temp = [];
            let queue = [];

            while (true) {
                await getRequest(requestUrl)
                    .then(onSuccess.bind(this, requestUrl))
                    .then((data) => {
                        if (!temp.some((item) => item.url === requestUrl)) {
                            temp.push({url: requestUrl, status: data.status});
                        }
                        data.arrayLinksPage.map((currentUrl) => {
                            if (!temp.some((itemData) => itemData.url === currentUrl)) {
                                queue.push(currentUrl);
                            }
                        })
                    })
                    .catch(console.log);
                if (queue.length === 0) {
                    break;
                }
                requestUrl = queue[0];
                queue.shift();
                // console.log(temp[temp.length - 1]);
            }
            resolve(temp);
        })
    }

    function getRequest(currentUrl) {
        return new Promise(resolve => {
            let options = {
                method: 'GET',
                uri: currentUrl,
                resolveWithFullResponse: true,
                simple: false
            };

            rqp(options)
                .then(resolve);
        })
    }

    function onSuccess() {
        const requestUrl = arguments[0];
        const data = arguments[1];
        const protocolReqUrl = requestUrl.split("/")[0];
        const domainReqUrl = requestUrl.split("/")[2];
        const currentUrlsPage = controller.createBodyDataHtml(data.body);
        let arrayLinksPage = controller.filterUrl(currentUrlsPage, protocolReqUrl, domainReqUrl);
        let status = data.statusCode;

        return {status, arrayLinksPage};
    }

    function checkCorrectUrl(requestUrl, response, next) {
        if (next) {
            next();
        }

        if (!requestUrl) {
            return next(new errors.InvalidArgumentError("Запрос пуст"));
        }

        if (requestUrl.search(templateUrl)) {
            return next(new errors.InvalidArgumentError("Некорректный URL"));
        }
    }
};