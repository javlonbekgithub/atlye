const { Schema, model } = require('mongoose')

const employees = new Schema ({
    name: String
})

const Employee = model('Employees', employees)

module.exports = { Employee }