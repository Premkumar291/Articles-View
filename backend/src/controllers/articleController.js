import Article from '../models/Article.js';

export const createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(201).json({ success: true, data: article });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Article with this URL already exists'
            });
        }
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }

        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!article) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }

        res.status(200).json({ success: true, data: article });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({ success: false, error: 'Article not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
