import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn('VITE_API_BASE_URL is not defined. Defaulting to http://localhost:5000');
}

export const getArticles = async () => {
    const response = await api.get('/articles');
    return response.data.data;
};

export const getArticleById = async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data.data;
};

export default api;
