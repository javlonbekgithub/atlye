const { Router } = require ('express')
const { Overhead_List } = require( '../models/overheadList')
const { checkSessionId, goodsCode, unity, enterCode, operation, documentList, statusPaid, titlesAndRoutes } = require('../helpers')

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
        titles: titlesAndRoutes.addOverhead,
        _id: '',
        overhead: false,
        notFill: true
    })
})

overhead_list.post('/add', checkSessionId, async (req, res) => {
    const overhead = req.body
    const { codeGoods, artikul, goods, priceForOne, unityMeter, quantityMaterial, colorMaterial, sumMaterial, enterCodeMaterial } = overhead
    if(codeGoods && artikul && goods && priceForOne && unityMeter && quantityMaterial && colorMaterial && sumMaterial && enterCodeMaterial ) {
        const insertedOverhead = await Overhead_List.insertMany([overhead])
        res.render('add-entered-materials', {
            operation,
            documentList,
            statusPaid,
            array: [1],
            _id: insertedOverhead[0]._id,
            notFill: true,
            enteredMaterials: {
                typeOperation: [],
                dateOperation: [],
                document: [],
                sumEnter: [],
                paidStatus: [],
                supplier: [],
                noticeOperation: [],
            }
        })
    } else {
        res.render('add-overhead', {
            goodsCode,
            unity,
            enterCode,
            overhead,
            titles: titlesAndRoutes.addOverhead,
            _id: '',
            notFill: false
        })
    }
})

overhead_list.get('/copy', checkSessionId, async (req, res) => {
    const overhead = await Overhead_List.findById(req._parsedUrl.query)
    res.render('add-overhead', {
        goodsCode,
        unity,
        enterCode,
        titles: titlesAndRoutes.addOverhead,
        _id: '',
        overhead,
        notFill: true
    })
})

overhead_list.get('/edit', checkSessionId, async (req, res) => {
    const overhead = await Overhead_List.findById(req._parsedUrl.query)
    res.render('add-overhead', {
        goodsCode,
        unity,
        enterCode,
        titles: titlesAndRoutes.editOverhead,
        _id: req._parsedUrl.search,
        overhead,
        notFill: true
    })
})

overhead_list.post('/edit', checkSessionId, async (req, res) => {
    const overhead = req.body
    const { codeGoods, artikul, goods, priceForOne, unityMeter, quantityMaterial, colorMaterial, sumMaterial, enterCodeMaterial } = overhead
    if(codeGoods && artikul && goods && priceForOne && unityMeter && quantityMaterial && colorMaterial && sumMaterial && enterCodeMaterial ) {
        const rres = await Overhead_List.findByIdAndUpdate(req._parsedUrl.query , overhead)
        console.log(rres)
        res.redirect('./')
    } else {
        res.render('add-overhead', {
            goodsCode,
            unity,
            enterCode,
            overhead,
            _id: req._parsedUrl.search,
            titles: titlesAndRoutes.editOverhead,
            notFill: false
        })
    }
})

module.exports = { overhead_list }
