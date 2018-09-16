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
        for (let i = 0; i < dataUrls.length; i++) {
            tempValue = dataUrls[i]["url"];

            if (tempValue) {
                if (tempValue.search(templateUrl)) {
                    tempValue = this.restoreUrl(tempValue, protocolReqUrl, domainReqUrl);
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
    },
    restoreUrl(url, protocolReqUrl, domainReqUrl) {
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
    }
};