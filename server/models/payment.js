const { Schema, model } = require('mongoose')
   
const payments = new Schema ({
    datePayment: Number,
    paid: Number,
    client: {
        type: Schema.Types.ObjectId, 
        ref: 'Customer'
    }
})

const Payment = model('Payment', payments)

module.exports = { Payment }
