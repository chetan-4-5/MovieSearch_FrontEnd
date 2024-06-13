
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await axios.post('https://moviesearch-backend-b97z.onrender.com/api/users/login', {
                email,
                password,
            });

            console.log('Server response:', res.data); // Debugging line

            const { token } = res.data;

            if (!token) {
                throw new Error('Token not provided by server');
            }

            // Store the token in localStorage or sessionStorage based on 'Remember Me'
            if (rememberMe) {
                localStorage.setItem('token', token);
                console.log('Token stored in localStorage'); // Debugging line
            } else {
                sessionStorage.setItem('token', token);
                console.log('Token stored in sessionStorage'); // Debugging line
            }

            setLoading(false);
            toast.success('Login successful!');
            navigate('/home');
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || 'Login failed';
            toast.error(`Login failed: ${errorMessage}`);
            console.error('Login error:', err);
        }
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

    

