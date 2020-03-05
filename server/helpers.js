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
        value: 1
    },
    {
        name: 'важный',
        value: 2
    },
]

const customerStatus = [
    {
        name: 'новый',
        value: 1
    },
    {
        name: 'постоянный',
        value: 2
    },
    {
        name: 'VIP',
        value: 3
    }
]

const sourceInfo = [
    {
        name: 'реклама',
        value: 1
    },
    {
        name: 'другой',
        value: 2
    },
]

const typeShape = [
    {
        name: 'худая',
        value: 1
    },
    {
        name: 'жирная',
        value: 2
    }
]

const sizes = [
    {
        name: 'm',
        value: 1
    },
    {
        name: 's',
        value: 2
    },
    {
        name: 'xl',
        value: 3
    },
    {
        name: 'xxxxxl',
        value: 4
    }
]

const operation = [
    {
        name: 'приход',
        value: 1
    },
    {
        name: 'уход',
        value: 2
    }
]

const documentList = [
    {
        name: 'уход',
        value: 1
    },
    {
        name: 'номер накладного',
        value: 2
    }
]

const statusPaid = [
    {
        name: 'оплачено',
        value: 1
    },
    {
        name: 'неоплачено',
        value: 2
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
    statusPaid   
}