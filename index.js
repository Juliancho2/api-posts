require('dotenv').config()
require('./mongo.js')

const express = require('express')
const cors = require('cors')
const postRouter = require('./controllers/posts')
const userRouter = require('./controllers/users')
const commentsRouter = require('./controllers/comments')
const loginRouter = require('./controllers/login')
const searchRouter = require('./controllers/search.js')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello world<h1/>')
})

require('dotenv').config()
app.use('/api/posts', postRouter)
app.use('/api/search', searchRouter)
app.use('/api/posts', commentsRouter)

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use((request, response) => {
    response.status(404).json({
        error: 'Not found'
    })
})

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Sever runing on port ${PORT}`)
})

module.exports = { app, server }