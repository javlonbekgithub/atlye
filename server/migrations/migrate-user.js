const { connect, connection } = require('mongoose')
const sha256 = require('crypto-js/sha256')
const { User } = require('../models/user')
const uri = 'mongodb://localhost/atelier'

connect(uri , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const user1 = {
        userName: 'test',
        password: 'password'
    }

connection.once('open', async () => {
    let dbRes = await User.findOne({ userName: user1.userName })
    if(!dbRes) {
        user1.password = sha256(user1.password).toString()
        await User.insertMany([user1])
        console.log('successful')
    } else 
        console.log('user-exists')
}) 
