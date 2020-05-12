const socket = io()
const message = document.querySelector('input')

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    //new message element
    const $newMessage = $messages.lastElementChild
    
    //height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight
    //How far have i scrolled?

    const scrollOffset = $messages.scrollTop + visibleHeight
    
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }


    console.log(newMessageMargin)


}

socket.on('locationMessage', (message) => {
    console.log(message.url)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const newMessage = e.target.elements.inputMessage.value
    socket.emit('sendMessage', newMessage, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error){
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
   
})

$locationButton.addEventListener('click', () => {
    if (!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }
    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition( (position) => {        
        socket.emit('sendLocation', {
            longitude : position.coords.longitude,
            lat: position.coords.latitude
        }, () => {
            $locationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })

    })
})

socket.emit('join', {username, room}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})