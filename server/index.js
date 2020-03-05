const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const { login, sessionId } = require('./routes/login')
const { profile } = require('./routes/profile')
const { try_on } = require('./routes/try_on')
const { order } = require('./routes/order')
const { balance } = require('./routes/balance')
const { connect, connection } = require('mongoose')


const uri = 'mongodb://localhost/atelier'
connect(uri , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false 
})

const server = express()
server.set('view engine', 'ejs')
server.use(bodyParser.urlencoded({ extended: true }))
server.use(morgan('combined'))
server.use('/login', login)
server.use(session({
    genid: (req) => {
        return sessionId
    },
    secret: 'session',
    cookie: { 
        maxAge: 60000,
        _expires: 100000
    },
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    maxAge: 3600000
}))
server.use(express.static('public'))
server.get('/', (req, res) => res.render('index'))
server.use('/profile', profile)
server.use('/order', order)
server.use('/try-on', try_on)
server.use('/balance', balance)

const PORT = process.env.PORT || 3001

connection.once('open',() => server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`)))
