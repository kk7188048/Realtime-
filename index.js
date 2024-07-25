const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    socket.on("sendConnection", (data) => {
        io.emit('receiveConnection', {id:socket.id,...data});
        console.log(data)
    })
    console.log('a user connected');
    socket.on("disconnect", () => {
        io.emit("disconnect", socket.id);
    })
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
