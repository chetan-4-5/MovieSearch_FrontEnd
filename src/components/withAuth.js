import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');;
        if (!token) {
            // Redirect to login page if not authenticated
            return <Navigate to="/signin" />;
        }
        // Render the wrapped component if authenticated
        return <WrappedComponent {...props} />;
    };
};

export default withAuth;