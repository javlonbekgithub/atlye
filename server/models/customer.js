const { Schema, model } = require('mongoose')
   
const customers = new Schema ({
    name: String,
    addres: String,
    telephone: String,
    e_mail: String,
    status: Number,
    birthday: String,
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
    employee: {
        type: Schema.Types.ObjectId, 
        ref: 'Employees'
    },
    photo: String,
})

const Customer = model('Customer', customers)

module.exports = { Customer }
