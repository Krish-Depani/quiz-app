import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizQuestions, totalScores } = location.state || {
    quizQuestions: [],
    totalScores: 0,
  };
  const numQuestions = quizQuestions.length;
  const percentage = Math.round((totalScores / numQuestions) * 100);

  // Redirect to quiz stepper if accessed directly without quiz data
  React.useEffect(() => {
    if (!location.state) {
      navigate("/quiz-stepper");
    }
  }, [location.state, navigate]);

  const handleRetakeQuiz = () => {
    navigate("/quiz-stepper");
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header text-center">
          <h2>Your Quiz Result Summary</h2>
        </div>
        <div className="card-body text-center">
          <h4 className="card-title mb-4">
            You answered {totalScores} out of {numQuestions} questions
            correctly.
          </h4>
          <h3
            className={`mb-4 ${
              percentage >= 50 ? "text-success" : "text-danger"
            }`}
          >
            Your total score is {percentage}%
          </h3>
          <div className="d-flex justify-content-center gap-3">
            <button onClick={handleRetakeQuiz} className="btn btn-primary">
              Take Another Quiz
            </button>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
