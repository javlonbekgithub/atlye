const fs = require('fs')
const strtotime = require('strtotime')
const multer = require('multer')
const path = require('path')
const upload = multer({ storage: multer.memoryStorage() })
const { Router } = require ('express')
const { User } = require('../models/user')
const { Employee } = require('../models/employees')
const { Customer } = require('../models/customer')
const { URL } = require('../helpers')
const { error, clientStatus, sourceInfo, typeShape, sizes } = require('../helpers')

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
            employees,
            clientStatus,
            sourceInfo,
            typeShape,
            sizes,
            customer: false,
            notFill: true
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

profile.post('/add-customer',upload.single('photo'), async (req, res) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if(dbRes) {
        let customer = req.body
        const { name, telephone, statusClient, shape, size, source, employee }= customer
        if( name && telephone && statusClient && shape && size && source && employee) {
            if (req.file) {
                let ext = req.file.mimetype.slice(req.file.mimetype.indexOf('/') + 1)
                ext = ext === 'jpeg' ? 'jpg' : ext
                let photoId = Math.random().toString().slice(2, 22)
                let photoName = `${photoId}.${ext}`
                let photoUrl = `${URL}photos/${photoName}`
                let photoPath = `${__dirname}/../public/photos/${photoName}`
                fs.writeFile(photoPath, req.file.buffer, 'base64', async err => {
                    if(err) 
                        res.write('image-isnot-uploaded')
                })
                customer.photo = photoUrl
            }
            customer.birthday = strtotime(customer.birthday)
            await Customer.insertMany([customer])
            res.redirect('/profile/')
        } else {
            const employees = await Employee.find()
            res.render('create-customer', {
                employees,
                clientStatus,
                sourceInfo,
                typeShape,
                sizes,
                customer,
                notFill: false
            })
        }
    } else {
        res.render('login', { incorrect: error.messages.expired })
    }
})


module.exports = { profile }