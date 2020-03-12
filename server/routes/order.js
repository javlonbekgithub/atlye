const { Router } = require ('express')
const { checkSessionId, customerStatus, titlesAndRoutes } = require('../helpers')
const { Order } = require('../models/orders')
const { TryOn } = require('../models/tryOn')
const { Customer } = require('../models/customer')
const { Employee } = require('../models/employees')
const { KindOrder } = require('../models/kindOrder')
const { Payment } = require('../models/payment')
const strtotime = require('strtotime')

const order = Router()

order.get('/', checkSessionId, async (req, res) => {
    let options = {
        path : 'client',
        select : 'name'
    }
    const orders = await Order.find().populate(options)
    res.render('order', {
        orders
    })
})
order.get('/add', checkSessionId, async (req, res) => {
    const dbResFromOrder = await Order.find()
    const customer = await Customer.find()
    const employees = await Employee.find()
    const kindOrder = await KindOrder.find()
    res.render('add-order', { 
        responsible: req.currentUser.userName,
        numberOrder: dbResFromOrder.length + 1 || 1,
        customer,
        employees,
        kindOrder,
        customerStatus,
        titles: titlesAndRoutes.add,
        disabled: false,
        order: false,
        notFill: true
    })
})

order.post('/add', checkSessionId, async (req, res) => {
    let order = req.body
    if(order.dateOrder && order.typeOrder && order.executor && order.client && order.customerStatus) {
        const dbResFromOrder = await Order.find()
        order.dateOrder = strtotime(order.dateOrder)
        order.numberOrder = dbResFromOrder.length + 1 || 1
        order.responsible = req.currentUser._id
        order.paid = order.paid || 0
        const try_on = [
            {
                date: Date.now() + 60 * 60 * 48 * 1000,
                typeTryOn: 'первая примерка',
                client: order.client,
                notice: order.notice,
                orderNumber: order.numberOrder
            },
            {
                date: Date.now() + 60 * 60 * 24 * 7 * 1000,
                typeTryOn: 'вторая примерка',
                client: order.client,
                notice: order.notice,
                orderNumber: order.numberOrder
            }
        ]
        const payment = {
            datePayment: Date.now() * 1000,
            paid: order.paid,
            client: req.currentUser._id
        }
        const addedPayment = await Payment.insertMany([payment]) 
        const addedOrder = await Order.insertMany([order])
        await TryOn.insertMany(try_on)
        await Customer.findByIdAndUpdate(
            order.client,
            { $push: { 
                orders: addedOrder[0]._id,
                payments : addedPayment[0]._id 
            } }
        )
        res.redirect('/order/')
    } else {
        const dbResFromOrder = await Order.find()
        const customer = await Customer.find()
        const employees = await Employee.find()
        const kindOrder = await KindOrder.find()
        res.render('add-order', { 
        responsible: req.currentUser.userName,
        numberOrder: dbResFromOrder.length + 1 || 1,
        customer,
        employees,
        kindOrder,
        titles: titlesAndRoutes.add,
        customerStatus,
        disabled: false,
        order,
        notFill: false
    })
    }
})

order.get('/copy', checkSessionId, async (req, res) => {
    const dbResFromOrder = await Order.find()
    const customer = await Customer.find()
    const employees = await Employee.find()
    const kindOrder = await KindOrder.find()
    const order = await Order.findOne({ '_id': req._parsedUrl.query})
    res.render('add-order', { 
        responsible: req.currentUser.userName,
        numberOrder: dbResFromOrder.length + 1 || 1,
        customer,
        employees,
        kindOrder,
        titles: titlesAndRoutes.add,
        customerStatus,
        disabled: false,
        order,
        notFill: true
    })
})


order.get('/show', checkSessionId, async (req, res) => {
    const customer = await Customer.find()
    const employees = await Employee.find()
    const kindOrder = await KindOrder.find()
    const order = await Order.findOne({ '_id': req._parsedUrl.query})
    res.render('add-order', { 
        responsible: req.currentUser.userName,
        numberOrder: order.numberOrder,
        customer,
        employees,
        kindOrder,
        titles: titlesAndRoutes.show,
        customerStatus, 
        disabled: true,
        order,
        notFill: true
    })
})

order.get('/edit', checkSessionId, async (req, res) => {
    const customer = await Customer.find()
    const employees = await Employee.find()
    const kindOrder = await KindOrder.find()
    const order = await Order.findOne({ '_id': req._parsedUrl.query})
    res.render('add-order', { 
        responsible: req.currentUser.userName,
        numberOrder: order.numberOrder,
        customer,
        employees,
        kindOrder,
        customerStatus,
        titles: titlesAndRoutes.edit, 
        disabled: false,
        order,
        notFill: true
    })
})

order.post('/edit', checkSessionId, async (req, res) => {
    let order = req.body
    if(order.dateOrder && order.typeOrder && order.executor && order.client && order.customerStatus) {
        console.log(order)
        // order.dateOrder = strtotime(order.dateOrder)
        // order.responsible = req.currentUser._id
        // const payment = {
        //     datePayment: Date.now() * 1000,
        //     paid: order.paid,
        //     client: req.currentUser._id
        // }
        // const addedPayment = await Payment.insertMany([payment]) 
        // const addedOrder = await Order.insertMany([order])
        // await Customer.findByIdAndUpdate(
        //     order.client,
        //     { $push: { 
        //         orders: addedOrder[0]._id,
        //         payments : addedPayment[0]._id 
        //     } }
        // )
        // res.redirect('/order/')
    } else {
        const customer = await Customer.find()
        const employees = await Employee.find()
        const kindOrder = await KindOrder.find()
        res.render('add-order', { 
        responsible: req.currentUser.userName,
        numberOrder: order.numberOrder,
        customer,
        employees,
        kindOrder,
        titles: titlesAndRoutes.edit,
        customerStatus,
        disabled: false,
        order,
        notFill: false
    })
    }
})

module.exports = { order }
