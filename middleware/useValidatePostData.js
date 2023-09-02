const validatePostData =async (req, res, next) => {
     const { content,title } =  req.body;
     
    if (!content || !content.trim().length > 0 || !title) {
        return res.status(400).json({ error: 'Title and content are required fields' });
    }

    next();
}

module.exports = validatePostData
