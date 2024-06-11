// Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Card, Navbar, Nav, Modal } from 'react-bootstrap';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/playlists/public');
            setPlaylists(res.data);
        } catch (err) {
            console.error('Failed to fetch public playlists', err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`https://www.omdbapi.com/?apikey=6f1b1840&s=${query}`);
            if (res.data.Response === 'True') {
                setMovies(res.data.Search);
            } else {
                setError(res.data.Error); // Set specific error message from API
                setMovies([]);
            }
        } catch (err) {
            console.error('Failed to fetch movies', err);
            setError('Failed to fetch movies'); // Generic error message
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

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteModalShow = (playlist, movie) => {
        setSelectedPlaylist(playlist);
        setSelectedMovie(movie);
        setShowDeleteModal(true);
    };

    const handleDeleteMovie = async () => {
        try {
            console.log('Deleting movie:', selectedMovie);
            console.log('From playlist:', selectedPlaylist);
            await axios.delete(`http://localhost:5000/api/playlists/${selectedPlaylist._id}/movies/${selectedMovie.imdbID}`);
            setShowDeleteModal(false);
            fetchPlaylists(); // Refresh playlists after deletion
        } catch (err) {
            console.error('Failed to delete movie', err);
        }
    };
    

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/">Movie App</Navbar.Brand>
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
                                                    {playlist?.userId?._id === currentUser?._id && (
    <Button
        size="sm"
        className="delete-button"
        variant="light"
        onClick={() => handleDeleteModalShow(playlist, movie)}
    >
        ❌
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
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete {selectedMovie?.title} from {selectedPlaylist?.name}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteModalClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteMovie}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default withAuth(Home);
