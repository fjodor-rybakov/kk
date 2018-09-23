const rqp = require("request-promise"),
    controller = require("../utils"),
    errors = require('restify-errors');

module.exports = (server) => {
    let allLinks = [];
    let acceptLinks = [];
    let rejectLinks = [];

    server.post("/get_data_urls", handleGetData);

    function handleGetData(request, response, error) {

        if (error) {
            console.log(error);
            error();
        }

        let requestUrl = request.body.url;

        if (!requestUrl) {
            return error(new errors.InvalidArgumentError("Запрос пуст"));
        }

        allLinks = [];
        acceptLinks = [];
        rejectLinks = [];

        getRequest(requestUrl);

        setTimeout(() => {
            allLinks.map((item) => {
                if (item.status >= 400) {
                    rejectLinks.push(item);
                } else {
                    acceptLinks.push(item);
                }
            });
            const data = {acceptLinks, rejectLinks};
            response.send(JSON.stringify(data));
        }, 3000);
    }

     function getUrls() {
        const allLinks = arguments[0].allLinks;
        const arrayLinksPage = arguments[0].arrayLinksPage;

        arrayLinksPage.map((currentUrl) => {
            if (!allLinks.some((item) => item.url === currentUrl)) {
                getRequest(currentUrl);
            }
        });

        return allLinks;
    }

    function getRequest(currentUrl) {
        let options = {
            method: 'GET',
            uri: currentUrl,
            resolveWithFullResponse: true,
            simple: false
        };

        rqp(options)
            .then(onSuccess.bind(this, currentUrl))
            .then(getUrls);
    }

    function onSuccess() {
        const requestUrl = arguments[0];
        const data = arguments[1];
        const protocolReqUrl = requestUrl.split("/")[0];
        const domainReqUrl = requestUrl.split("/")[2];
        const currentUrlsPage = controller.createBodyDataHtml(data.body);
        let arrayLinksPage = controller.filterUrl(currentUrlsPage, protocolReqUrl, domainReqUrl);

        if (allLinks.some((item) => item.url === requestUrl)) {
            arrayLinksPage = [];
            return {allLinks, arrayLinksPage}
        }

        allLinks.push({url: requestUrl, status: arguments[1].statusCode});

        return {allLinks, arrayLinksPage};
    }
};


































































































































































































/*module.exports = (server) => {
    let allLinks = [];

    server.post("/get_data_urls", handleGetData);

    function handleGetData(request, response, error) {
        if (error) {
            console.log(error);
            error();
        }

        const requestUrl = request.body.url;

        if (!requestUrl) {
            return error(new errors.InvalidArgumentError("Запрос пуст"));
        }

        allLinks = [];

        let options = {
            method: 'GET',
            uri: requestUrl,
            resolveWithFullResponse: true,
            simple: false
        };

        const result = rqp(options)
            .then(onSuccess.bind(this, requestUrl))
            .catch(onReject.bind(this, requestUrl));

        result.then(async (data) => {
            let res = await getRequestUrls(data, response);
            console.log(res);
        });
    }

    function getRequestUrls() {
        const allLinks = arguments[0].allLinks;
        const arrayLinksPage = arguments[0].arrayLinksPage;
        const serverResponse = arguments[1];

        return arrayLinksPage.map((currentUrl) => {
            if (!allLinks.some((item) => item.url === currentUrl)) {
                let options = {
                    method: 'GET',
                    uri: currentUrl,
                    resolveWithFullResponse: true,
                    simple: false
                };

                return rqp(options)
                    .then(onSuccess.bind(this, currentUrl))
                    .then((data) => {
                        getRequestUrls(data, serverResponse);
                    });
            }
        });
    }

    function onSuccess() {
        const requestUrl = arguments[0];
        const data = arguments[1];
        const protocolReqUrl = requestUrl.split("/")[0];
        const domainReqUrl = requestUrl.split("/")[2];
        const currentUrlsPage = controller.createBodyDataHtml(data.body);
        let arrayLinksPage = controller.filterUrl(currentUrlsPage, protocolReqUrl, domainReqUrl);

        if (allLinks.some((item) => item.url === requestUrl)) {
            arrayLinksPage = [];
            return {allLinks, arrayLinksPage}
        }

        allLinks.push({url: requestUrl, status: arguments[1].statusCode});

        return {allLinks, arrayLinksPage};
    }

    function onReject() {
        const arrayLinksPage = [];

        allLinks.push({url: arguments[0], status: arguments[1].statusCode});

        return {allLinks, arrayLinksPage};
    }
};*/

