const mongoose = require('mongoose')
const moment = require('moment')

const customerSchema = new mongoose.Schema({
    registration_no: { type: Number },
    customer_name: { type: String, required: true },
    pic: { type: String },
    address: { type: String },
    registration_date: { type: String, required: true },
    queue_number: { type: Number },
    insurance_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Insurance', required: true },
    phone: { type: String },
    request_description: { type: String },
    timestamps: {
        created_at: { type: String, default: () => moment().format() }
    }
})

const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer
