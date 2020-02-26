const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const { login } = require('./routes/login')
const { connect, connection } = require('mongoose')

const uri = 'mongodb://localhost/atelier'

connect(uri , {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const server = express()

server.use(bodyParser.urlencoded({ extended: true }));
server.use(morgan('combined'))
server.use(session({ secret: 'session' }))
server.set('view engine', 'ejs')
server.use(express.static('public'))
server.get('/', (req, res) => res.render('index'))
server.use('/login', login)

const PORT = process.env.PORT || 3000

connection.once('open',() => server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`)))
