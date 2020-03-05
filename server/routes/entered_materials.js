const { Router } = require ('express')
const { User } = require('../models/user')
const { Entered_Materials } = require( '../models/entered_material')
const { error, operation, documentList, statusPaid } = require('../helpers')
const strtotime = require('strtotime')

const entered_materials = Router()

entered_materials.get('/', async (req, res) => {
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
        const entered_materials_db = await Entered_Materials.find()
        res.render('entered-materials', {
            entered_materials_db,
            operation,
            documentList,
            statusPaid,
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

entered_materials.get('/add', async (req, res) => {
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
        res.render('add-entered-materials', {
            operation,
            documentList,
            statusPaid,
            notFill: true,
            enteredMaterials: false
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

entered_materials.post('/add', async (req, res) => {
    const user = await User.findOne({ sessionId: req.sessionID })
    const { typeOperation, dateOperation, document, sumEnter, paidStatus, supplier } = req.body
    if(user) {
        const enteredMaterials = req.body
        if( typeOperation && dateOperation && document && sumEnter && paidStatus && supplier ) {
            enteredMaterials.dateOperation = strtotime(enteredMaterials.dateOperation)
            await Entered_Materials.insertMany([enteredMaterials])
            res.redirect('./')
        } else {
            res.render('add-entered-materials', {
                operation,
                documentList,
                statusPaid,
                enteredMaterials,
                notFill: false
            })
        }
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

module.exports = { entered_materials }
