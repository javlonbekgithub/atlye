const { Router } = require ('express')
const { User } = require('../models/user')
const { Overhead_List } = require( '../models/overheadList')
const { Entered_Materials } = require( '../models/entered_material')
const { checkSessionId, operation, documentList, statusPaid, titlesAndRoutes } = require('../helpers')
const strtotime = require('strtotime')

const entered_materials = Router()

entered_materials.get('/', checkSessionId, async (req, res) => {
    let skip = parseInt(req._parsedUrl.query) || 0
    let limit = 5
    let next = limit + skip
    let prev = next - limit * 2
    const e_materials_db = req.currentUser.query
    let total = e_materials_db.length
    const entered_materials_db = e_materials_db.slice(skip, next)
    res.render('entered-materials', {
        entered_materials_db,
        operation,
        documentList,
        statusPaid,
        _id: entered_materials_db[0].overhead,
        prev,
        next,
        total,
        limit
    })
})

entered_materials.get('/add', checkSessionId, async (req, res) => {
    res.render('add-entered-materials', {
        operation,
        documentList,
        statusPaid,
        array: [1],
        _id: req._parsedUrl.query,
        back: `/overhead-list/show?${req._parsedUrl.query}`,
        notFill: true,
        titles: titlesAndRoutes.addMaterial,
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
})

entered_materials.post('/add', checkSessionId, async (req, res) => {
    const { typeOperation, dateOperation, document, sumEnter, paidStatus, supplier, noticeOperation } = req.body
    const enteredMaterials = req.body
    const volume = []
    let toggle = false
    typeOperation.map((item, i) => {
        volume.push({
            typeOperation: undefined,
            dateOperation: undefined,
            document: undefined,
            noticeOperation: undefined,
            sumEnter: undefined,
            paidStatus: undefined,
            supplier: undefined,
            overhead: req._parsedUrl.query
        })
        if(item !== '' && dateOperation[i] !== '' && document[i] !== '' && sumEnter[i] !== '' && paidStatus[i] !== '' && supplier[i] !== '')  {
            toggle = true
            volume[i].typeOperation = item
            volume[i].dateOperation = strtotime(dateOperation[i])
            volume[i].document = document[i]
            volume[i].noticeOperation = noticeOperation[i]
            volume[i].sumEnter = sumEnter[i]
            volume[i].paidStatus = paidStatus[i]
            volume[i].supplier = supplier[i]
        } else {
            toggle = false
        }
    })
    if(toggle) {
        const materialsDb = await Entered_Materials.insertMany(volume)
        await Overhead_List.findByIdAndUpdate(
            req._parsedUrl.query,
            { $push: { 
                materials: materialsDb.map(item => (item._id)),
            } }
        )
        res.redirect(`/overhead-list/show?${req._parsedUrl.query}`)
    } else {
        res.render('add-entered-materials', {
            operation,
            documentList,
            statusPaid,
            array: document,
            _id: req._parsedUrl.query,
            back: `/overhead-list/show?${req._parsedUrl.query}`,
            titles: titlesAndRoutes.addMaterial,
            enteredMaterials,
            notFill: false
        })
    }
})

entered_materials.get('/copy', checkSessionId, async (req, res) => {
    const originalMaterialDb = await Entered_Materials.findById(req._parsedUrl.query)
    const enteredMaterials = {
        typeOperation: [originalMaterialDb.typeOperation],
        dateOperation: [new Date(originalMaterialDb.dateOperation * 1000).toISOString().slice(0, 10)],
        document: [originalMaterialDb.document],
        sumEnter: [originalMaterialDb.sumEnter],
        paidStatus: [originalMaterialDb.paidStatus],
        supplier: [originalMaterialDb.supplier],
        noticeOperation: [originalMaterialDb.noticeOperation],
    }
    res.render('add-entered-materials', {
        operation,
        documentList,
        statusPaid,
        array: [1],
        _id: originalMaterialDb.overhead,
        back: `/overhead-list/show?${originalMaterialDb.overhead}`,
        titles: titlesAndRoutes.addMaterial,
        notFill: true,
        enteredMaterials
    })
})

entered_materials.get('/edit', checkSessionId, async (req, res) => {
    const originalMaterialDb = await Entered_Materials.findById(req._parsedUrl.query)
    const enteredMaterials = {
        typeOperation: [originalMaterialDb.typeOperation],
        dateOperation: [new Date(originalMaterialDb.dateOperation * 1000).toISOString().slice(0, 10)],
        document: [originalMaterialDb.document],
        sumEnter: [originalMaterialDb.sumEnter],
        paidStatus: [originalMaterialDb.paidStatus],
        supplier: [originalMaterialDb.supplier],
        noticeOperation: [originalMaterialDb.noticeOperation],
    }
    res.render('add-entered-materials', {
        operation,
        documentList,
        statusPaid,
        array: [1],
        _id: req._parsedUrl.query,
        back: `/overhead-list/show?${originalMaterialDb.overhead}`,
        titles: titlesAndRoutes.editMaterial,
        notFill: true,
        enteredMaterials
    })
})

entered_materials.post('/edit', checkSessionId, async (req, res) => {
    const { typeOperation, dateOperation, document, sumEnter, paidStatus, supplier, noticeOperation } = req.body
    const enteredMaterials = req.body
    const volume = []
    let toggle = false
    typeOperation.map((item, i) => {
        volume.push({
            typeOperation: undefined,
            dateOperation: undefined,
            document: undefined,
            noticeOperation: undefined,
            sumEnter: undefined,
            paidStatus: undefined,
            supplier: undefined,
        })
        if(item !== '' && dateOperation[i] !== '' && document[i] !== '' && sumEnter[i] !== '' && paidStatus[i] !== '' && supplier[i] !== '')  {
            toggle = true
            volume[i].typeOperation = item
            volume[i].dateOperation = strtotime(dateOperation[i])
            volume[i].document = document[i]
            volume[i].noticeOperation = noticeOperation[i]
            volume[i].sumEnter = sumEnter[i]
            volume[i].paidStatus = paidStatus[i]
            volume[i].supplier = supplier[i]
        } else {
            toggle = false
        }
    })
    if(toggle) {
        const materialsDb = await Entered_Materials.findByIdAndUpdate(req._parsedUrl.query, volume[0])
        res.redirect(`/overhead-list/show?${materialsDb.overhead}`)
    } else {
        res.render('add-entered-materials', {
            operation,
            documentList,
            statusPaid,
            array: document,
            _id: `/overhead-list/show?${req._parsedUrl.query}`,
            titles: titlesAndRoutes.editMaterial,
            enteredMaterials,
            notFill: false
        })
    }
})

entered_materials.post('/find', checkSessionId, async (req, res) => {
    let skip = 0
    let limit = 5
    let next = limit + skip
    let prev = next - limit * 2
    const e_materials_db = await Entered_Materials.find({overhead: req._parsedUrl.query})
    let entered_materials_db = []
    req.body.query && entered_materials_db.push(e_materials_db[parseInt(req.body.query)])
    // let total = e_materials_db.length 
    await User.findByIdAndUpdate(
        req.currentUser._id, 
        { $set: { query: entered_materials_db }} )
    res.render('entered-materials', {
        entered_materials_db,
        operation,
        documentList,
        statusPaid,
        _id: req._parsedUrl.query,
        prev,
        next,
        total: false,
        limit
    })
})

module.exports = { entered_materials }
