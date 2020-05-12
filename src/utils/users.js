const users = []


const addUser = ({id , username, room}) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for exisiting user
    const exisitingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (exisitingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //store user
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
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users[index]
    } else {
        return undefined
    }
}

const getUsersInRoom = (room) => {
    return users.filter( user => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}