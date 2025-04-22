import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/QuizPage.css';

function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        fetch('http://localhost:8000/quiz/questions')
            .then((res) => res.json())
            .then((data) => {
                setQuestions(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    const handleOptionClick = (index) => {
        setSelectedOption(index);
    };

    const handleNext = () => {
        if (selectedOption === null) return;
        setSelectedOption(null);
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        }
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        // Add logic to handle submission here (e.g., send data to backend)
        navigate('/routine'); // Redirect to the routine page
    };

    const handleBack = () => {
        setSelectedOption(null);
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;
    const isLastQuestion = current === questions.length - 1;

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="quiz-loading">Loading...</div>
            </>
        );
    }

    const question = questions[current];

    return (
        <div className='quiz-all'>
            <Navbar />
            <div className="quiz-page">
                <div className="quiz-container">
                    <div className="quiz-header">
                        <div className="quiz-progress-bar">
                            <div className="quiz-progress" style={{ width: `${progress}%` }}></div>
                        </div>
                        <h2 className="quiz-title">Skincare Routine Builder</h2>
                    </div>
                    <div className="quiz-question">
                        <h3>{question?.question}</h3>
                        <ul className="quiz-options">
                            {question?.options.map((opt, index) => (
                                <li key={index}>
                                    <button
                                        className={`quiz-option-btn ${selectedOption === index ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick(index)}
                                    >
                                        {opt.text}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="quiz-navigation">
                        <button
                            className="quiz-nav-button back-button"
                            onClick={handleBack}
                            disabled={current === 0}
                        >
                            Back
                        </button>
                        {isLastQuestion ? (
                            <button
                                className="quiz-nav-button submit-button"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                className="quiz-nav-button next-button"
                                onClick={handleNext}
                                disabled={selectedOption === null}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;
