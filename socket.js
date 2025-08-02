document.addEventListener('DOMContentLoaded', () => {
  const ws = new WebSocket('wss://192.168.1.10:8080');
  let otherUserId;
  let arrayOfUsers = [];
  let myId;
  if (localStorage.getItem('id') !== null) {
    myId = localStorage.getItem('id');
} else {
    myId = Math.random().toString(36).substring(2,16);
    localStorage.setItem('id', myId);
}
  
  ws.onopen = () => {
    console.log('WebSocket opened');
    console.log(myId);
    ws.send('wussup' + myId);
  };


ws.onmessage = async (event) => {
    let data;
    console.log("eyy");
    if (event.data instanceof Blob) {
      data = await event.data.text();
    } else {
      data = event.data;
    }
    
    if (!(data.includes('wussup'))) {
        console.log("asyncevent"); 
    websocketMessage(data);}
    else {
        UAOU(data);
    }
}
    function websocketMessage(message) {
    console.log('WebSocket message received');
    const pm = JSON.parse(message);
    if(pm.sender === myId){
        console.log("a");
    const I = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = pm.mess;
    li.style.color = "red";
    li.style.textAlign = "right"
    console.log(li.textContent); 
    I.appendChild(li);
    const index = arrayOfUsers.findIndex(user => user.userId === otherUserId);
    if (index !== -1) { 
    const hey = Date.now();
    console.log('Parsed message:', pm);
    arrayOfUsers[index].messages.set(hey, {

        sender: pm.sender,
        mes: pm.mess,
        date: hey
    });}
  }
    else if(pm.otherUserId === myId)
    {
        if(otherUserId === pm.sender){
    const I = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = pm.mess;
    console.log(li.textContent); 
    I.appendChild(li);}
      const index = arrayOfUsers.findIndex(user => user.userId === pm.sender);
      console.log("else if");
         if (index !== -1) { 
            console.log("ee");
    const hey = Date.now();
    console.log('Parsed message:', JSON.parse(message));
    arrayOfUsers[index].messages.set(hey, {
        sender: JSON.parse(message).sender,
        mes: JSON.parse(message).mess,
        date: hey
    });}
    }

}
function sendMessage() {
    const input = document.getElementById('Input');
    const message = {
        mess:input.value,
        sender: myId,
        otherUserId: otherUserId};
    ws.send(JSON.stringify(message));
    input.value = '';
    
}

function UAOU(data) {
    console.log('WebSocket message received');
    console.log(data);
    const jsonPayload = data.substring(6); // Remove 'wussup'
    const parsedUsers = JSON.parse(jsonPayload);

    arrayOfUsers = parsedUsers.map(user => ({
      userName: user.userName,
      userId: user.userId,
      messages: new Map(Object.entries(user.messages))
    }));

    console.log(arrayOfUsers);
    for(let i=0;i< arrayOfUsers.length;i++) {
        let uh = document.createElement('li');
        uh.dataset.index = i;
        uh.addEventListener('click', () => {const idBefore = otherUserId; 
            otherUserId = arrayOfUsers[uh.dataset.index].userId;
            document.getElementById('person').textContent = `You are now chatting with ${otherUserId}`;
            reset(idBefore);});
        const I = document.getElementById('users');
        uh.textContent = `${arrayOfUsers[i].userName}, ${arrayOfUsers[i].userId}`;
        I.appendChild(uh);
        }
 }



document.addEventListener('keydown', (ke) => {
    if (ke.key === 'Enter') {
        sendMessage();
    }});
    
    
   

    const reset = (idBefore) => {if(idBefore !== otherUserId) {
        const messagesHtml = document.getElementById('messages');
        messagesHtml.innerHTML = '';
        const index = arrayOfUsers.findIndex(user => user.userId === otherUserId);
        if (index !== -1) {
            arrayOfUsers[index].messages.forEach((value) =>{
            const li = document.createElement('li');
            li.textContent = value.mes;
                console.log(value.sender);
                console.log(value.mes);
            if(value.sender === myId) {
                li.style.color = 'red';
                li.style.textAlign = 'right';
            }
            messagesHtml.appendChild(li);});
        };}
    }
});
