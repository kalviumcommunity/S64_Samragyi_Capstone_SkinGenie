import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/QuizPage.css';

function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; // Use Vite's `import.meta.env`
        fetch(`${API_URL}/quiz/questions`)
            .then((res) => res.json())
            .then((data) => {
                setQuestions(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setLoading(false);
                alert("Failed to load quiz questions. Please try again later.");
            });
    }, []);

    const handleOptionClick = useCallback((index) => {
        setSelectedOptions({ ...selectedOptions, [current]: index });
    }, [current, selectedOptions]);

    const handleNext = useCallback(() => {
        if (selectedOptions[current] === undefined) return;
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        }
    }, [current, selectedOptions]);

    const handleBack = useCallback(() => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    }, [current]);

    const handleSubmit = useCallback(() => {
        if (selectedOptions[current] === undefined) return;

        const selectedOptionType = questions[current].options[selectedOptions[current]].type;
        localStorage.setItem("skinType", selectedOptionType);
        navigate('/routine');
    }, [current, questions, selectedOptions, navigate]);

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

    if (questions.length === 0) {
        return (
            <>
                <Navbar />
                <div className="quiz-loading">No questions available. Please try again later.</div>
            </>
        );
    }

    const question = questions[current];

    return (
        <div className="quiz-all">
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
                                        className={`quiz-option-btn ${selectedOptions[current] === index ? 'selected' : ''}`}
                                        onClick={() => handleOptionClick(index)}
                                        aria-pressed={selectedOptions[current] === index}
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
                                disabled={selectedOptions[current] === undefined}
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