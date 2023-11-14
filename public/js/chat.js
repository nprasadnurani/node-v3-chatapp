const socket = io()





// socket.on('message', (mesg) => {
//     console.log(mesg)

// })

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#textarea')
const $messageFormButton = $messageForm.querySelector('button')
const $sharelocationButton = document.querySelector('#share-location')
const $messages = document.querySelector('#messages')

//Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight
    // Height of message container

    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight

    }




}




$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()    // to prevent default form submission from refereshing

    //disable the form
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value

    socket.emit("sendMessage", message, (error) => {
        //enable the form
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)

        }

    })
})

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        room: message.room,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm:ss a')

    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

})


socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


socket.on('locationMessage', (url) => {
    //console.log("Location is " + url)

})



$sharelocationButton.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Geolocation is supported by your browser')
    }
    $sharelocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (error) => {
            $sharelocationButton.removeAttribute('disabled')
            if (error) {
                return console.log(error)
            }

        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }


})





