// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import LandingPage from './components/LandingPage';
import UserPlaylists from './components/UserPlaylists';
import PrivatePlaylist from './components/PrivatePlaylist';
import { AuthProvider } from './AuthContext';

const App = () => {
    return (
        <Router>
            <AuthProvider>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/home" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/user/:userId" element={<UserPlaylists />} />
                <Route path="/private-playlist" element={<PrivatePlaylist />} />
            </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
