document.addEventListener('DOMContentLoaded', () => {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const ws = new WebSocket(`${protocol}://${window.location.host}`);
  let otherUserId;
  let arrayOfUsers = [];
  let myId;
  let myUsername;
  let wellconected = false;

  myUsername = localStorage.getItem("username");
  console.log(myUsername);
  
  if (localStorage.getItem('id') !== null) {
    myId = localStorage.getItem('id');
} else {
    myId = Math.random().toString(36).substring(2,16);
    localStorage.setItem('id', myId);
}
  
  ws.onopen = () => {
    console.log('WebSocket opened');
    console.log(myId);
    ws.send('wussup' + myId + myUsername);
  };


ws.onmessage = async (event) => {
    let data;
    console.log("eyy");
    if (event.data instanceof Blob) {
      data = await event.data.text();
    } else {
      data = event.data;
    }
    
    if (!(data.includes('wussup')) || wellconected) {
        console.log("asyncevent"); 
    websocketMessage(data);
    wellconected = true;}
    else if ((data.includes('wussup')) && wellconected == false){
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
    li.style.color = "rgba(123, 139, 143, 1)";
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

document.getElementById("person").textContent = "You are now chatting with ..."
document.getElementById("Input").disabled = true;
document.getElementById("Input").placeholder = "select a person first"
  
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
            ouname = arrayOfUsers[uh.dataset.index].userName;
            document.getElementById('person').textContent = `You are now chatting with ${ouname}`;
            reset(idBefore);});
        const I = document.getElementById('users');
        uh.textContent = `${arrayOfUsers[i].userName}`;
        I.appendChild(uh);
        }
 }



document.addEventListener('keydown', (ke) => {
    if (ke.key === 'Enter') {
        sendMessage();
    }});
    
    
   

    const reset = (idBefore) => {if(idBefore !== otherUserId) {
        document.getElementById("Input").disabled = false;
        document.getElementById("Input").placeholder = "Type your message here..."
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
                li.style.color = "rgba(117, 124, 126, 1)";
                li.style.textAlign = 'right';
            }
            messagesHtml.appendChild(li);});
        };}
    }
});