/*module.exports = (server) => {
    let acceptLinks = [];
    let rejectLinks = [];

    server.post("/get_data_urls", handleGetData);

    function handleGetData(request, response, error) {
        if (error) {
            console.log(error);
            error();
        }

        const requestUrl = request.body.url;

        if (!requestUrl) {
            return error(new errors.InvalidArgumentError("Запрос пуст"));
        }

        acceptLinks = [];
        rejectLinks = [];

        rq(requestUrl, getDataUrls.bind(this, requestUrl, response, error));

        console.log(acceptLinks);
    }

    function getDataUrls() {
        const requestUrl = arguments[0];
        const serverResponse = arguments[1];
        const serverError = arguments[2];
        const err = arguments[3];
        const resp = arguments[4];
        const body = arguments[5];

        if (err) {
            console.log(err);
            return serverError(new errors.InvalidArgumentError("Некорректный URL или этот адрес недоступен"));
        }

        if (resp && resp.statusCode >= 400) {
            rejectLinks.push({url: requestUrl, status: resp.statusCode});
            return serverResponse.send(JSON.stringify(rejectLinks));
        }

        acceptLinks.push({url: requestUrl, status: resp.statusCode});

        const protocolReqUrl = requestUrl.split("/")[0];
        const domainReqUrl = requestUrl.split("/")[2];

        const currentUrlsPage = controller.createBodyDataHtml(body);
        const arrayLinksPage = controller.filterUrl(currentUrlsPage, protocolReqUrl, domainReqUrl);

        getRequestUrls(arrayLinksPage);
    }

    function getRequestUrls(arrayLinksPage) {
        arrayLinksPage.map((url) => {
            if (acceptLinks.indexOf(url) === -1 && rejectLinks.indexOf(url) === -1) {
                rq(url, getDataRequestUrls.bind(this, url))
            }
        });
    }

    function getDataRequestUrls() {
        const requestUrl = arguments[0];
        const err = arguments[1];
        const resp = arguments[2];
        const body = arguments[3];

        if (err) {
            console.log(err);
        }

        if (resp && resp.statusCode >= 400) {
            rejectLinks.push({url: requestUrl, status: resp && resp.statusCode});
        } else {
            acceptLinks.push({url: requestUrl, status: resp && resp.statusCode});

            const protocolReqUrl = requestUrl.split("/")[0];
            const domainReqUrl = requestUrl.split("/")[2];

            const currentUrlsPage = controller.createBodyDataHtml(body);
            const arrayLinksPage = controller.filterUrl(currentUrlsPage, protocolReqUrl, domainReqUrl);

            // getRequestUrls(arrayLinksPage);
        }
        console.log(acceptLinks);
    }
};*/

