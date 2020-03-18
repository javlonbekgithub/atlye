const { Router } = require ('express')
const { User } = require('../models/user')
const { Overhead_List } = require( '../models/overheadList')
const { Entered_Materials } = require( '../models/entered_material')
const { checkSessionId, operation, documentList, statusPaid } = require('../helpers')
const strtotime = require('strtotime')

const entered_materials = Router()

entered_materials.get('/', checkSessionId, async (req, res) => {
    const entered_materials_db = await Entered_Materials.find()
    res.render('entered-materials', {
        entered_materials_db,
        operation,
        documentList,
        statusPaid,
    })
})

entered_materials.get('/add', checkSessionId, async (req, res) => {
    res.render('add-entered-materials', {
        operation,
        documentList,
        statusPaid,
        array: [1],
        _id: '',
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
        res.redirect('/overhead-list/')
    } else {
        res.render('add-entered-materials', {
            operation,
            documentList,
            statusPaid,
            array: document,
            _id: req._parsedUrl.query,
            enteredMaterials,
            notFill: false
        })
    }
})

module.exports = { entered_materials }
