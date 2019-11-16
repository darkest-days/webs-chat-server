const WebSocket = require('ws');
const url = require('url');
const FunnyNames = require('./funny-names');
const DATA_TYPE = { usersList: 'usersList', message: 'message' };

//Messages handler
const wss = new WebSocket.Server({ port: 8080 });
let users = {};
wss.on('connection', function connection(ws) {

    ws.isAlive = true;
     
    //generateUsersInfo
    const currentUserId = Math.floor(Math.random() * 1000);
    const userNameObj = FunnyNames.getNameObject();
    users[currentUserId] = { userName: userNameObj.name, color: userNameObj.color, socket: ws };
    ws.on('pong', heartbeat);

    //sendGreetings
    const greeting = JSON.stringify({ type: DATA_TYPE.message, message: { author: '_SERVER_', color: userNameObj.color, text: `Hi ${userNameObj.name}!`, } });
    ws.send(greeting);

    //Notify users
    console.log(`New connection: ${currentUserId}`);
    for (let userId in users) {
        const user = users[userId];
        const data = JSON.stringify({ type: DATA_TYPE.usersList, data: { userId: userId, userName: user.userName, color: user.color } });
        ws.send(data);
    }

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client !== this) {
            const data = JSON.stringify({ type: DATA_TYPE.usersList, data: { userId: currentUserId, userName: userNameObj.name, color: userNameObj.color } });
            client.send(data);
        }
    });

    ws.on('message', function incoming(message) {
        let nick;
        let user;
        for (let userId in users) {
            if (users[userId]["socket"] == this) {
                console.log(`sent from ${users[userId]["userName"]}`);
                user = users[userId];
            }
        }

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                const data = JSON.stringify({ type: DATA_TYPE.message, message: { author: user.userName, color: user.color, text: message } });
                client.send(data);
            }
        });
    })
    ws.on('close', function close(ws) {
        console.log(`Connection closed: ${currentUserId}`);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                const data = JSON.stringify({ type: DATA_TYPE.usersList, data: { userId: currentUserId, userName: userNameObj.name, color: userNameObj.color } });
                client.send(data);
            }
        });
        delete users[currentUserId];
    });

});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false)  return ws.terminate();
        
        ws.isAlive = false;
        ws.ping(noop);
    });
}, 15000);

function noop() { }

function heartbeat() {
    this.isAlive = true;
}