const socket = io();
const username = localStorage.getItem('username');
const room = localStorage.getItem('room');

if (!username || !room) {
  window.location.href = '/';
}

document.getElementById('room-name').innerText = room;

socket.emit('join-room', { username, room });

socket.on('username-exists', () => {
  alert('Username already exists in room.');
  window.location.href = '/';
});

socket.on('system-message', msg => {
  addMessage(`🟢 ${msg}`, true);
});

socket.on('chat-message', ({ user, message, time }) => {
  addMessage(`${time} <b>${user}:</b> ${parseMessage(message)}`);
});

socket.on('user-list', users => {
  const ul = document.getElementById('user-list');
  ul.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = u;
    ul.appendChild(li);
  });
});

document.getElementById('chat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = document.getElementById('msg').value.trim();
  if (!msg) return;
  socket.emit('send-message', msg);
  document.getElementById('msg').value = '';
});

function addMessage(content, system = false) {
  const div = document.createElement('div');
  div.innerHTML = content;
  div.style.color = system ? 'yellow' : 'white';
  document.getElementById('messages').appendChild(div);
  div.scrollIntoView();
}

function parseMessage(msg) {
  return msg
    .replace(/\*(.*?)\*/g, '<b>$1</b>')
    .replace(/_(.*?)_/g, '<i>$1</i>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
}