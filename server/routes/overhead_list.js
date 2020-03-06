const { Router } = require ('express')
const { User } = require('../models/user')
const { Overhead_List } = require( '../models/overheadList')
const { error, goodsCode, unity, enterCode} = require('../helpers')
// const strtotime = require('strtotime')

const overhead_list = Router()

overhead_list.get('/', async (req, res) => {
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
        const overheadListFromDb = await Overhead_List.find()
        res.render('overhead-list', {
            overheadListFromDb,
            goodsCode,
            unity
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

overhead_list.get('/add', async (req, res) => {
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
        res.render('add-overhead', {
            goodsCode,
            unity,
            enterCode,
            overhead: false,
            notFill: true
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

overhead_list.post('/add', async (req, res) => {
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
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
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

module.exports = { overhead_list }
