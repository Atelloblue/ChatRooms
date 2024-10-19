// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, push } from "firebase/database"; // Import necessary functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUDMjbLSkmjyGh9S1eXB5KL_gYMV9YT-U",
  authDomain: "chatrooms-13eca.firebaseapp.com",
  databaseURL: "https://chatrooms-13eca-default-rtdb.firebaseio.com",
  projectId: "chatrooms-13eca",
  storageBucket: "chatrooms-13eca.appspot.com",
  messagingSenderId: "663205459864",
  appId: "1:663205459864:web:3df5535b5e20f72ced5ded",
  measurementId: "G-YG5BSWCQ30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Initialize the database

let username = '';

// Create room
document.getElementById('create-room').addEventListener('click', () => {
    const roomName = document.getElementById('room-name').value;
    if (roomName && username) {
        const roomsRef = ref(database, 'rooms/' + roomName); // Use ref from the database
        set(roomsRef, { messages: [] }); // Initialize room
        document.getElementById('room-name').value = '';
    }
});

// Set the username
document.getElementById('username').addEventListener('change', (event) => {
    username = event.target.value;
});

// Load rooms
onValue(ref(database, 'rooms'), (snapshot) => {
    document.getElementById('room-list').innerHTML = ''; // Clear the existing room list
    snapshot.forEach((childSnapshot) => {
        const roomName = childSnapshot.key;
        const roomButton = document.createElement('button');
        roomButton.innerText = roomName;
        roomButton.onclick = () => joinRoom(roomName);
        document.getElementById('room-list').appendChild(roomButton);
    });
});

function joinRoom(roomName) {
    document.getElementById('current-room').innerText = roomName;
    document.getElementById('chat-area').style.display = 'block';

    const messagesRef = ref(database, 'rooms/' + roomName + '/messages');
    onValue(messagesRef, (data) => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = ''; // Clear the existing messages
        data.forEach((messageSnapshot) => {
            const message = messageSnapshot.val();
            messagesDiv.innerHTML += `<div>${message}</div>`;
        });
    });
}

document.getElementById('send-message').addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const roomName = document.getElementById('current-room').innerText;
    if (message && username) {
        const messagesRef = ref(database, 'rooms/' + roomName + '/messages');
        push(messagesRef, `${username}: ${message}`); // Use push to add a new message
        messageInput.value = '';
    }
});
