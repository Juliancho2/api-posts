const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const loginRouter = require('express').Router()

loginRouter.post('/', async (req, res) => {
    const { body } = await req
    const { username, password } = await body
    const user = await User.findOne({ username })

    const passwordCorrect = user === null
        ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: "Invalid user of password"
        })
    }
    const userForToken = {
        id: user._id,
        username: user.username,

    }

    const token = jwt.sign(
        userForToken, process.env.SECRET, {
        expiresIn: 60 * 60 * 24 * 7
    })

    return res.send({
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        userId: user.id,
        token
    })
})

module.exports = loginRouter