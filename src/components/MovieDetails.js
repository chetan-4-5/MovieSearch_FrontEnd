import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const res = await axios.get(`https://www.omdbapi.com/?apikey=6f1b1840&i=${id}`);
                if (res.data.Response === 'True') {
                    setMovie(res.data);
                } else {
                    setError(res.data.Error);
                }
            } catch (err) {
                setError('Failed to fetch movie details');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const handleAddToPublicPlaylist = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized. Please log in to add to the playlist.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/playlists/public/add/${id}`, {}, {
                headers: {
                    'x-auth-token': token
                }
            });
            toast.success('Movie added to public playlist');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Unauthorized. Please log in to add to the playlist.');
                } else if (error.response.status === 400) {
                    toast.error('Movie already in public playlist');
                } else {
                    setError('Failed to add movie to public playlist');
                }
            } else {
                setError('Failed to add movie to public playlist');
            }
        }
    };

    const handleAddToPrivatePlaylist = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized. Please log in to add to the playlist.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/playlists/private/add/${id}`, {}, {
                headers: {
                    'x-auth-token': token
                }
            });
            toast.success('Movie added to private playlist');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Unauthorized. Please log in to add to the playlist.');
                } else if (error.response.status === 400) {
                    toast.error('Movie already in private playlist');
                } else {
                    setError('Failed to add movie to private playlist');
                }
            } else {
                setError('Failed to add movie to private playlist');
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <Container className="movie-details-container">
            <Row>
                <Col md={4}>
                    <img src={movie.Poster} alt={movie.Title} className="img-fluid" />
                </Col>
                <Col md={8}>
                    <h1>{movie.Title}</h1>
                    <p><strong>Genre:</strong> {movie.Genre}</p>
                    <p><strong>Released:</strong> {movie.Released}</p>
                    <p><strong>Plot:</strong> {movie.Plot}</p>
                    <Button variant="primary" onClick={handleAddToPublicPlaylist} className="me-2">
                        Add to Public Playlist
                    </Button>
                    <Button variant="secondary" onClick={handleAddToPrivatePlaylist}>
                        Add to Private Playlist
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default MovieDetails;
