import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/RoutinePage.css';
import { FaRegCalendarAlt } from 'react-icons/fa';

const RoutinePage = () => {
    const [skintype, setSkintype] = useState(localStorage.getItem('skinType'));
    const [amRoutine, setAmRoutine] = useState([]);
    const [pmRoutine, setPmRoutine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    useEffect(() => {
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
                    setLoading(false);
                }
            };

            fetchRoutine();
        } else {
            setError('User skin type not available. Please complete the skin type assessment.');
            setLoading(false);
        }
    }, [skintype]);

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

    return (
        <div className="routine-page">
            <Navbar />
            <div className="routine-content">
                <div className="user-greeting">
                    <h2>Here is your personalized SKINCARE ROUTINE</h2>
                </div>

                <div className="calendar-container">
                    <FaRegCalendarAlt className="calendar-icon" />
                    <span className="current-month">{currentMonth}</span>
                </div>

                <div className="routine-container">
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

const ProductCard = ({ product }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadSuccess(false);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const formData = new FormData();
        formData.append('afterLookImage', selectedFile);
        formData.append('productId', product._id);

        setUploading(true);

        try {
            const response = await fetch(`${API_URL}/api/upload-after-look`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert('Upload successful!');
                setUploadSuccess(true);
            } else {
                alert(data.message || 'Upload failed.');
            }
        } catch (error) {
            alert('An error occurred during upload.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="product-card">
            <input type="checkbox" className="product-checkbox" />
            <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginBottom: '8px' }}
                />

                {selectedFile && (
                    <p style={{ fontSize: '0.9em', color: '#444' }}>
                        Selected: {selectedFile.name}
                    </p>
                )}

                <button
                    className="upload-after-look-button"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    <span className="upload-icon">⬆</span>{' '}
                    {uploading ? 'Uploading...' : 'Upload After Look'}
                </button>

                {uploadSuccess && (
                    <p style={{ color: 'green', marginTop: '5px' }}>Uploaded successfully!</p>
                )}
            </div>

            <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
                onError={(e) => (e.target.src = '/images/default-placeholder.png')}
            />
        </div>
    );
};

export default RoutinePage;
