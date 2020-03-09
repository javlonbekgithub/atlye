const { Router } = require ('express')
const { User } = require('../models/user')
const { Overhead_List } = require( '../models/overheadList')
const { checkSessionId, goodsCode, unity, enterCode} = require('../helpers')
// const strtotime = require('strtotime')

const overhead_list = Router()

overhead_list.get('/', checkSessionId, async (req, res) => {
    const overheadListFromDb = await Overhead_List.find()
    res.render('overhead-list', {
        overheadListFromDb,
        goodsCode,
        unity
    })
})

overhead_list.get('/add', checkSessionId, async (req, res) => {
    res.render('add-overhead', {
        goodsCode,
        unity,
        enterCode,
        overhead: false,
        notFill: true
    })
})

overhead_list.post('/add', checkSessionId, async (req, res) => {
    const overhead = req.body
    const { codeGoods, artikul, goods, priceForOne, unityMeter, quantityMaterial, colorMaterial, sumMaterial, enterCodeMaterial } = overhead
    if(codeGoods && artikul && goods && priceForOne && unityMeter && quantityMaterial && colorMaterial && sumMaterial && enterCodeMaterial ) {
        await Overhead_List.insertMany([overhead])
        res.redirect('./')
    } else {
        res.render('add-overhead', {
            goodsCode,
            unity,
            enterCode,
            overhead,
            notFill: false
        })
    }
})

module.exports = { overhead_list }
