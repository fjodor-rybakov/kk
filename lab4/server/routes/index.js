module.exports = (server) => {
    server.post("/get_data_urls", (request, response, error) => {
        if (error) {
            console.log(error);
        }
        if (request) {
            if (request.body.url) {
                console.log(request.body);
                response.send("get data...");
            }
        }
        response.send("nothing data...");
    });
};