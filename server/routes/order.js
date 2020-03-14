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
    let skip = parseInt(req._parsedUrl.query) || 0
    let next = 5 + skip
    let prev = next - 10
    const total = await Order.find().count()
    const orders = await Order.find()
        .populate(options)
        .skip(skip)
        .limit(5)
    res.render('order', {
        orders,
        pagination: true,
        prev,
        next,
        total,
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
        id: '',
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
            datePayment: Date.now(),
            paid: order.paid,
            client: order.client
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
        id: '',
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
    console.log(req)
    const order = await Order.findOne({ '_id': req._parsedUrl.query})
    res.render('add-order', { 
        responsible: req.currentUser.userName,
        numberOrder: dbResFromOrder.length + 1 || 1,
        customer,
        employees,
        kindOrder,
        titles: titlesAndRoutes.add,
        customerStatus,
        id: '',
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
        id: '',
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
    let order = await Order.findOne({ '_id': req._parsedUrl.query})
    res.render('add-order', { 
        responsible: req.currentUser.userName,
        numberOrder: order.numberOrder,
        customer,
        employees,
        kindOrder,
        customerStatus,
        titles: titlesAndRoutes.edit,
        id: req._parsedUrl.search, 
        disabled: false,
        order,
        notFill: true
    })
})

order.post('/edit', checkSessionId, async (req, res) => {
    let order = req.body
    if(order.dateOrder && order.typeOrder && order.executor && order.client && order.customerStatus) {
        const oldOrder = await Order.findOne({ '_id': req._parsedUrl.query})
        order.paid = order.paid || 0
        order.dateOrder = strtotime(order.dateOrder)
        order.responsible = req.currentUser._id
        let payment
        if(parseInt(order.sumOrder) !== oldOrder.sumOrder || parseInt(order.paid) !== oldOrder.paid) {
            payment = {
            datePayment: Date.now(),
            paid: order.paid,
            client: order.client
            } 
        } else {
            payment = null
        }
        if(payment) {
            const addedPayment = await Payment.insertMany([payment]) 
            await Customer.findByIdAndUpdate(
                order.client,
                { $push: { 
                    payments : addedPayment[0]._id 
                } }
            )
        }
        await Order.findByIdAndUpdate(req._parsedUrl.query , order)
        res.redirect('/order/')
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
        id: req._parsedUrl.search,
        customerStatus,
        disabled: false,
        order,
        notFill: false
    })
    }
})

order.post('/find', checkSessionId, async (req, res) => {
    let options = {
        path : 'client',
        select : 'name'
    }
    const tmp = await Order.find().populate(options).find({'client.name': {$eq: 'ivan' }})
    console.log(tmp)
    // const orders = await (await Order.find()
    //     .populate(options))
    //     .filter(item => item.client.name === req.body.query)
    // res.render('order', {
    //     orders,
    //     pagination: false
    // })
})

module.exports = { order }
