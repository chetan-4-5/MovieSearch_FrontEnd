// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Import axios if you're using it for HTTP requests

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // Define the function to fetch current user's data
    const getCurrentUserData = async () => {
        try {
            // Make a request to fetch the current user's data from your authentication system
            const response = await axios.get('/api/current-user-data'); // Example endpoint
            return response.data; // Assuming response.data contains the current user's data
        } catch (error) {
            throw new Error('Failed to fetch current user data');
        }
    };

    // Fetch current user's information when the component mounts
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                // Fetch current user's information from your authentication system
                const currentUserData = await getCurrentUserData();
                setCurrentUser(currentUserData);
            } catch (error) {
                console.error('Failed to fetch current user:', error);
                setCurrentUser(null); // Set to null in case of error
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
