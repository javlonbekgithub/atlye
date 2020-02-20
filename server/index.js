const express = require('express')
const server = express()

server.set('view engine', 'ejs')
server.use(express.static('public'))
server.get('/', function (req, res) {
    res.render('index',{test: 'firstTime'})
})
server.get('/second', function (req, res) {
    res.render('index',{test: 'secondTime'})
})

server.listen(3000, () => {console.log('Example server listening on port 3000!')})