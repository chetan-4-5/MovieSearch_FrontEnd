// src/components/LandingPage.js
import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <Container className="text-center">
                <h1 className="landing-title">Welcome to Movie Search</h1>
                <p className="landing-subtitle">Discover your favorite movies with ease</p>
                <Row className="justify-content-center">
                    <Col xs={12} md={6} lg={3}>
                        <Button variant="primary" size="lg" onClick={() => navigate('/signin')}>
                            Sign In
                        </Button>
                    </Col>
                    <Col xs={12} md={6} lg={3}>
                        <Button variant="outline-primary" size="lg" onClick={() => navigate('/signup')}>
                            Sign Up
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LandingPage;
