import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/QuizIntroPage.css';

function QuizIntroPage() {
    const navigate = useNavigate();

    const startQuiz = () => {
        navigate('/quiz-page');
    };

    return (
        <div className="quiz-intro-container">
            <Navbar />
            <div className="main-content">
                <div className="text-section">
                    <h1>Glow Naturally with SkinGenie's Custom Routines</h1>
                    <h3>Confused about what your skin really needs? Our quick quiz reveals the perfect routine for you</h3>
                    <div className="steps">
                        <p>Discover your perfect routine in 3 simple steps:</p>
                        <ul>
                            <li>Take our skin quiz</li>
                            <li>Get personalized recommendations</li>
                            <li>Track your progress</li>
                        </ul>
                    </div>
                    <button onClick={startQuiz}>Take Quiz</button>
                </div>
                <div className="right-image-container">
                    <img src="/quiz.jpeg" alt="Routine Visual 1" className="right-image" />
                </div>
            </div>
        </div>
    );
}

export default QuizIntroPage;
