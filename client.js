const WebSocket = require('ws');
const wsChat = new WebSocket('ws://127.0.0.1:8080/');

wsChat.on('open', function open() {
    wsChat.on('message', function incoming(data) {
        console.log(`on requesting chat:  ${data}`);
    });
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
console.log("Type something to send to a server");
process.stdin.on('data', async function (text) {
    wsChat.send(text.trimRight());
});