const restify = require('restify'),
    config  = require('./config'),
    request = require('request'),
    controller = require("./utils");

let requestUrl = "https://vk.com";
const protocolReqUrl = requestUrl.split("/")[0];
const domainReqUrl = requestUrl.split("/")[2];

const server = restify.createServer({
    name: config.name,
    version: config.version
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/*', restify.plugins.serveStatic({
    directory: './client',
    default: 'index.html'
}));

const handlerRequestUrl = (error, response, body) => {
    if (error) {
        response.send(error);
        console.log('error:', error);
        return;
    }
    console.log('statusCode:', response && response.statusCode);
    let dataUrls = controller.createBodyDataHtml(body);
    const newData = controller.filterUrl(dataUrls, protocolReqUrl, domainReqUrl);
    console.log(newData);
};

request(requestUrl, handlerRequestUrl);

server.on('restifyError', (req, res, err, callback) => {
    return callback();
});

server.listen(config.port, (error) => {
    if (error) {
        console.log(error);
    }
    console.log(`Server is listening on port ${config.port}`);
    require('./routes')(server);
});