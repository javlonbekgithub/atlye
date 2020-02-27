const { Router } = require ('express')
const { v4 } = require('uuid')
const { User } = require('../models/user')
const { Customer } = require('../models/customer')
const { error } = require('../helpers')
const sha256 = require('crypto-js/sha256')

const login = Router()
const sessionId = v4()

login.get('/', (req, res) => {
    res.render('login', {
        incorrect: false
    })
})

// login.get('/profile-page', (req, res) => {
//     console.log(req.sessionID)
// })

login.post('/', async (req, res, next) => {
    if(req.body.password) {
        let password = sha256(req.body.password).toString()
        const dbRes = await User.findOne({ userName: req.body.userName})
        if(dbRes && dbRes.password === password ){
            await User.findOneAndUpdate(
                { "userName": req.body.userName },
                { $set: { 'sessionId': sessionId } },
            )
            const customers = await Customer.find()
            res.render('profile', {
               userName: dbRes.userName,
               customers
            })
        next()
        } else {
            res.render('login', {
               incorrect: error.messages.incorrectPasswordOrLogin
            })
        }
    }
    else {
        res.render('login', {
            incorrect: error.messages.fillField
        })
    }
})


module.exports = { login, sessionId }