const Router = require ('express')

enter = Router()

enter.post('/', (req, res) => {
    console.log(req.body)
})

module.exports = { enter }