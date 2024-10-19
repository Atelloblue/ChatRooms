// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUDMjbLSkmjyGh9S1eXB5KL_gYMV9YT-U",
    authDomain: "chatrooms-13eca.firebaseapp.com",
    databaseURL: "https://chatrooms-13eca.firebaseio.com",
    projectId: "chatrooms-13eca",
    storageBucket: "chatrooms-13eca.appspot.com",
    messagingSenderId: "663205459864",
    appId: "1:663205459864:web:3df5535b5e20f72ced5ded"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let username = '';

// Create room
document.getElementById('create-room').addEventListener('click', () => {
    const roomName = document.getElementById('room-name').value;
    if (roomName && username) {
        const roomsRef = database.ref('rooms/' + roomName);
        roomsRef.set({ messages: [] }); // Initialize room
        document.getElementById('room-name').value = '';
    }
});

// Set the username
document.getElementById('username').addEventListener('change', (event) => {
    username = event.target.value;
});

// Load rooms
database.ref('rooms').on('child_added', (snapshot) => {
    const roomName = snapshot.key;
    const roomButton = document.createElement('button');
    roomButton.innerText = roomName;
    roomButton.onclick = () => joinRoom(roomName);
    document.getElementById('room-list').appendChild(roomButton);
});

function joinRoom(roomName) {
    document.getElementById('current-room').innerText = roomName;
    document.getElementById('chat-area').style.display = 'block';

    const messagesRef = database.ref('rooms/' + roomName + '/messages');
    messagesRef.on('child_added', (data) => {
        const message = data.val();
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML += `<div>${message}</div>`;
    });
}

document.getElementById('send-message').addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const roomName = document.getElementById('current-room').innerText;
    if (message && username) {
        const messagesRef = database.ref('rooms/' + roomName + '/messages');
        messagesRef.push(`${username}: ${message}`);
        messageInput.value = '';
    }
});
