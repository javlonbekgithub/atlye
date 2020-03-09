const { Schema, model } = require('mongoose')
   
const orders = new Schema ({
    numberOrder: Number,
    dateOrder: Number,
    typeOrder: {
        type: Schema.Types.ObjectId,
        ref: 'KindOrders'
    },
    customerMaterial: String,
    sumOrder: Number,
    paid: Number,//delete
    debt: Number,//delete
    customerStatus: Number,
    executor: {
        type: Schema.Types.ObjectId, 
        ref: 'Employees'
    },
    responsible: {
        type: Schema.Types.ObjectId, 
        ref: 'Users'
    },
    notice: String,
    client: {
        type: Schema.Types.ObjectId, 
        ref: 'Customer'
    }
    

})

const Order = model('Order', orders)

module.exports = { Order }
