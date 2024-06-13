// AuthContextProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // Initialize with null or default state

    useEffect(() => {
        // Function to fetch current user data from backend based on token
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // Assuming token is stored in localStorage
            if (token) {
                try {
                    const response = await axios.get('https://moviesearch-backend-b97z.onrender.com/api/user', {
                        headers: {
                            'x-auth-token': `Bearer ${token}`
                        }
                    });
                    setCurrentUser(response.data.user); // Assuming response returns user data
                } catch (error) {
                    console.error('Error fetching current user:', error);
                    setCurrentUser(null); // Reset currentUser if there's an error
                }
            } else {
                setCurrentUser(null); // No token found, set currentUser to null
            }
        };

        fetchCurrentUser(); // Fetch current user on component mount
    }, []);

    // Functions to handle login, logout, etc. could be defined here

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
