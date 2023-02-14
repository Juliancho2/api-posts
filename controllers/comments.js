const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const userExtractor = require('../middleware/userExtractor');
const validateCommentData = require('../middleware/useValidateCommentData');
const Comment = require('../models/Comments')
const Post = require('../models/Posts')
const User = require('../models/User')

const commentsRouter = require('express').Router()

commentsRouter.get('/:idPost/comments/', async (req, res) => {
    const { idPost } = req.params
    const post = await Post.findById(idPost).populate('comments', {
        content: 1,
        user: 1,
        author: 1,
        date: 1
    })
    res.json(post.comments)
})

commentsRouter.delete('/comments/:id', userExtractor, async (req, res, next) => {
    const { id } = await req.params
    const { userId } = await req
    try {

        const comments = await Comment.findById(id)

        if (JSON.stringify(userId) === JSON.stringify(comments.user)) {
            await Comment.findByIdAndDelete(id)
            res.status(204).end()
        } else res.status(401).end()
    } catch (error) {
        next(error)
    }
})

commentsRouter.post('/comments/:id', validateCommentData, userExtractor, async (req, res, next) => {

    const { content } = await req.body
    const { userId } = await req
    const id = req.params.id
    try {
        const objectId = new ObjectId(id)
        const post = await Post.findById(objectId)
        const user = await User.findById(userId)

        const newComment = new Comment({
            content,
            author: user.username,
            user: user.toJSON().id,
            post: post._id,
            date: new Date().toLocaleString()
        })

        const saveComment = await newComment.save()
        post.comments = await post.comments.concat(saveComment._id)
        await post.save()

        res.json(saveComment)

    } catch (error) {
        next(error)
    }
})

module.exports = commentsRouter