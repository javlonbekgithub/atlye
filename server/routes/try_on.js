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
    let skip = parseInt(req._parsedUrl.query) || 0
    let limit = 5
    let next = limit + skip
    let prev = next - limit * 2
    const total = await TryOn.find().count()
    let try_onFromDb = await TryOn.find()
        .populate(options)
        .skip(skip)
        .limit(limit)
    res.render('try-on', {
        try_onFromDb,
        prev,
        next,
        total,
        limit
    })
})

module.exports = { try_on }
