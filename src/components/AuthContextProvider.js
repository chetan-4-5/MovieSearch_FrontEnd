import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                console.log('Token:', token); // Log the token for debugging
                const res = await axios.get('https://moviesearch-backend-b97z.onrender.com/api/user', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                console.log('Current User:', res.data); // Log the fetched user data
                setCurrentUser(res.data);
            } catch (err) {
                console.error('Failed to fetch current user', err);
                setError(err.message || 'Failed to fetch current user');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
