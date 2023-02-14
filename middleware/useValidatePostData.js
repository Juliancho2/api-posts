const validatePostData = (req, res, next) => {
    const { content, imgPost } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Title and content  are required fields' });
    }

    req.body = { content, imgPost };
    next();
}

module.exports = validatePostData