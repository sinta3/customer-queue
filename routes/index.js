var express = require('express')
var router = express.Router()
const insuranceController = require('../controller/insuranceController')
const customerController = require('../controller/customerController')
const Insurance = require('../ models/insuranceModel')
const Customer = require('../ models/customerModel')
const { jsPDF } = require('jspdf') // will automatically load the node version

/* GET home page. */
router.get('/home', async function (req, res, next) {
    let data = await Customer.find().populate('insurance_id').sort('queue_number')
    res.render('index.ejs', {
        queue: data.map((e) => {
            e.queue_code = `${e.insurance_id.code}${'000'.slice(e.queue_number.toString().length) + e.queue_number}`
            return e
        }),
        datamodal: {}
    })
})

router.get('/add-new', async function (req, res, next) {
    const data = await Insurance.find()
    res.render('add-new.ejs', { insurance: data })
})

router.post('/barcode', function (req, res, next) {
    let queue_code = req.body.queue
    // Landscape export, 2×4 inches
    res.render('barcode.ejs', {
        currentQueue: queue_code
    })
})

// customer
router.post('/customer', customerController.addCustomer)
router.get('/customer/:id_customer', customerController.getAllCustomer)
router.get('/customer/all', customerController.getCustomerById)

//insurance
router.post('/insurance', insuranceController.addInsurance)
router.get('/insurance/all', insuranceController.getInsurance)

module.exports = router
