const { Router } = require ('express')
const { User } = require('../models/user')
const { Overhead_List } = require( '../models/overheadList')
const { Entered_Materials } = require( '../models/entered_material')
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
        let array = [1]
        const enteredMaterials = {
            typeOperation: [],
            dateOperation: [],
            document: [],
            sumEnter: [],
            paidStatus: [],
            supplier: [],
            noticeOperation: [],
        }
        const options = {
            path: 'materials',
            model: 'entered_materials'
        }
        const oldOverheadDb = await Overhead_List.findById(req._parsedUrl.query).populate(options)
        if(oldOverheadDb) {
            oldOverheadDb.materials.map(item => {
                enteredMaterials.typeOperation.push(item.typeOperation)
                enteredMaterials.dateOperation.push(new Date(item.dateOperation * 1000).toISOString().slice(0, 10))
                enteredMaterials.document.push(item.document)
                enteredMaterials.noticeOperation.push(item.noticeOperation)
                enteredMaterials.sumEnter.push(item.sumEnter)
                enteredMaterials.paidStatus.push(item.paidStatus)
                enteredMaterials.supplier.push(item.supplier)
            })
            array = enteredMaterials.document
        }
        res.render('add-entered-materials', {
            operation,
            documentList,
            statusPaid,
            array,
            _id: insertedOverhead[0]._id,
            notFill: true,
            enteredMaterials
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
        _id: req._parsedUrl.search,
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
        await Overhead_List.findByIdAndUpdate(req._parsedUrl.query , overhead)
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

overhead_list.get('/show', checkSessionId, async (req, res) => {
    const total = await Entered_Materials.find({overhead: req._parsedUrl.query}).count()
    let skip = 0
    let limit = 5
    let next = limit + skip
    let prev = next - limit * 2
    const e_materials_db = await Entered_Materials.find({overhead: req._parsedUrl.query})
    await User.findByIdAndUpdate(
        req.currentUser._id, 
        { $set: { query: e_materials_db }} )
    const entered_materials_db = e_materials_db.slice(skip, next)
    res.render('entered-materials', {
        entered_materials_db,
        operation,
        documentList,
        statusPaid,
        _id: req._parsedUrl.search,
        total,
        prev,
        next,
        limit
    })
})

module.exports = { overhead_list }
