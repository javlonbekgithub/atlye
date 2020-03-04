const { Router } = require ('express')
const { User } = require('../models/user')
const { error } = require('../helpers')
const strtotime = require('strtotime')


const try_on = Router()

try_on.get('/', async (req, res) => {
    
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
        res.render('try-on')
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

module.exports = { try_on }
