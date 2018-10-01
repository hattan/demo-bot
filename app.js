let server = require('restify').createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

server.post('/api/messages', async (req, res) => {
  return "Hello World"
});

