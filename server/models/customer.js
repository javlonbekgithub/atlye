const { Schema, model } = require('mongoose')
   
const customers = new Schema ({
    name: String,
    addres: String,
    telephone: String,
    e_mail: String,
    status: Number,
    birthday: Number,
    infoPassport: String,
    shape: Number,
    size: Number,
    notes: String,
    source: Number,
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    payments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Payment'
        }
    ],
    employee: {
        type: Schema.Types.ObjectId, 
        ref: 'Employees'
    },
    photo: String,
})

const Customer = model('Customer', customers)

module.exports = { Customer }
