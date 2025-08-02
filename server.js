const wss = require('ws');
const server = new wss.Server({ port: 8080 });
let arrayOfUsers = [];
let M = new Map(); 
const baseArrayOfUsers = [];
let wsMap = new Map();

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
server.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (event) => {
        const message = event.toString();
    console.log(`Received: ${message}`);
        // Broadcast message to all connected clients
        if(!(message.includes('wussup'))) {
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
        else{
            console.log('wussup message received');
            ws.send('wussup' + AOU2(message, ws));
            //console.log(( AOU2(message, ws)));
        }
        });
    

    ws.on('close', () => {
        console.log('Client disconnected');
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
    const oth = message.substring(6); // Remove 'wussup'
    
        wsMap.set(oth,ws);
    
    if(!M.has(oth)) {
        const obj =
        {
            userName: ``, 
            userId: oth, 
            messages: new Map()
        }
        baseArrayOfUsers.push(obj);
        M.set(oth, deepCloneUsers(baseArrayOfUsers));
        M.forEach((value,key)=>{if(key!==oth){value.push(obj)}
        })
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