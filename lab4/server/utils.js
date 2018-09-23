const cheerio = require("cheerio");
const templateUrl = /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

module.exports = {
    createBodyDataHtml(body) {
        let dataUrls = [];
        let page = cheerio.load(body);

        page('a').each(function(){
            dataUrls.push({
                url: page(this).attr('href')
            });
        });

        return dataUrls;
    },
    filterUrl(dataUrls, protocolReqUrl, domainReqUrl) {
        const newData = [];
        let valueUrl;
        let tempValue;

        dataUrls.map((item) => {
            tempValue = item.url;

            if (!tempValue) {
                return void 0;
            }

            if (tempValue[tempValue.length - 1] === ";") { // Удаление ссылок с кодом javascript
                return void 0;
            }

            if (tempValue.indexOf("#") !== -1) { // Удаление ссылок с якорями
                return void 0;
            }

            if (tempValue.search(templateUrl)) {
                tempValue = this.restoreUrl(tempValue, protocolReqUrl, domainReqUrl);
                valueUrl = tempValue.split("/");
            } else {
                valueUrl = tempValue.split("/");
            }

            if (valueUrl[2] === domainReqUrl) {
                newData.push(tempValue);
            }
        });

        return newData;
    },
    restoreUrl(url, protocolReqUrl, domainReqUrl) {
        let valueUrl = url;

        if (valueUrl[0] === "." && valueUrl[1] === ".") {
            return protocolReqUrl + "//" + domainReqUrl + valueUrl.substr(2);
        }

        if (valueUrl[0] === ".") {
            return protocolReqUrl + "//" + domainReqUrl + valueUrl.substr(1);
        }

        if (valueUrl[0] === "/" && valueUrl[1] === "/") {
            return protocolReqUrl + valueUrl;
        }

        if (valueUrl[0] === "/") {
            return protocolReqUrl + "//" + domainReqUrl + valueUrl;
        } else {
            return protocolReqUrl + "//" + domainReqUrl + "/" + valueUrl;
        }
    },
};