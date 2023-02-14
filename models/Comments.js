const mongoose = require('mongoose')
const { Schema, model } = mongoose

const commentSchema = new Schema({
    content: String,
    date: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    author: String,
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }

})

commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Comment = model('Comment', commentSchema)

module.exports = Comment