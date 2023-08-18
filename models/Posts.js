const mongoose = require('mongoose')
const { Schema, model } = mongoose

const postSchema = new Schema({
    title:String,
    content: String,
    date: Date,
    cover:String,
    tags:Array,
    likesBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    likesNumber: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Post = model('Post', postSchema)

module.exports = Post
