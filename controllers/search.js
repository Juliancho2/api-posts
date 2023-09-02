const Post = require("../models/Posts");
const searchRouter = require('express').Router()


searchRouter.get('/', async (req, res) => {
    const { content } = req.query;

    const query = {};
    if(!content || content.trim().length === 0){
        return  res.status(400).json({message:"No content"})
    }
    if (content) {
        query.content = { $regex: content, $options: 'i' };
    }
    try {
        Post.find(query, (err, posts) => {
            if (err) {
                return res.status(500).send(err);
            }
            if(posts.length === 0) return res.status(400).json({message:"Not found post"})
            
            return res.status(200).send(posts);
        }).populate('user', {
            username: 1
        }).populate('comments', {
            content: 1,
            user: 1,
            author: 1
        })
    }catch(err){
        return res.status(500).json({ message: "Error fetching posts", error: err.message });
    }

})

module.exports = searchRouter
