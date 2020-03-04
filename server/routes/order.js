const { Router } = require ('express')
const { error, customerStatus } = require('../helpers')
const { User } = require('../models/user')
const { Order } = require('../models/orders')
const { Customer } = require('../models/customer')
const { Employee } = require('../models/employees')
const { KindOrder } = require('../models/kindOrder')
const strtotime = require('strtotime')

const order = Router()

order.get('/', async (req, res) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if (dbRes) {
        let options = {
            path : 'client',
            select : 'name'
        }
        const orders = await Order.find().populate(options)
        res.render('order', {
            orders
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})
order.get('/add', async (req, res) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if (dbRes) {
        const dbResFromOrder = await Order.find()
        const customer = await Customer.find()
        const employees = await Employee.find()
        const kindOrder = await KindOrder.find()
        res.render('add-order', { 
            responsible: dbRes.userName,
            numberOrder: dbResFromOrder.length + 1 || 1,
            customer,
            employees,
            kindOrder,
            customerStatus,
            order: false,
            notFill: true
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

order.post('/add', async (req, res) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if (dbRes) {
        let order = req.body
        if(order.dateOrder && order.typeOrder && order.executor && order.client) {
            const dbResFromOrder = await Order.find()
            order.dateOrder = strtotime(order.dateOrder)
            order.numberOrder = dbResFromOrder.length + 1 || 1
            order.responsible = dbRes._id
            await Order.insertMany([order])
            res.redirect('/order/')
        } else {
            const dbResFromOrder = await Order.find()
            const customer = await Customer.find()
            const employees = await Employee.find()
            const kindOrder = await KindOrder.find()
            res.render('add-order', { 
            responsible: dbRes.userName,
            numberOrder: dbResFromOrder.length + 1 || 1,
            customer,
            employees,
            kindOrder,
            customerStatus,
            order,
            notFill: false
        })
        }
        
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

module.exports = { order }
