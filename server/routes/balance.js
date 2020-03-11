const { Router } = require ('express')
const { Customer } = require('../models/customer')
const { checkSessionId } = require('../helpers')
const { Payment } = require('../models/payment')


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
    let customers = await Customer.find().populate(options).populate(options2)
    const customerBalance = []
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
    res.render('balance', {
        customerBalance
    })
})

balance.get('/fill-in', checkSessionId, async (req, res) => {
    const customer = await Customer.findOne({ '_id': req._parsedUrl.query})
    res.render('fill-in', { 
        customer,
        payment: false,
        notFill: true 
    })
})

balance.post('/fill-in', checkSessionId, async (req, res) => {
    const payment = req.body
    if(payment) {
        payment.datePayment = Date.now() * 1000
        const addedPayment = await Payment.insertMany([payment]) 
        await Customer.findByIdAndUpdate(
            payment.client,
            { $push: { 
                payments : addedPayment[0]._id 
            } }
            )
        res.redirect('./')
    } else {
        const customer = await Customer.findOne({ '_id': req.body.customerId})
        res.render('fill-in', { 
            customer,
            payment,
            notFill: false 
        })
    }
})

module.exports = { balance }
