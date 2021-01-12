import { createServer, IncomingMessage, ServerResponse } from 'http';

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    response.end('Hello world!');
});

server.listen(8080);