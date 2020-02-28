const { Router } = require ('express')
const { User } = require('../models/user')
const { Employee } = require('../models/employees')
const { Customer } = require('../models/customer')
const { URL } = require('../helpers')
const fs = require('fs');
const path = require('path')
const { error } = require('../helpers')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const profile = Router()

profile.get('/', async (req, res) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if(dbRes) {
        const customers = await Customer.find()
        res.render('profile', {
           userName: dbRes.userName,
           customers
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

profile.get('/create-customer', async (req, res) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if(dbRes) {
        const employees = await Employee.find()
        res.render('create-customer', {
            employees
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

profile.post('/add-customer',upload.single('photo'), async (req, res) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if(dbRes) {
        if (req.file) {
            let ext = req.file.mimetype.slice(req.file.mimetype.indexOf('/') + 1)
            ext = ext === 'jpeg' ? 'jpg' : ext
            let photoId = Math.random().toString().slice(2, 22)
            let photoName = `${photoId}.${ext}`
            // let photoUrl = `${URL}/photos/${photoName}`
            // let photoPath = path.join(__dirname, '../', 'public/photos', photoName)
            fs.writeFile(__dirname + photoName, req.file.buffer, 'base64', async err => {
                if(err) res.write('image-isnot-uploaded')
                req.body.photo = 'http://localhost:3000'
            })
            await Customer.insertMany([req.body])
            res.redirect('/profile/')
        }
        await Customer.insertMany([req.body])
        res.redirect('/profile/')
    } else {
        res.render('login', { incorrect: error.messages.expired })
    }
})


module.exports = { profile }