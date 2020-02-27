const { Schema, model } = require('mongoose')
   
const customers = new Schema ({
    name: String,
    addres: String,
    telephone: String,
    e_mail: String,
    statusClient: String,
    birthday: String,
    infoPassport: String,
    shape: String,
    size: String,
    notes: String,
    source: String,
    employee: {
        type: Schema.Types.ObjectId, 
        ref: 'Employees'
    },
    photo: String
})

const Customer = model('Customer', customers)

module.exports = { Customer }
