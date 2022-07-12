const mongoose = require('mongoose')

const insuranceSchema = new mongoose.Schema({
    code: { type: String },
    insurance_name: { type: String }
})

const Insurance = mongoose.model('Insurance', insuranceSchema)
module.exports = Insurance
