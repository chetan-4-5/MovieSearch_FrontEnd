import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SignIn.css';
import { useAuth } from '../AuthContext'; // Import useAuth hook from AuthContext

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { signIn, loading } = useAuth(); // Use signIn function from useAuth hook
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signIn(email, password, rememberMe); // Call signIn function from useAuth
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
            />
            <label>
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={loading}
                />
                Remember Me
            </label>
            <button type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
};

export default SignIn;
