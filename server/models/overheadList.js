const { Schema, model } = require('mongoose')
   
const overhead_list = new Schema ({
    codeGoods: Number,
    artikul: String,
    goods: String,
    priceForOne: Number,
    unityMeter: Number,
    noticeOverhead: String,
    quantityMaterial: Number,
    colorMaterial: String,
    sumMaterial: Number,
    enterCodeMaterial: Number,
    materials: [{
        type: Schema.Types.ObjectId,
        ref: 'entered_materials'
    }],
})

const Overhead_List = model('overhead_lists', overhead_list)

module.exports = { Overhead_List }
