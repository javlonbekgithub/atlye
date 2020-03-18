const { User } = require('./models/user')

const checkSessionId = async (req, res, next) => {
    const dbRes = await User.findOne({ sessionId: req.sessionID })
    if(dbRes) {
        if(!req._parsedUrl.query) {
            req.currentUser = await User.findByIdAndUpdate(
                dbRes._id, 
                { $set: { query: [] }} )
            req.currentUser.query = []
        } else {
            req.currentUser = dbRes
        }
        next()
    } else {
        res.render('login', { incorrect: error.messages.expired })
    }
}

const error = {
    messages: {
        incorrectPasswordOrLogin: 'неправильный пароль или логин',
        fillField: 'заполните поле',
        expired: 'сессия окончено'
    }
}

let URL = 'http://localhost:3001/'

const orderStatus = [
    {
        name: 'неважный',
        value: 0
    },
    {
        name: 'важный',
        value: 0
    },
]

const customerStatus = [
    {
        name: 'новый',
        value: 0
    },
    {
        name: 'постоянный',
        value: 1
    },
    {
        name: 'VIP',
        value: 2
    }
]

const sourceInfo = [
    {
        name: 'реклама',
        value: 0
    },
    {
        name: 'другой',
        value: 1
    },
]

const typeShape = [
    {
        name: 'худая',
        value: 0
    },
    {
        name: 'жирная',
        value: 1
    }
]

const sizes = [
    {
        name: 'm',
        value: 0
    },
    {
        name: 's',
        value: 1
    },
    {
        name: 'xl',
        value: 2
    },
    {
        name: 'xxxxxl',
        value: 4
    }
]

const operation = [
    {
        name: 'приход',
        value: 0
    },
    {
        name: 'уход',
        value: 1
    }
]

const documentList = [
    {
        name: 'уход',
        value: 0
    },
    {
        name: 'номер накладного',
        value: 1
    }
]

const statusPaid = [
    {
        name: 'оплачено',
        value: 0
    },
    {
        name: 'неоплачено',
        value: 1
    }
]

const goodsCode = [
    {
        name: 'something',
        value: 0
    },
    {
        name: 'уход',
        value: 1
    }
]

const unity = [
    {
        name: 'метер',
        value: 0
    },
    {
        name: 'рулон',
        value: 1
    }
]

const enterCode = [
    {
        name: '1',
        value: 0
    },
    {
        name: '2',
        value: 1
    }
]

const titlesAndRoutes = {
    add: {
        h1: 'создать заказ',
        btn:  'добавить',
        action: '/order/add'
    },
    edit: {
        h1: 'изменить заказ',
        btn:  'изменить',
        action: '/order/edit'
    },
    show: {
        h1: 'смотреть заказ',
        btn:  'изменить',
        action: '/order/'
    },
    addOverhead: {
        h1: 'создать накладной',
        btn:  'добавить',
        action: './add'
    },
    editOverhead: {
        h1: 'изменить накладной',
        btn:  'изменить',
        action: './edit'
    },
    addMaterial: {
        h1: 'добавить поступивший материал',
        btn:  'добавить',
        action: '/entered-materials/add'
    },
    editMaterial: {
        h1: 'изменить поступивший материал',
        btn:  'изменить',
        action: '/entered-materials/edit'
    },
}

module.exports = {
    checkSessionId,
    error,
    URL,
    orderStatus,
    customerStatus,
    sourceInfo,
    typeShape,
    sizes,
    operation,
    documentList,
    statusPaid,
    goodsCode,
    unity,
    enterCode,
    titlesAndRoutes,
}