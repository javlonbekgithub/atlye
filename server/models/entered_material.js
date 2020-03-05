const { Schema, model } = require('mongoose')
   
const entered_material = new Schema ({
    typeOperation: Number,
    dateOperation: Number,
    document: Number,
    noticeOperation: String,
    sumEnter: Number,
    paidStatus: Number,
    supplier: String
})

const Entered_Materials = model('entered_materials', entered_material)

module.exports = { Entered_Materials }
