const { Router } = require ('express')
const { User } = require('../models/user')
const { TryOn } = require('../models/tryOn.js')
const { checkSessionId } = require('../helpers')


const try_on = Router()

try_on.get('/', checkSessionId, async (req, res) => {
    let options = {
        path : 'client',
        select : 'name'
    }
    const try_onFromDb = await TryOn.find().populate(options)
    res.render('try-on', {
        try_onFromDb
    })
})

module.exports = { try_on }
