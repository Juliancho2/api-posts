const mongoose = require('mongoose')
const { MONGO_DB_URI } = process.env

// MONGO_DB_URI_TEST, NODE_ENV 
// const connectionString = process.env.MONGO_DB_URI

// const connectionString = NODE_ENV === 'test'
//     ? MONGO_DB_URI_TEST : MONGO_DB_URI
const connectionString = MONGO_DB_URI
mongoose.set('strictQuery', false)


//conexion con mongodb
mongoose.connect(connectionString)
    .then(() => {
        console.log('Database connected')

    }).catch((err) => {
        console.log(err)
    })




