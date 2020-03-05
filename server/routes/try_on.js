const { Router } = require ('express')
const { User } = require('../models/user')
const { TryOn } = require('../models/tryOn.js')
const { error } = require('../helpers')


const try_on = Router()

try_on.get('/', async (req, res) => {
    
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
        let options = {
            path : 'client',
            select : 'name'
        }
        const try_onFromDb = await TryOn.find().populate(options)
        console.log(try_onFromDb)
        res.render('try-on', {
            try_onFromDb
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

module.exports = { try_on }
