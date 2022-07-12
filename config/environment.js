require('dotenv').config()

module.exports = {
    DATABASE: process.env.MONGO_URL,
    PORT: process.env.PORT
}
