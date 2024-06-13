// AuthContextProvider.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('https://moviesearch-backend-b97z.onrender.com/api/user', {
                        headers: { 'x-auth-token': token }
                    });
                    setCurrentUser(response.data);
                } catch (error) {
                    console.error('Error fetching current user:', error);
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
