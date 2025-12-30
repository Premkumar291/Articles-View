import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="w-full px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} ArticleViewer. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
