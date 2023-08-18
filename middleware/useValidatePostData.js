const validatePostData = (req, res, next) => {
    const { content,title } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Title and content  are required fields' });
    }

    req.body = { content, title };
    next();
}

module.exports = validatePostData
