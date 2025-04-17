import React from 'react';
import Navbar from '../components/Navbar'; // Import Navbar

function QuizPage() {
  return (
    <div className="quiz-page">
      <Navbar /> {/* Include the Navbar component here */}
      <h2>Take the Quiz</h2>
      <p>Answer questions to find your skin type and routine.</p>
    </div>
  );
}

export default QuizPage;