import React, { useEffect, useState } from 'react';
import { getArticles } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Loader2, AlertCircle } from 'lucide-react';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                // Sort by date desc
                const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setArticles(sorted);
            } catch (err) {
                setError('Failed to fetch articles. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-600 bg-red-50 rounded-lg p-6">
                <AlertCircle className="w-6 h-6 mr-2" />
                {error}
            </div>
        );
    }

    // Group articles by title
    const groupedArticles = articles.reduce((acc, article) => {
        const title = article.title;
        if (!acc[title]) {
            acc[title] = { original: null, enhanced: null };
        }
        if (article.isUpdatedVersion) {
            acc[title].enhanced = article;
        } else {
            acc[title].original = article;
        }
        return acc;
    }, {});

    const articlePairs = Object.values(groupedArticles);

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Articles</h1>
                <p className="text-gray-600">Explore our collection of original and AI-enhanced content.</p>
            </header>

            {articlePairs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No articles found.
                </div>
            ) : (
                <div className="space-y-8">
                    {articlePairs.map((pair, index) => (
                        <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-gray-100 pb-8 last:border-0">
                            {/* Original Article Column */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 pb-2">
                                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Original</h2>
                                </div>
                                {pair.original ? (
                                    <ArticleCard article={pair.original} />
                                ) : (
                                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 flex items-center justify-center text-gray-400 h-full min-h-[200px]">
                                        Original article not found
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Article Column */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 pb-2">
                                    <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wide">AI Enhanced</h2>
                                </div>
                                {pair.enhanced ? (
                                    <ArticleCard article={pair.enhanced} />
                                ) : (
                                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 flex items-center justify-center text-gray-400 h-full min-h-[200px]">
                                        AI enhancement in progress...
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
