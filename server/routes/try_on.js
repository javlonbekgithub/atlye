const { Router } = require ('express')
const { User } = require('../models/user')
const { TryOn } = require('../models/tryOn.js')
const { Customer } = require('../models/customer')
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
    let total
    let try_onFromDb
    const globalTryOns = req.currentUser.query
    if(globalTryOns.length < 1) {
        total = await TryOn.find().count()
        try_onFromDb = await TryOn.find()
        .populate(options)
        .skip(skip)
        .limit(limit)
    } else {
        let tmp = await Customer.findOne({'_id': globalTryOns[0].client})
        for(let i = 0; i < globalTryOns.length; i++){
            globalTryOns[i].client.name = tmp.name
        }
        total = globalTryOns.length
        try_onFromDb = globalTryOns.slice(skip, next)
    }
    res.render('try-on', {
        try_onFromDb,
        prev,
        next,
        total,
        limit
    })
})

try_on.post('/find', checkSessionId, async (req, res) => {
    let options = {
        path : 'client',
        select : 'name'
    }
    let skip = parseInt(req._parsedUrl.query) || 0
    let limit = 5
    let next = limit + skip
    let prev = next - limit * 2
    const tryOnsFromDb = await (await TryOn.find()
        .populate(options))
        .filter(item => item.client.name.startsWith(req.body.query))
    await User.findByIdAndUpdate(
        req.currentUser._id, 
        { $set: { query: tryOnsFromDb }} )
    const total = tryOnsFromDb.length
    const try_onFromDb = tryOnsFromDb.slice(skip, next)
    res.render('try-on', {
        try_onFromDb,
        total,
        prev,
        next,
        limit
    })
})


module.exports = { try_on }
