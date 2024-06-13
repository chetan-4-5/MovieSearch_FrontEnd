// AuthContextProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // Initialize with null or default state
    const [loading, setLoading] = useState(true); // Initially set to true to handle loading state

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('https://moviesearch-backend-b97z.onrender.com/api/users/current', {
                        headers: {
                            'x-auth-token': `Bearer ${token}`
                        }
                    });
                    setCurrentUser(response.data.user);
                } catch (error) {
                    console.error('Error fetching current user:', error);
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false); // Set loading to false after fetching current user
        };

        fetchCurrentUser();
    }, []);

    const signIn = async (email, password, rememberMe) => {
        try {
            const res = await axios.post('https://moviesearch-backend-b97z.onrender.com/api/users/login', {
                email,
                password,
            });

            const { token } = res.data;

            if (!token) {
                throw new Error('Token not provided by server');
            }

            // Store the token in localStorage or sessionStorage based on 'Remember Me'
            if (rememberMe) {
                localStorage.setItem('token', token);
            } else {
                sessionStorage.setItem('token', token);
            }

            // Fetch current user after successful login
            await fetchCurrentUser();
            toast.success('Login successful!');
            navigate('/home');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            toast.error(`Login failed: ${errorMessage}`);
            console.error('Login error:', err);
        }
    };

    const signOut = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setCurrentUser(null);
        toast.success('Signed out successfully');
        navigate('/signin');
    };

    return (
        <AuthContext.Provider value={{ currentUser, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