/*
module.exports = (server) => {
    let acceptLinks = [];
    let rejectLinks = [];

    server.post("/get_data_urls", handleGetData);

    async function getData(dataAccept, dataReject) {
        console.log(dataAccept);
        console.log("----------------------------------");
        console.log(dataReject);
    }

    async function handleGetData(request, response, next) {
        if (next) {
            console.log(next);
            next();
        }

        const requestUrl = request.body.url;

        if (!requestUrl) {
            return next(new errors.InvalidArgumentError("Запрос пуст"));
        }

        let options = {
            method: 'GET',
            uri: requestUrl,
            resolveWithFullResponse: true,
        };

        await rqp(options)
            .then(async (resp) => {
                if (resp.statusCode >= 400) {
                    rejectLinks.push({url: requestUrl, status: resp.statusCode});
                } else {
                    const protocolReqUrl = requestUrl.split("/")[0];
                    const domainReqUrl = requestUrl.split("/")[2];

                    acceptLinks.push({url: requestUrl, status: resp.statusCode});
                    console.log("ok");

                    const currentUrlsPage = controller.createBodyDataHtml(resp.body);
                    const arrayLinksPage = controller.filterUrl(currentUrlsPage, protocolReqUrl, domainReqUrl);
                    await getAllLinks(arrayLinksPage);
                }
            })
            .catch(() => {
                return next(new errors.InvalidArgumentError("Некорректный URL или этот адрес недоступен"));
            });

        // await getData(acceptLinks, rejectLinks);

        /!*if (request) {
            const requestUrl = request.body.url;

            if (requestUrl) {
                // let start, stop;
                // start = (new Date()).getTime();

                let options = {
                    method: 'GET',
                    uri: requestUrl,
                    resolveWithFullResponse: true,
                };

                await rqp(options)
                    .then(async (resp) => {
                        if (resp.statusCode >= 400) {
                            rejectLinks.push({url: requestUrl, status: resp.statusCode});
                        } else {
                            const protocolReqUrl = requestUrl.split("/")[0];
                            const domainReqUrl = requestUrl.split("/")[2];

                            acceptLinks.push({url: requestUrl, status: resp.statusCode});
                            // console.log("enter ok");

                            const currentUrlsPage = controller.createBodyDataHtml(resp.body);
                            const arrayLinksPage = controller.filterUrl(currentUrlsPage, protocolReqUrl, domainReqUrl);
                            await
                                getAllLinks(arrayLinksPage);
                        }

                        // console.log(arrayLinksPage);
                        // console.log(resp.body);
                    })
                    .catch((error) => {
                        // console.log("enter error");
                        // console.log(error);
                        // rejectLinks.push({url: requestUrl, status: undefined});
                        return next(new errors.InvalidArgumentError("Некорректный URL или этот адрес недоступен"));
                    });

                console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
                console.log(acceptLinks);
                console.log("-------------------------------------------------------------");
                console.log(rejectLinks);
                console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

                /!*rq(requestUrl, function(error, resp, body) {
                    if (error) {
                        return next(new errors.InvalidArgumentError("Некорректный URL"));
                    }

                    console.log("Запрашиваемый URL", requestUrl, "statusCode:", resp && resp.statusCode);

                    const dataUrls = controller.createBodyDataHtml(body);
                    const newData = controller.filterUrl(dataUrls, protocolReqUrl, domainReqUrl);
                    const pomiseData = getAllStatus(newData);

                    /!*pomiseData
                        .then(() => {
                            stop = (new Date()).getTime();
                            const workTime = (stop - start) / 1000;
                            console.log("Общее время поиска: " + workTime + "сек. Всего ссылок: " + newData.length);
                        }).catch(() => {
                            return next(new errors.BadGatewayError("Неудалось получить данные по статусам *_*"));
                    });*!/

                    response.send(JSON.stringify(newData));
                    next();
                });*!/
            }
        }*!/
    }
    async function getAllStatus(newData) {
        return Promise(() => {
            newData.map((item) => {
                rq(item.url, function(error, resp) {
                    // console.log("url: " +  item.url + ", status: " + resp.statusCode);
                    return item = {url: item.url, status: resp.statusCode};
                })
            });
        })
    }
    async function getAllLinks(arrayLinksPage) {
        // console.log(arrayLinksPage);
        arrayLinksPage.map(async (item) => {
            const currentUrl = item.url;
            // console.log(currentUrl);
            if (!acceptLinks.some((value) => {return value.url === currentUrl}) &&
                !rejectLinks.some((value) => {return value.url === currentUrl})) {

                let options = {
                    method: 'GET',
                    uri: currentUrl,
                    resolveWithFullResponse: true
                };

                await rqp(options)
                    .then(async (resp) => {
                        if (resp.statusCode >= 400) {
                            rejectLinks.push({url: currentUrl, status: resp.statusCode});
                            console.log(rejectLinks);
                            return void 0;
                        } else {
                            const protocolReqUrl = currentUrl.split("/")[0];
                            const domainReqUrl = currentUrl.split("/")[2];
                            // console.log("enter");
                            acceptLinks.push({url: currentUrl, status: resp.statusCode});
                            // console.log(acceptLinks);

                            const currentUrlsPage = controller.createBodyDataHtml(resp.body);
                            const arrayLinksPage = controller.filterUrl(currentUrlsPage, protocolReqUrl, domainReqUrl);
                            // console.log(arrayLinksPage);
                            await getAllLinks(arrayLinksPage);
                            // console.log(resp.body);
                        }
                    })
                    .catch((error) => {
                        return void 0;
                        // return next(new errors.InvalidArgumentError("Некорректный URL или этот адрес недоступен"));
                    });
            }
        });
    }
};*/
