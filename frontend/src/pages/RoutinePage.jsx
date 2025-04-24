import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar
import '../styles/RoutinePage.css'; // Import RoutinePage CSS

const RoutinePage = () => {
    const [skintype, setSkintype] = useState(localStorage.getItem('skinType'));
    const [amRoutine, setAmRoutine] = useState([]);
    const [pmRoutine, setPmRoutine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log("Skin type retrieved from localStorage:", skintype);

        if (skintype) {
            const fetchRoutine = async () => {
                try {
                    setLoading(true);
                    setError('');

                    const token = localStorage.getItem('token');
                    if (!token) {
                        alert('Session expired. Please log in again.');
                        window.location.href = '/login';
                        return;
                    }

                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

                    const response = await fetch(`${API_URL}/routines/${skintype}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.message || `Failed to fetch routine for ${skintype}`);
                    }

                    const data = await response.json();
                    console.log("Fetched Routine Data:", data);

                    setAmRoutine(data.amRoutine || []);
                    setPmRoutine(data.pmRoutine || []);
                } catch (error) {
                    console.error('Failed to fetch routine:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchRoutine();
        } else {
            setError('User skin type not available. Please complete the skin type assessment.');
            setLoading(false);
        }
    }, [skintype]);

    if (loading) return <p>Loading your routine...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="routine-page">
            {/* Navbar Component */}
            <Navbar />
            <div className="routine-content">
                <h1>Your Personalized Skincare Routine</h1>
                <div className="routine-container">
                    {/* AM Routine Section */}
                    <div className="am-routine">
                        <h2>AM Care Routine</h2>
                        {amRoutine.length === 0 ? (
                            <p>No AM routine available.</p>
                        ) : (
                            amRoutine.map(product => (
                                <div key={product._id} className="product-card">
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* PM Routine Section */}
                    <div className="pm-routine">
                        <h2>PM Care Routine</h2>
                        {pmRoutine.length === 0 ? (
                            <p>No PM routine available.</p>
                        ) : (
                            pmRoutine.map(product => (
                                <div key={product._id} className="product-card">
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutinePage;