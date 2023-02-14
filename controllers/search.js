const Post = require("../models/Posts");
const searchRouter = require('express').Router()


searchRouter.get('/', async (req, res) => {
    const { content } = req.query;

    const query = {};
    if (content) {
        query.content = { $regex: content, $options: 'i' };
    }
    Post.find(query, (err, posts) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send(posts);
    }).populate('user', {
        username: 1
    }).populate('comments', {
        content: 1,
        user: 1,
        author: 1
    })

})

module.exports = searchRouter