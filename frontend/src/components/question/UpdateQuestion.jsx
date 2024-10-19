import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getQuestionById, updateQuestion } from "../../utils/QuizService";

const UpdateQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState(["A.", "B.", "C.", "D."]);
  const [correctAnswers, setCorrectAnswers] = useState([""]);
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
    } else {
      fetchQuestion();
    }
  }, [navigate]);

  const fetchQuestion = async () => {
    try {
      const questionData = await getQuestionById(id);
      if (questionData) {
        setQuestion(questionData.question);
        setSubject(questionData.subject);

        // Format choices with letters
        const formattedChoices = questionData.choices.map(
          (choice, index) => `${String.fromCharCode(65 + index)}.${choice}`
        );
        setChoices(formattedChoices);

        // Convert correct answers to letters
        const correctLetters = questionData.correctAnswers.map((answer) => {
          const index = questionData.choices.indexOf(answer);
          return index !== -1 ? String.fromCharCode(65 + index) : "";
        });
        setCorrectAnswers(correctLetters);
      }
      setIsLoading(false);
    } catch (error) {
      setError("Failed to fetch question");
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    // const choiceLetter = choices[index].charAt(0);
    // updatedChoices[index] = `${choiceLetter}${value.substring(
    //   value.indexOf(".") + 1
    // )}`;
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updatedAnswers = [...correctAnswers];
    updatedAnswers[index] = value.toUpperCase();
    setCorrectAnswers(updatedAnswers);
  };

  const handleAddCorrectAnswer = () => {
    if (correctAnswers.length < choices.length) {
      setCorrectAnswers([...correctAnswers, ""]);
    }
  };

  const handleRemoveCorrectAnswer = (index) => {
    if (correctAnswers.length > 1) {
      setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!question.trim()) return "Please enter a question";
    if (choices.some((choice) => choice.length <= 2))
      return "Please fill all choices";
    if (correctAnswers.some((answer) => !answer))
      return "Please fill all correct answers";
    if (!choices.length) return "Please add at least two choices";
    if (!correctAnswers.length) return "Please add at least one correct answer";

    // Validate that correct answers match existing choices
    const validAnswers = correctAnswers.every((answer) => {
      const answerLetter = answer.charAt(0);
      return choices.some((choice) => choice.charAt(0) === answerLetter);
    });
    if (!validAnswers) return "Correct answers must match choice letters";

    return "";
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const formattedChoices = choices.map((choice) =>
        choice.substring(choice.indexOf(".") + 1).trim()
      );

      const updatedQuestionData = {
        question,
        subject,
        questionType: "Multiple Choice",
        choices: formattedChoices,
        correctAnswers: correctAnswers.map(
          (answer) => formattedChoices[answer.charCodeAt(0) - 65]
        ),
      };

      await updateQuestion(id, updatedQuestionData);
      navigate("/all-quizzes");
    } catch (error) {
      setError("Failed to update question");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container">
      <h4 className="mt-5" style={{ color: "GrayText" }}>
        Update Quiz Question
      </h4>
      <div className="col-8">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="text-info">Question:</label>
            <textarea
              className="form-control"
              rows={4}
              value={question}
              onChange={handleQuestionChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="text-info">Subject:</label>
            <input
              type="text"
              className="form-control mb-4"
              value={subject}
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="text-info">Choices:</label>
            {choices.map((choice, index) => (
              <input
                key={index}
                type="text"
                className="form-control mb-4"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
              />
            ))}
          </div>

          <div className="form-group">
            <label className="text-info">Correct Answer(s):</label>
            {correctAnswers.map((answer, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  value={answer}
                  onChange={(e) =>
                    handleCorrectAnswerChange(index, e.target.value)
                  }
                  placeholder="Enter choice letter (A, B, C, etc.)"
                />
                {correctAnswers.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveCorrectAnswer(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {correctAnswers.length < choices.length && (
              <button
                type="button"
                className="btn btn-outline-info mb-4"
                onClick={handleAddCorrectAnswer}
              >
                Add Correct Answer
              </button>
            )}
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-sm btn-outline-warning">
              Update question
            </button>
            <Link to={"/all-quizzes"} className="btn btn-outline-primary ml-2">
              Back to all questions
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestion;
