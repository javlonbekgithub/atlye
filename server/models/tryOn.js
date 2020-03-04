const { Schema, model } = require('mongoose')

const try_on = new Schema ({
    date: Number,
    typeTryOn: String,
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    notice: String,
    orderNumber: String
})

const TryOn = model('try_on', try_on)

module.exports = { TryOn }