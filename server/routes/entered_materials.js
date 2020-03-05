const { Router } = require ('express')
const { User } = require('../models/user')
const { error, operation, document, statusPaid } = require('../helpers')

const entered_materials = Router()

entered_materials.get('/', async (req, res) => {
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
        res.render('entered-materials')
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

entered_materials.get('/add', async (req, res) => {
    const user = await User.findOne({ sessionId: req.sessionID })
    if(user) {
        res.render('add-entered-materials', {
            operation,
            document,
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
    const {  }
    if(user) {
        if() {

        } else {
            res.render('add-entered-materials', {
                operation,
                document,
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
