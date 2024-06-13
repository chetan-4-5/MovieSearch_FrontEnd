import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PrivatePlaylist = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPrivatePlaylists();
    }, []);

    const fetchPrivatePlaylists = async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://moviesearch-backend-b97z.onrender.com/api/playlists/private', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            console.log('Private playlists:', res.data); // Log the fetched playlists
            setPlaylists(res.data);
        } catch (err) {
            console.error('Failed to fetch private playlists', err);
            setError('Failed to fetch private playlists');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2 className="text-center my-4">Private Playlists</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
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
    );
};

export default PrivatePlaylist;
