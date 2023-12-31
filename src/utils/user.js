const users = []


const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room) {
        return {
            error: 'User name and room are required!'
        }
    }
    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    // validate user name
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }
    //Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}


const getUser = (id) => {
    return users.find((user) => user.id == id)
}


const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room.trim().toLowerCase())
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// addUser({
//     id: 22,
//     username: "   Prasad ",
//     room: "Austin"
// })

// addUser({
//     id: 23,
//     username: "   Rudy",
//     room: "Austin"
// })

// addUser({
//     id: 42,
//     username: "   Rambo",
//     room: "Georgetown"
// })



// const user = getUser(422)
// console.log(user)

// const usersInRoom = getUsersInRoom("Lakeway")
// console.log(usersInRoom)

