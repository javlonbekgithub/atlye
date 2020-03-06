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

module.exports = {
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
    enterCode   
}