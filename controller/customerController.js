const Customer = require('../ models/customerModel')
const Insurance = require('../ models/insuranceModel')
const moment = require('moment')

async function addCustomer(req, res) {
    try {
        const data = req.body
        const isNotValid = new Customer(data).validateSync()
        console.log(isNotValid)
        if (isNotValid) return res.status(400).json({ msg: 'input tidak valid!' })

        const registeredCustomer = await Customer.countDocuments({
            registration_date: data.registration_date,
            insurance_id: data.insurance_id
        })

        const allRegisteredCustomer = await Customer.countDocuments()
        data.registration_no = allRegisteredCustomer + 1
        data.queue_number = registeredCustomer + 1

        const save = await new Customer(data).save()
        const insurance = await Insurance.findById(data.insurance_id)

        res.redirect('/page/home')
        // res.status(200).json({
        //     msg: 'success',
        //     data: {
        //         ...save,
        //         queue_code: `${insurance?.code}${
        //             '000'.slice((data.queue_number + 1).toString().length) + (data.queue_number + 1)
        //         }`
        //     }
        // })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'error' })
    }
}

async function getAllCustomer(req, res) {
    try {
        const { skips, limits } = getPagination(req.query)
        const { search, date } = req.query

        let query = { $and: [{}] }
        if (date) {
            query.$and.push({
                registration_date: date
            })
        }

        if (search) {
            search = new RegExp(`.*${search}.*`, 'i')
            query.$and.push({
                $or: [{ customer_name: search }, { address: search }, { city: search }]
            })
        }

        const data = await Customer.find(query).populate('insurance_id').sort('queue_number').skip(skips).limit(limits)
        if (data.length) {
            res.status(200).json({ data, count: await Customer.countDocuments(query), msg: 'success' })
        } else res.status(200).json({ msg: 'not found' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'error' })
    }
}

async function getCustomerById(req, res) {
    try {
        const { id_customer } = req.params
        const data = await Customer.findById(id_customer).populate('insurance_id')
        if (data) {
            data.insurance_name = data?.insurance_id?.insurance_name
            data.queue_code = `${data?.insurance_id?.code}${
                '000'.slice((data.queue_number + 1).toString().length) + (data.queue_number + 1)
            }`
            data.insurance_id = data?.insurance_id?._id

            res.status(200).json({ data })
        } else res.status(200).json({ msg: 'not found' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'error' })
    }
}

//helper
function getPagination(query) {
    let limits = Number.MAX_SAFE_INTEGER
    let skips = 0

    if (query.page && query.itemCount) {
        skips = (parseInt(query.page) - 1) * parseInt(query.itemCount)
        limits = parseInt(query.itemCount)

        // Validate input
        skips = Math.min(skips, Number.MAX_SAFE_INTEGER)
        skips = Math.max(0, skips)

        limits = Math.min(limits, Number.MAX_SAFE_INTEGER)
        limits = Math.max(0, limits)
    }
    return { limits, skips }
}

module.exports = {
    getAllCustomer,
    getCustomerById,
    addCustomer
}
