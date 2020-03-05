const { Router } = require ('express')
const { Customer } = require('../models/customer')
const { User } = require('../models/user')
const { error } = require('../helpers')


const balance = Router()

balance.get('/', async (req, res) => {
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
        const options = {
            path: 'orders',
            model: 'Order'
        }
        let customers = await Customer.find().populate(options)
        const customerBalance = []
        customers.map((item, i) => {
            customerBalance.push(
                {
                    name: item.name,
                    additional: 0,
                    paid: 0
                }
            )
            item.orders.map((order) => {
                customerBalance[i].additional += order.sumOrder
                customerBalance[i].paid += order.paid
            })
        })
        res.render('balance', {
            customerBalance
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

module.exports = { balance }
