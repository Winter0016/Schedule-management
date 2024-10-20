import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
            <h1 className="text-white text-9xl font-extrabold">404</h1>
            <p className="text-gray-400 text-2xl mt-4">Oops! Page Not Found</p>
            <p className="text-gray-500 text-lg mt-2">The page you're looking for doesn't exist or has been moved.</p>
            <button
                onClick={() => navigate('/')}
                className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
                Go Home
            </button>
        </div>
    );
};