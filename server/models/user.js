const { Schema, model } = require('mongoose')

const users = new Schema ({
    userName: String,
    password: String,
    sessionId: {
        type: String,
        default: ''
    },
    query: Array
})

const User = model('Users', users)

module.exports = { User }