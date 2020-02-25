const express = require('express')
const { enter } = require('./api/enter')
const bodyParser = require('body-parser')

const server = express()


server.use(bodyParser.urlencoded({ extended: true }));

server.set('view engine', 'ejs')
server.use(express.static('public'))
server.get('/', (req, res) => res.render('index'))
server.get('/login', (req, res) => res.render('login'))
server.use('/enter', enter)


server.listen(3000, () => console.log('Example server listening on port 3000!'))