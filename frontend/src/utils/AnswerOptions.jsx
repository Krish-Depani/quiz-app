import React from "react";

const AnswerOptions = ({
  question,
  isChecked,
  handleAnswerChange,
  handleCheckboxChange,
}) => {
  if (!question) {
    return (
      <div className="alert alert-warning">
        No questions available. You may try again by reducing your requested
        number of questions on this topic.
      </div>
    );
  }

  const { id, questionType, choices = [], correctAnswers } = question; // Default choices to an empty array
  const isSingleChoice = correctAnswers?.length === 1;

  if (choices.length === 0) {
    return (
      <div className="alert alert-info">
        No answer choices available for this question.
      </div>
    );
  }

  if (isSingleChoice) {
    return (
      <div className="options-container">
        {choices.map((choice, index) => (
          <div key={index} className="form-check mb-3">
            <input
              type="radio"
              id={`choice-${id}-${index}`}
              name={`question-${id}`}
              className="form-check-input"
              value={choice}
              checked={isChecked(id, choice)}
              onChange={() => handleAnswerChange(id, choice)}
            />
            <label
              className="form-check-label ms-2"
              htmlFor={`choice-${id}-${index}`}
            >
              {`${String.fromCharCode(65 + index)}. ${choice}`}
            </label>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="options-container">
        {choices.map((choice, index) => (
          <div key={index} className="form-check mb-3">
            <input
              type="checkbox"
              id={`choice-${id}-${index}`}
              className="form-check-input"
              checked={isChecked(id, choice)}
              onChange={() => handleCheckboxChange(id, choice)}
            />
            <label
              className="form-check-label ms-2"
              htmlFor={`choice-${id}-${index}`}
            >
              {`${String.fromCharCode(65 + index)}. ${choice}`}
            </label>
          </div>
        ))}
      </div>
    );
  }
};

export default AnswerOptions;
