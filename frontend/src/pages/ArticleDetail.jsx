import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById } from '../services/api';
import { Loader2, AlertCircle, ArrowLeft, Calendar, Sparkles, ExternalLink } from 'lucide-react';

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await getArticleById(id);
                setArticle(data);
            } catch (err) {
                setError('Failed to load article.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-600">
                <div className="flex items-center mb-4">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    {error || 'Article not found'}
                </div>
                <Link to="/" className="text-blue-600 hover:underline">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <article className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Articles
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-6 ${article.isUpdatedVersion
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {article.isUpdatedVersion ? (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                AI Enhanced Version
                            </>
                        ) : (
                            'Original Article'
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center text-gray-500 mb-8 pb-8 border-b border-gray-100">
                        <Calendar className="w-5 h-5 mr-2" />
                        {new Date(article.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>

                    <div
                        className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {article.isUpdatedVersion && article.references && article.references.length > 0 && (
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            References & Sources
                        </h3>
                        <ul className="space-y-3">
                            {article.references.map((ref, index) => (
                                <li key={index} className="flex items-start">
                                    <ExternalLink className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                                    <a
                                        href={ref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                    >
                                        {ref}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </article>
    );
};

export default ArticleDetail;
