import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/RoutinePage.css';
import { FaRegCalendarAlt, FaFire } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoutinePage = () => {
    const [skintype, setSkintype] = useState(localStorage.getItem('skinType'));
    const [amRoutine, setAmRoutine] = useState([]);
    const [pmRoutine, setPmRoutine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [streak, setStreak] = useState(1); // Start with a streak of 1 to ensure visibility
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    // Calculate streak from tracking data
    const calculateStreak = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            
            if (!token || !userId) return;
            
            // Get the last 30 days of tracking data
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(
                `${API_URL}/api/routine-tracker/${userId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                
                // Sort by date (newest first)
                data.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                // Calculate streak
                let currentStreak = 0;
                let currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                
                for (const entry of data) {
                    const entryDate = new Date(entry.date);
                    entryDate.setHours(0, 0, 0, 0);
                    
                    // Check if this entry is for the expected date and has completed items
                    const expectedDate = new Date(currentDate);
                    expectedDate.setDate(expectedDate.getDate() - currentStreak);
                    
                    if (entryDate.getTime() === expectedDate.getTime() && entry.completedItems.length > 0) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
                
                // Ensure we have at least a streak of 1 if there's any tracking data
                if (currentStreak === 0 && data.length > 0) {
                    currentStreak = 1;
                }
                
                setStreak(currentStreak);
            }
        } catch (error) {
            console.error('Error calculating streak:', error);
        }
    };

    // Extract userId from token if it's missing
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        
        // If userId is missing but token exists, try to extract userId from token
        if (!userId && token) {
            try {
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    if (payload.userId) {
                        localStorage.setItem('userId', payload.userId);
                    }
                }
            } catch (error) {
                console.error('Error extracting userId from token:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (skintype) {
            const fetchRoutine = async () => {
                try {
                    setLoading(true);
                    setError('');

                    const token = localStorage.getItem('token');
                    if (!token) {
                        toast.error('Session expired. Please log in again.');
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
                    
                    // Calculate streak after loading routine
                    calculateStreak();
                } catch (error) {
                    setError(error.message);
                    toast.error(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchRoutine();
        } else {
            const errorMessage = 'User skin type not available. Please complete the skin type assessment.';
            setError(errorMessage);
            toast.error(errorMessage);
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
                <div className="header-row">
                    <div className="left-spacer"></div>
                    
                    <div className="user-greeting">
                        <h2>Here is your personalized SKINCARE ROUTINE</h2>
                    </div>
                    
                    <div className="date-streak-container">
                        <div className="calendar-container">
                            <FaRegCalendarAlt className="calendar-icon" />
                            <span className="current-month">{currentMonth}</span>
                        </div>
                        
                        <div className="streak-counter">
                            <FaFire className="streak-flame" />
                            <span className="streak-count">{streak || 1}</span>
                            <span className="streak-text">day streak!</span>
                        </div>
                    </div>
                </div>

                <div className="routine-container">
                    <div className="am-routine routine-section">
                        <h2>AM Care Routine</h2>
                        <div className="routine-items">
                            {amRoutine.length === 0 ? (
                                <p>No AM routine available.</p>
                            ) : (
                                amRoutine.map((product) => (
                                    <ProductCard 
                                        key={product._id} 
                                        product={product} 
                                        timeOfDay="AM"
                                        onTrackingUpdate={calculateStreak}
                                    />
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
                                    <ProductCard 
                                        key={product._id} 
                                        product={product} 
                                        timeOfDay="PM"
                                        onTrackingUpdate={calculateStreak}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ product, timeOfDay, onTrackingUpdate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [checked, setChecked] = useState(false);
    const [trackingLoading, setTrackingLoading] = useState(false);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Check if this product was already marked as completed today
    useEffect(() => {
        const checkCompletionStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                
                if (!token || !userId) return;
                
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const response = await fetch(
                    `${API_URL}/api/routine-tracker/${userId}?startDate=${today}&endDate=${today}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        const isCompleted = data[0].completedItems.some(
                            item => item.productId && item.productId._id === product._id && item.timeOfDay === timeOfDay
                        );
                        setChecked(isCompleted);
                    }
                }
            } catch (error) {
                console.error('Error checking completion status:', error);
            }
        };
        
        checkCompletionStatus();
    }, [product._id, timeOfDay, today]);
    
    const handleCheckboxChange = async () => {
        try {
            setTrackingLoading(true);
            const newStatus = !checked;
            
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            
            if (!token || !userId) {
                toast.error('You must be logged in to track your routine');
                return;
            }
            
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_URL}/api/routine-tracker/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId,
                    date: today,
                    productId: product._id,
                    timeOfDay,
                    completed: newStatus
                })
            });
            
            if (response.ok) {
                setChecked(newStatus);
                toast.success(newStatus 
                    ? `${product.name} marked as completed!` 
                    : `${product.name} marked as not completed`
                );
                
                // Update streak after tracking
                if (onTrackingUpdate) {
                    onTrackingUpdate();
                }
            } else {
                toast.error('Failed to update tracking status');
            }
        } catch (error) {
            console.error('Error updating tracking status:', error);
            toast.error('An error occurred while updating tracking status');
        } finally {
            setTrackingLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            toast.error('Invalid file type. Please upload a JPEG or PNG image.');
            setSelectedFile(null);
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size exceeds the 5 MB limit.');
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setUploadSuccess(false);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first.');
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
                toast.success('Upload successful!');
                setUploadSuccess(true);
            } else {
                toast.error(data.message || 'Upload failed.');
            }
        } catch (error) {
            toast.error('An error occurred during upload.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="product-card">
            <input 
                type="checkbox" 
                className="product-checkbox" 
                checked={checked}
                onChange={handleCheckboxChange}
                disabled={trackingLoading}
            />
            <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <input
                    type="file"
                    id={`file-upload-${product._id}`}
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <label htmlFor={`file-upload-${product._id}`}></label>

                {selectedFile && (
                    <p className="selected-file">
                        Selected: {selectedFile.name}
                    </p>
                )}

                <button
                    className="upload-after-look-button"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    <span className="upload-icon">📤</span>{' '}
                    {uploading ? 'Uploading...' : 'Upload After Look'}
                </button>

                {uploadSuccess && (
                    <p className="upload-success-message">Uploaded successfully!</p>
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