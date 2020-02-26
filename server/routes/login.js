const { Router } = require ('express')
const { v4 } = require('uuid')
const { User } = require('../models/user')
const { error } = require('../helpers')
const sha256 = require('crypto-js/sha256')

const login = Router()

login.get('/', (req, res) => {
    res.render('login', {
        incorrect: false
    })
})

login.post('/enter', async (req, res) => {
    if(req.body.password) {
        let password = sha256(req.body.password).toString()
        const dbRes = await User.findOne({ userName: req.body.userName})
        if(dbRes && dbRes.password === password ){
            const sessionId = v4() 
            res.session.sessionId = sessionId
            // await User.findByIdAndUpdate(
            //     { "userName": req.body.userName },
            //     { "sessionId": sessionId }  
            // )
            // res.status(201).send(req.session)
            res.render('profile', {
               userName: dbRes.userName
            })
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


module.exports = { login }