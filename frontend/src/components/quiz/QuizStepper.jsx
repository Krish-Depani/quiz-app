import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../../utils/QuizService";

const QuizStepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedNumQuestions, setSelectedNumQuestions] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    fetchSubjectData();
  }, [navigate]);

  const fetchSubjectData = async () => {
    try {
      const subjectsData = await getSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      setError("Failed to fetch subjects. Please try again later.");
      console.error(error);
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      if (selectedSubject && selectedNumQuestions) {
        // Validate number of questions
        const numQuestions = parseInt(selectedNumQuestions);
        if (isNaN(numQuestions) || numQuestions < 1) {
          setError("Please enter a valid number of questions.");
          return;
        }

        navigate("/take-quiz", {
          state: {
            selectedNumQuestions: numQuestions,
            selectedSubject,
          },
        });
      } else {
        setError("Please select a subject and number of questions.");
      }
    } else {
      setError("");
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    setError("");
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setError("");
  };

  const handleNumQuestionsChange = (event) => {
    const value = event.target.value;
    // Only allow positive numbers
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setSelectedNumQuestions(value);
      setError("");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-info mb-2">I want to take a quiz on:</h3>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={handleSubjectChange}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <h4 className="text-info mb-2">
              How many questions would you like to attempt?
            </h4>
            <input
              type="number"
              min="1"
              className="form-control"
              value={selectedNumQuestions}
              onChange={handleNumQuestionsChange}
              placeholder="Enter the number of questions"
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-info">Confirmation</h2>
            <div className="card bg-light">
              <div className="card-body">
                <p className="mb-2">
                  <strong>Subject:</strong> {selectedSubject}
                </p>
                <p className="mb-0">
                  <strong>Number of Questions:</strong> {selectedNumQuestions}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    const progress = currentStep === 3 ? 100 : ((currentStep - 1) / 2) * 100;
    return (
      <div className="progress mb-4">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          Step {currentStep} of 3
        </div>
      </div>
    );
  };

  return (
    <section className="mt-5">
      <h3 style={{ color: "GrayText" }} className="mb-4">
        Welcome to Online Quiz
      </h3>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {renderProgressBar()}
      <div className="card">
        <div className="card-body">
          {renderStepContent()}
          <div className="d-flex justify-content-between mt-4">
            {currentStep > 1 && (
              <button
                className="btn btn-outline-primary"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedSubject) ||
                  (currentStep === 2 && !selectedNumQuestions)
                }
              >
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button className="btn btn-success" onClick={handleNext}>
                Start Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizStepper;
