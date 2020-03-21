const { Router } = require ('express')
const { Customer } = require('../models/customer')
const { checkSessionId } = require('../helpers')
const { Payment } = require('../models/payment')
const { User } = require('../models/user')

const balance = Router()

balance.get('/', checkSessionId, async (req, res) => {
    const options = {
        path: 'orders',
        model: 'Order'
    }
    const options2 = {
        path: 'payments',
        model: 'Payment'
    }
    let skip = parseInt(req._parsedUrl.query) || 0
    let limit = 5
    let next = limit + skip
    let prev = next - limit * 2
    let total
    let customerBalance = []
    const filteredBalances = req.currentUser.query
    if(filteredBalances.length < 1) {
        total = await Customer.find().count()
        const customers = await Customer.find()
            .populate(options)
            .populate(options2)
            .skip(skip)
            .limit(limit)
        customers.map((item, i) => {
            customerBalance.push({
                _id: item._id,
                name: item.name,
                additional: 0,
                paid: 0
            })
            item.orders.map(order => { customerBalance[i].additional += order.sumOrder })
            item.payments.map(item => { customerBalance[i].paid += item.paid })
        })
    } else {
        total = filteredBalances.length
        customerBalance = filteredBalances.slice(skip, next)
    }
    res.render('balance', {
        customerBalance,
        prev,
        next,
        total,
        limit
    })
})

balance.get('/fill-in', checkSessionId, async (req, res) => {
    const customer = await Customer.findOne({ '_id': req._parsedUrl.query})
    res.render('fill-in', { 
        customer,
        action: `./fill-in${req._parsedUrl.search}`,
        payment: false,
        notFill: true 
    })
})

balance.post('/fill-in', checkSessionId, async (req, res) => {
    const payment = req.body
    if(payment.paid) {
        payment.datePayment = Date.now()
        payment.client = req._parsedUrl.query
        const addedPayment = await Payment.insertMany([payment]) 
        await Customer.findByIdAndUpdate(
            req._parsedUrl.query,
                { $push: { 
                    payments : addedPayment[0]._id 
                } }
            )
        res.redirect('./')
    } else {
        const customer = await Customer.findOne({ '_id': req._parsedUrl.query})
        res.render('fill-in', { 
            customer,
            payment,
            action: `./fill-in${req._parsedUrl.search}`,
            notFill: false 
        })
    }
})

balance.get('/show', checkSessionId, async (req, res) => {
    const options = {
        path: 'payments',
        model: 'Payment'
    }
    const customer = await Customer.findOne({ '_id': req._parsedUrl.query}).populate(options)
    res.render('balance-show', { 
        customer
    })
})


balance.post('/find', checkSessionId, async (req, res) => {
    const options = {
        path: 'orders',
        model: 'Order'
    }
    const options2 = {
        path: 'payments',
        model: 'Payment'
    }
    let skip = 0
    let limit = 5
    let next = limit + skip
    let prev = next - limit * 2
    let customers = await (await Customer.find()
        .populate(options)
        .populate(options2))
        .filter(item => item.name.startsWith(req.body.query))
    const customerBalanceQuery = []
    customers.map((item, i) => {
        customerBalanceQuery.push({
            _id: item._id,
            name: item.name,
            additional: 0,
            paid: 0
        })
        item.orders.map(order => { customerBalanceQuery[i].additional += order.sumOrder })
        item.payments.map(item => { customerBalanceQuery[i].paid += item.paid })
    })
    await User.findByIdAndUpdate(
        req.currentUser._id, 
        { $set: { query: customerBalanceQuery }} )
    const total = customerBalanceQuery.length
    const customerBalance = customerBalanceQuery.slice(skip, next)
    res.render('balance', {
        customerBalance,
        total,
        prev,
        next,
        limit
    })
})

module.exports = { balance }
