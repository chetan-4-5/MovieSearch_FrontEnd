// src/components/UserPlaylists.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

const UserPlaylists = () => {
    const { userId } = useParams();
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/playlists/user/${userId}`);
                setPlaylists(res.data);
            } catch (err) {
                setError('Failed to fetch user playlists');
            }
        };

        fetchUserPlaylists();
    }, [userId]);

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <Container className="user-playlists-container">
            <h1 className="text-center my-4">User's Playlists</h1>
            <Row>
                {playlists.map((playlist) => (
                    <Col key={playlist._id} xs={12} md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{playlist.name}</Card.Title>
                                <Card.Text>{playlist.movies.map(movie => movie.title).join(', ')}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UserPlaylists;
