const { Router } = require ('express')
const { User } = require('../models/user')
const { Employee } = require('../models/employees')
const { Customer } = require('../models/customer')
const { error } = require('../helpers')

const profile = Router()

profile.get('/create-customer', async (req, res) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if(dbRes) {
        const employees = await Employee.find()
        res.render('create-customer', {
            employees
        })
    } else {
        console.log(req)
        res.render('login', { incorrect: error.messages.expired } )
    }
})

profile.post('/add-customer', async (req, res) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if(dbRes) {
        await Customer.insertMany([req.body])
        const customers = await Customer.find()
        res.render('profile', {
            userName: dbRes.userName,
            customers

        })
    } else {
        console.log(dbRes)
        res.render('login', { incorrect: error.messages.expired })
    }
})


module.exports = { profile }