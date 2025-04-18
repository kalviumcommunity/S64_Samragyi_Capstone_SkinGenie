import React from 'react';
import { useNavigate } from 'react-router-dom';
function QuizIntroPage() {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate('/quiz-page');
  };
  return (
    <div>
      <h2>Quiz Introduction</h2>
      <p>Welcome to the quiz! Click below to start.</p>
      <button onClick={startQuiz}>Take Quiz</button>
    </div>
  );
}
export default QuizIntroPage;
