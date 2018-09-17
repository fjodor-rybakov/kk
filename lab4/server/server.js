const restify = require('restify'),
    config  = require('./config');

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