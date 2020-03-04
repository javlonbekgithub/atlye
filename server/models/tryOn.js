const { Schema, model } = require('mongoose')

const try_on = new Schema ({
    date: Number,
    type: String,
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }
})

const tryOn = model('try_on', try_on)

module.exports = { tryOn }