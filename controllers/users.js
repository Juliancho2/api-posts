const bcrypt = require('bcrypt')
const User = require('../models/User')
const userRouter = require('express').Router()

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('posts', {
        title: 1,
        content: 1,
        imgUrl: 1
    })

    res.json(users)
})

userRouter.post('/', async (request, response) => {
    try {
        const { body } = request
        const { username, name, lastname, password, avatar } = body


        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            name,
            lastname,
            passwordHash,
            avatar,
        })

        const savedUser = await user.save()
        response.status(201).json(savedUser)

    } catch (error) {
        console.error(error)
        response.status(400).json({ error })

    }

})

module.exports = userRouter