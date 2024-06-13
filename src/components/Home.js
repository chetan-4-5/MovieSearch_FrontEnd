import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Navbar, Nav, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';
import withAuth from './withAuth';
import { useAuth } from '../AuthContext';

const Home = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            console.log('Fetching public playlists');
            const res = await axios.get('https://moviesearch-backend-b97z.onrender.com/api/playlists/public');
            console.log('Public playlists fetched:', res.data);
            setPlaylists(res.data);
        } catch (err) {
            console.error('Failed to fetch public playlists', err);
            setError('Failed to fetch public playlists');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            console.log(`Searching for movies with query: ${query}`);
            const res = await axios.get(`https://www.omdbapi.com/?apikey=6f1b1840&s=${query}`);
            console.log('Movies fetched:', res.data);
            if (res.data.Response === 'True') {
                setMovies(res.data.Search);
            } else {
                setError(res.data.Error || 'No movies found');
                setMovies([]);
            }
        } catch (err) {
            console.error('Failed to fetch movies', err);
            setError('Failed to fetch movies');
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        toast.success('Signed out successfully');
        navigate('/signin');
    };

    const handleDeleteFromPlaylist = async (playlistId, movieId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized. Please log in to delete from the playlist.');
                return;
            }

            await axios.delete(`https://moviesearch-backend-b97z.onrender.com/api/playlists/public/${playlistId}/remove/${movieId}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            toast.success('Movie deleted from public playlist');
            fetchPlaylists(); // Refresh playlists after deletion
        } catch (error) {
            console.error('Failed to delete movie from public playlist', error);
            setError('Failed to delete movie from public playlist');
        }
    };

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/home">Movie App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/public-playlist">Public Playlist</Nav.Link>
                        <Nav.Link as={Link} to="/private-playlist">Private Playlist</Nav.Link>
                    </Nav>
                    <Button variant="outline-light" onClick={handleSignOut}>Sign Out</Button>
                </Navbar.Collapse>
            </Navbar>
            
            <Container className="home-container">
                {currentUser && (
                    <Row className="my-4">
                        <Col>
                            <h3>Welcome, {currentUser.username}!</h3>
                        </Col>
                    </Row>
                )}

                <h1 className="text-center my-4">Search for Movies</h1>
                <Form onSubmit={handleSearch} className="mb-4">
                    <Row>
                        <Col xs={9}>
                            <Form.Control
                                type="text"
                                placeholder="Enter movie name"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </Col>
                        <Col xs={3}>
                            <Button type="submit" variant="primary" block>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {loading && <p>Loading...</p>}
                {error && <p className="text-danger">{error}</p>}
                <Row>
                    {movies.map((movie) => (
                        <Col key={movie.imdbID} xs={12} md={6} lg={4} className="mb-4">
                            <Card>
                                <Link to={`/movie/${movie.imdbID}`}>
                                    <Card.Img variant="top" src={movie.Poster} alt={movie.Title} />
                                </Link>
                                <Card.Body>
                                    <Card.Title>{movie.Title}</Card.Title>
                                    <Card.Text>{movie.Year}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <h2 className="text-center my-4">Public Playlists</h2>
                <Row>
                    {playlists.map((playlist) => (
                        <Col key={playlist._id} xs={12} md={6} lg={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{playlist.name}</Card.Title>
                                    <Card.Text>Created by: {playlist.userId.username}</Card.Text>
                                    <Card.Text>
                                        Movies:
                                        <ul>
                                            {playlist.movies.map((movie) => (
                                                <li key={movie.imdbID}>
                                                    <Link to={`/movie/${movie.imdbID}`}>
                                                        {movie.title}
                                                    </Link>
                                                    {currentUser && playlist.userId._id === currentUser.id && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="ms-2"
                                                            onClick={() => handleDeleteFromPlaylist(playlist._id, movie._id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default withAuth(Home);
