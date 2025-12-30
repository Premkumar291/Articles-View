import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

const ArticleCard = ({ article }) => {
    const isUpdated = article.isUpdatedVersion;

    return (
        <Link
            to={`/article/${article._id}`}
            className="block group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isUpdated
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {isUpdated ? (
                            <>
                                <Sparkles className="w-3 h-3 mr-1" />
                                AI Enhanced
                            </>
                        ) : (
                            'Original'
                        )}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {article.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                </p>

                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-1" />
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
