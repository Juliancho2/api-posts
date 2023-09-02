require('dotenv').config()

const postRouter = require('express').Router()
const cloudinary = require('../cloudinary/index');
const upload = require('../middleware/Multer');
const validatePostData = require('../middleware/useValidatePostData');
const userExtractor = require('../middleware/userExtractor')
const Post = require('../models/Posts')
const User = require('../models/User');

const fs = require('fs')

postRouter.get('/', async (request, response) => {

    try {
        const posts = await Post.find({}).populate('user', {
            username: 1,
            avatar: 1,

        }).populate('comments', {
            content: 1,
            user: 1,
            author: 1
        }).sort({ date: -1 })

        response.json(posts)
    } catch (error) {
        return res.status(404).json({ message: "There was a problem getting the posts" })
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
        return res.status(404).json({ message: "Not found" })
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
        response.status(401).json({ message: "An ocurred error to deleting post" })
    }
})
postRouter.put('/:id', userExtractor, async (request, response) => {
    try {
        const postId = request.params.id;
        const updatedPostData = request.body;

        // Realizar la actualización en la base de datos
        const updatedPost = await Post.findByIdAndUpdate(postId, updatedPostData, {
            new: true, // Devuelve el objeto actualizado en lugar del anterior
        });

        if (!updatedPost) {
            return response.status(404).json({ error: 'Post not found' });
        }

        // Enviar la respuesta con el post actualizado
        response.json(updatedPost);
    } catch (error) {
        // Manejar errores, por ejemplo, si hay un error de validación o de base de datos
        response.status(500).json({ error: 'Error interno del servidor' });
    }
});

postRouter.post('/', userExtractor, upload.single("file"), validatePostData,async (request, response, next) => {
    const { content, title, tags } = request.body;
    const { userId } = request;

    let originalname = '';
    let path = '';
    let parts='';
    let ext=''
    let newPath=''

    if(request.file) {
        originalname = request.file.originalname;
        path = request.file.path;
        parts = originalname.split('.')
        ext = parts[parts.length - 1]
        newPath = path + '.' + ext
        fs.renameSync(path, newPath)
    }
    
    try {
        let uploadResult=''
        // Sube la imagen a Cloudinary
        if(originalname.trim().length > 0){
             uploadResult = await cloudinary.uploader.upload(`./${newPath}`);
        }
        const newPost = new Post({
            cover: uploadResult ? uploadResult.url : uploadResult, 
            title,
            content,
            tags: tags.split(','),
            date: new Date(),
            user: userId,
            likesNumber: 0,
        });

        const savedPost = await newPost.save();

        //   Actualiza el usuario con la nueva publicación
        const user = await User.findById(userId);
        user.posts = user.posts.concat(savedPost._id);
        await user.save();

        response.json(savedPost);
    } catch (error) {
        response.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = postRouter
