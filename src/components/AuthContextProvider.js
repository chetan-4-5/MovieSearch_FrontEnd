import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            setLoading(true); // Assuming you have a setLoading function to handle loading state
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                console.log('Token:', token); // Log the token for debugging
                const res = await axios.get('https://moviesearch-backend-b97z.onrender.com/api/user', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                console.log('Current User:', res.data); // Log the fetched user data
                setCurrentUser(res.data); // Assuming you have a setCurrentUser function to update the user state
            } catch (err) {
                console.error('Failed to fetch current user', err);
                setError('Failed to fetch current user'); // Assuming you have a setError function to handle errors
            } finally {
                setLoading(false); // Stop the loading state
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
