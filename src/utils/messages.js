const generateMessage = (username, text) => {
    console.log(`user name is ${username}`)

    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}


const generateLocation = (username, position) => {
    return {
        username,
        url: `https://google.com/maps?q=${position.latitude},${position.longitude}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocation
}