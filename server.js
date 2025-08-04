const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve your static files
app.use(express.static(__dirname));

app.get('/healthz', (req, res) => {
  res.send('OK');
});
// Your WebSocket logic (paste your user map code here)
let arrayOfUsers = [];
let M = new Map(); 
const baseArrayOfUsers = [];
let wsMap = new Map();
let wsSet = new Set();
/*
for (let i = 0; i < 10; i++) {
    const user = {userName: ``, userId: Math.random().toString(36).substring(2, 15), messages: new Map()};
    arrayOfUsers.push(user);
    baseArrayOfUsers.push(user);
}

for (let i = 0; i < 10; i++) {
    M.set(arrayOfUsers[i].userId, deepCloneUsers(baseArrayOfUsers));
}

*/
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (event) => {
        const message = event.toString();
    console.log(`Received: ${message}`);
        // Broadcast message to all connected clients
        if(!(message.includes('wussup')) || wsSet.has(ws)) {
            UpdateAOUSend(message);
            //console.log(event);
            const pm = JSON.parse(message);
            //console.log(pm);
            console.log(pm.sender);
            console.log(pm.otherUserId);
            console.log(wsMap.get(pm.sender)==ws);
            console.log(wsMap.get(pm.otherUserId)==undefined);
            wsMap.get(pm.otherUserId).send(message);
            wsMap.get(pm.sender).send(message);
           
        console.log(' message received');}
        else if(message.includes("wussup") && !wsSet.has(ws)){
            console.log('wussup message received');
            ws.send('wussup' + AOU2(message, ws));
            //console.log(( AOU2(message, ws)));
          wsSet.add(ws);
        }
        });
    

    ws.on('close', () => {
        console.log('Client disconnected');
        wsSet.delete(ws);
    });
 });
console.log('WebSocket server running on ws://localhost:8080');

/*
    const bbb = value.map(user => ({
            ...user,
            messages: Object.fromEntries(user.messages),
            key: key
        }));
*/


const AOU2 = (message, ws) => {
    const oth = message.substring(6, 17); // Remove 'wussup'
    const name = message.substring(17);
    console.log(name);
    console.log(oth);
        wsMap.set(oth,ws);

       const obj =
        {
            userName: name, 
            userId: oth, 
            messages: new Map()
        }
        M.forEach((value,key)=>{value.forEach((value2)=>{if(value2.userId == oth){value2.userName = name}})})

    if(!M.has(oth)) {
     
        baseArrayOfUsers.push(obj);
        M.set(oth, deepCloneUsers(baseArrayOfUsers));
    }
    let MM = M.get(oth);
    let users = MM.map(user =>({
        userName: user.userName,
        userId: user.userId,
        messages: Object.fromEntries(user.messages)
    }))
        //console.log(users);
    return JSON.stringify(users);
}



function UpdateAOUSend(message){
    const parsedMessage = JSON.parse(message);
    console.log(parsedMessage);
    const otherUserId = parsedMessage.otherUserId;
    const senderId = parsedMessage.sender;
    const mess = parsedMessage.mess;
    const index1 = M.get(senderId).findIndex(user => user.userId === otherUserId);
    const index2 = M.get(otherUserId).findIndex(user => user.userId === senderId);
    console.log(`Index of user with ID ${otherUserId} in arrayOfUsers: ${index1}`);
    if (index1 === -1) {
        console.error(`User with ID ${otherUserId} not found in arrayOfUsers`);
        return;
    }
    else {
    M.get(senderId)[index1].messages.set(Date.now(), {
        otherUserId: otherUserId,
        sender: senderId,
        mes: mess,
        date: Date.now()
    });
    //console.log(M.get(senderId)[index2].messages);
    M.get(otherUserId)[index2].messages.set(Date.now(), {
        otherUserId: otherUserId,
        sender: senderId,
        mes: mess,
        date: Date.now()
    });

}
}

function deepCloneUsers(users){
    return users.map(user => ({
        userName: user.userName,
        userId: user.userId,
        messages: new Map() // Start with fresh map per IP
    }));
};

// Use PORT from environment (Render requires this)
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});



