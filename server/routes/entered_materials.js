const { Router } = require ('express')
const { User } = require('../models/user')
const { error, typeOperation, document } = require('../helpers')

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
            typeOperation,
            document
        })
    } else {
        res.render('login', { incorrect: error.messages.expired } )
    }
})

module.exports = { entered_materials }
