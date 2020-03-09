const fs = require('fs')
const strtotime = require('strtotime')
const multer = require('multer')
const path = require('path')
const upload = multer({ storage: multer.memoryStorage() })
const { Router } = require ('express')
const { Employee } = require('../models/employees')
const { Customer } = require('../models/customer')
const { URL } = require('../helpers')
const { checkSessionId, customerStatus, sourceInfo, typeShape, sizes } = require('../helpers')

const profile = Router()

profile.get('/', checkSessionId, async (req, res) => {
    const customers = await Customer.find()
    res.render('profile', {
        userName: req.currentUser.userName,
        customers
    })
})

profile.get('/create-customer', checkSessionId, async (req, res) => {
    const employees = await Employee.find()
    res.render('create-customer', {
        employees,
        customerStatus,
        sourceInfo,
        typeShape,
        sizes,
        customer: false,
        notFill: true
    })
})

profile.post('/add-customer', checkSessionId, upload.single('photo'), async (req, res) => {
    let customer = req.body
    const { name, telephone, status, shape, size, source, employee }= customer
    if( name && telephone && status && shape && size && source && employee) {
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
            customerStatus,
            sourceInfo,
            typeShape,
            sizes,
            customer,
            notFill: false
        })
    }
})


module.exports = { profile }