const uniqueValidator = require('mongoose-unique-validator')
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    lastname: String,
    passwordHash: String,
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    avatar: String
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    }
})
userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User