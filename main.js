// main.js

const socket = io("http://localhost:5000"); // asigură-te că serverul rulează
const SECRET_KEY = "cheie-secreta"; // poți schimba cheia cu ceva mai sigur

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const usersSpan = document.getElementById("users");
const messagesSpan = document.getElementById("messages");

let messageCount = 0;

// Trimite mesaj criptat
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  socket.emit("chatMessage", { message: encrypted });

  messageInput.value = "";
}

// Primiți mesaj de la server
socket.on("chatMessage", (data) => {
  const decrypted = CryptoJS.AES.decrypt(data.message, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  appendMessage(decrypted);
  messageCount++;
  messagesSpan.textContent = `✉️ Mesaje: ${messageCount}`;
});

// Actualizare număr utilizatori
socket.on("users", (num) => {
  usersSpan.textContent = `👥 Utilizatori: ${num}`;
});

// Afișează mesaj în UI
function appendMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
