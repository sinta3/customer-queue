const Insurance = require('../ models/insuranceModel')

async function addInsurance(req, res) {
    try {
        const data = req.body
        const isNotValid = new Insurance(data).validateSync()
        if (isNotValid) return res.status(400).json({ msg: 'input tidak valid!' })

        await data.save()
        res.status(200).json({ msg: 'success' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'error' })
    }
}

async function getInsurance(req, res) {
    try {
        const data = await Insurance.find()
        res.status(200).json({ data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'error' })
    }
}

module.exports = {
    addInsurance,
    getInsurance
}
