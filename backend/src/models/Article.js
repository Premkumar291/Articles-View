import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sourceUrl: {
        type: String,
        required: true,
        unique: true,
    },
    isUpdatedVersion: {
        type: Boolean,
        default: false,
    },
    references: [{
        type: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Article', articleSchema);
