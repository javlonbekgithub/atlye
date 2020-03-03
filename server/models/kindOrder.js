const { Schema, model } = require('mongoose')

const kindOrders = new Schema ({
    name: String,
    price: Number
})

const KindOrder = model('KindOrders', kindOrders)

module.exports = { KindOrder }