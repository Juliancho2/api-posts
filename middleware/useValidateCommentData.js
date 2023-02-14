
const validateCommentData = (req, res, next) => {
    const { content, title } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content and title are required fields' });
    }

    req.body = { content };
    next();
}

module.exports = validateCommentData