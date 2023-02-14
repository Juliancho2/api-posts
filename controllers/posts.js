const postRouter = require('express').Router()
const validatePostData = require('../middleware/useValidatePostData');
const userExtractor = require('../middleware/userExtractor')
const Post = require('../models/Posts')
const User = require('../models/User');

postRouter.get('/', async (request, response, next) => {
    try {
        const posts = await Post.find({}).populate('user', {
            username: 1,
            avatar: 1,

        }).populate('comments', {
            content: 1,
            user: 1,
            author: 1
        })

        response.json(posts)
    } catch (error) {
        next(error)
    }

})

postRouter.get('/:id', async (request, response, next) => {
    const { id } = request.params

    try {
        const post = await Post.findById(id).populate('user', {
            username: 1,
            avatar: 1
        }).populate('comments', {
            content: 1,
            user: 1,
            author: 1
        })
        response.json(post)

    } catch (error) {
        next(error)
    }





})

postRouter.post('/:postId/likes', userExtractor, async (req, res, next) => {
    try {
        const { userId } = await req
        const { postId } = req.params

        const post = await Post.findById(postId)

        if (post.likesBy.includes(userId)) {
            // Eliminar el usuario de la lista de usuarios que han dado like
            post.likesBy = post.likesBy.filter(id => JSON.stringify(id) !== JSON.stringify(userId));
            post.likesNumber--
            res.end()

        } else {
            // Agregar el usuario a la lista de usuarios que han dado like
            post.likesBy.push(userId);
            post.likesNumber++
            res.end()
        }

        // Guardar el post actualizado en la base de datos
        await post.save();


    } catch (error) {
        next(error)
    }
});

postRouter.delete('/:id', userExtractor, async (request, response, next) => {
    const { id } = request.params
    const { userId } = await request
    const post = await Post.findById(id)
    try {
        if (JSON.stringify(userId) === JSON.stringify(post.user)) {
            await Post.findByIdAndDelete(id)
            response.status(204).end()
        } else response.status(401).end()
    } catch (error) {
        next(error)
    }
})

postRouter.post('/', validatePostData, userExtractor, async (request, response, next) => {
    const { content, imgPost } = await request.body
    const { userId } = await request

    try {

        const user = await User.findById(userId)

        const newPost = new Post({
            content,
            img: imgPost,
            date: new Date(),
            user: user.toJSON().id,
            likesNumber: 0
        })

        const savePost = await newPost.save()
        user.posts = user.posts.concat(savePost._id)
        await user.save()

        response.json(savePost)

    } catch (error) {
        next(error)
    }

})


module.exports = postRouter