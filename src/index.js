const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log("New websocket connection")
    //  socket.on('join', (options, callback) => {
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        // or we can use a spread operator
        //const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage("Admin", `Welcome to ${room} room`))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`)) // sends to all client except the one it is receiving from
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()

        // socket.emit, io.emit , socket.broadcast.emit // to all
        //socket.io.to.emit, socket.broadcast.to.emit  // emits to a specific room


    })
    socket.on("sendMessage", (message, callback) => {

        const user = getUser(socket.id)
        if (!user) {
            return
        }
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('profanity is not allowed')
        }
        io.to(user.room).emit("message", generateMessage(user.username, message))  // sends to all clients
        callback()

    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
    socket.on('sendLocation', (position, callback) => {
        const user = getUser(socket.id)
        if (!user)
            return

        io.to(user.room).emit('locationMessage', generateLocation(user.username, position))
        callback()
    })
})









server.listen(port, () => {
    console.log(`server is up running on port ${port}`)
})