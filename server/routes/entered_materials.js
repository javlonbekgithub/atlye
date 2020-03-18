const { Router } = require ('express')
const { User } = require('../models/user')
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
    console.log(req.body)
    const { typeOperation, dateOperation, document, sumEnter, paidStatus, supplier } = req.body
    const enteredMaterials = req.body
    console.log('1: ', typeOperation[0] === true)
    console.log('2: ', typeOperation.length > 1 )
    if( 1 < 0 ) {
        console.log('trrrrruue')
        enteredMaterials.dateOperation = strtotime(enteredMaterials.dateOperation)
        await Entered_Materials.insertMany([enteredMaterials])
        res.redirect('./')
    } else {
        console.log('fa-eye-slash')
        res.render('add-entered-materials', {
            operation,
            documentList,
            statusPaid,
            array: document,
            _id: '',
            enteredMaterials,
            notFill: false
        })
    }
})

module.exports = { entered_materials }
