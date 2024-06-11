import React, { useState } from 'react';
import DeleteMovieModal from './DeleteMovieModal';

const MovieItem = ({ movie, onDelete }) => {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmDelete = () => {
        // Call API to delete movie
        onDelete(movie.id); // Assuming you pass movie id to onDelete function
        setShowModal(false);
    };

    return (
        <>
            {/* Render movie item */}
            <button onClick={handleDelete}>Delete</button>
            <DeleteMovieModal
                show={showModal}
                handleClose={handleCloseModal}
                handleConfirmDelete={handleConfirmDelete}
            />
        </>
    );
};

export default MovieItem;
