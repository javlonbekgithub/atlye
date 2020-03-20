const { connect, connection } = require('mongoose')
const sha256 = require('crypto-js/sha256')
const { User } = require('../models/user')
const uri = 'mongodb://localhost/atelier'

connect(uri , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const users = [
    {
        userName: 'test',
        password: 'password'
    },
    {
        userName: 'test2',
        password: 'password2'
    },
    {
        userName: 'test3',
        password: 'password3'
    }
]

users.map(item => {
connection.once('open', async () => {
        let dbRes = await User.findOne({ userName: item.userName })
        if(!dbRes) {
            item.password = sha256(item.password).toString()
            await User.insertMany([item])
            console.log('successful', item.userName)
        } else 
            console.log('user-exists', item.userName)
    } )
}) 
