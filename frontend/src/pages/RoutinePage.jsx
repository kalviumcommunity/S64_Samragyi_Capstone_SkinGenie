import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar'; // Import Navbar
import '../styles/RoutinePage.css'; // Import RoutinePage CSS
import { FaRegCalendarAlt } from 'react-icons/fa'; // Import calendar icon from react-icons

const RoutinePage = () => {
    const [skintype, setSkintype] = useState(localStorage.getItem('skinType'));
    const [amRoutine, setAmRoutine] = useState([]);
    const [pmRoutine, setPmRoutine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const currentMonth = new Date().toLocaleString('default', { month: 'long' }); // Get current month

    useEffect(() => {
        if (skintype) {
            const fetchRoutine = async () => {
                try {
                    // Start loading
                    setLoading(true);
                    setError('');

                    const token = localStorage.getItem('token');
                    if (!token) {
                        alert('Session expired. Please log in again.');
                        window.location.href = '/login';
                        return;
                    }

                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

                    const response = await fetch(`${API_URL}/routines/${skintype}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.message || `Failed to fetch routine for ${skintype}`);
                    }

                    const data = await response.json();

                    setAmRoutine(data.amRoutine || []);
                    setPmRoutine(data.pmRoutine || []);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false); // Stop loading
                }
            };

            fetchRoutine();
        } else {
            setError('User skin type not available. Please complete the skin type assessment.');
            setLoading(false);
        }
    }, [skintype]);

    // Render loading state
    if (loading) {
        return (
            <div className="routine-page">
                <Navbar />
                <div className="routine-content">
                    <p>Loading your routine...</p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="routine-page">
                <Navbar />
                <div className="routine-content">
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            </div>
        );
    }

    // Render routine content
    return (
        <div className="routine-page">
            <Navbar />
            <div className="routine-content">
                {/* User Greeting Section */}
                <div className="user-greeting">
                    <h2>Here is your personalized SKINCARE ROUTINE</h2>
                </div>

                {/* Calendar Section */}
                <div className="calendar-container">
                    <FaRegCalendarAlt className="calendar-icon" />
                    <span className="current-month">{currentMonth}</span>
                </div>

                {/* Skincare Routine Section */}
                <div className="routine-container">
                    {/* AM Routine Section */}
                    <div className="am-routine routine-section">
                        <h2>AM Care Routine</h2>
                        <div className="routine-items">
                            {amRoutine.length === 0 ? (
                                <p>No AM routine available.</p>
                            ) : (
                                amRoutine.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            )}
                        </div>
                    </div>

                    {/* PM Routine Section */}
                    <div className="pm-routine routine-section">
                        <h2>PM Care Routine</h2>
                        <div className="routine-items">
                            {pmRoutine.length === 0 ? (
                                <p>No PM routine available.</p>
                            ) : (
                                pmRoutine.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ProductCard Component
const ProductCard = ({ product }) => (
    <div className="product-card">
        <input type="checkbox" className="product-checkbox" />
        <div className="product-details">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <button className="upload-after-look-button">
                <span className="upload-icon">⬆</span> Upload After Look
            </button>
        </div>
        <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            onError={(e) => (e.target.src = '/images/default-placeholder.png')}
        />
    </div>
);

export default RoutinePage;