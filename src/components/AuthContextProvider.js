import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            console.log('AuthContext: Token:', token); // Log the token

            if (token) {
                try {
                    const response = await axios.get('https://moviesearch-backend-b97z.onrender.com/api/user', {
                        headers: { 'x-auth-token': localStorage.getItem('token') || sessionStorage.getItem('token') }
                    });
                    console.log('AuthContext: API Response:', response.data); // Log the API response
                    setCurrentUser(response.data);
                    console.log('AuthContext: Current User:', response.data); // Log the user data
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
