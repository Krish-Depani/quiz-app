import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createQuestion, getSubjects } from "../../utils/QuizService";

const AddQuestion = () => {
  const navigate = useNavigate();
  const [question, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [choices, setChoices] = useState(["A.", "B.", "C.", "D."]);
  const [correctAnswers, setCorrectAnswers] = useState([""]);
  const [subject, setSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubjects();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  const fetchSubjects = async () => {
    try {
      const subjectsData = await getSubjects();
      setSubjectOptions(subjectsData);
    } catch (error) {
      setError("Failed to fetch subjects");
      console.error(error);
    }
  };

  const handleAddChoice = () => {
    if (choices.length < 6) {
      // Limiting to 6 choices
      const lastChoice = choices[choices.length - 1];
      const lastChoiceLetter = lastChoice ? lastChoice.charAt(0) : "A";
      const newChoiceLetter = String.fromCharCode(
        lastChoiceLetter.charCodeAt(0) + 1
      );
      const newChoice = `${newChoiceLetter}.`;
      setChoices([...choices, newChoice]);
    }
  };

  const handleRemoveChoice = (index) => {
    if (choices.length > 2) {
      // Maintaining minimum 2 choices
      setChoices(choices.filter((choice, i) => i !== index));
    }
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const updatedAnswers = [...correctAnswers];
    updatedAnswers[index] = value.toUpperCase();
    setCorrectAnswers(updatedAnswers);
  };

  const handleAddCorrectAnswer = () => {
    if (
      questionType === "Multiple Choice" &&
      correctAnswers.length < choices.length
    ) {
      setCorrectAnswers([...correctAnswers, ""]);
    }
  };

  const handleRemoveCorrectAnswer = (index) => {
    if (correctAnswers.length > 1) {
      setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!subject) return "Please select a subject";
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

  const handleSubmit = async (e) => {
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

      const questionData = {
        question,
        subject,
        questionType: "Multiple Choice",
        choices: formattedChoices,
        correctAnswers: correctAnswers.map(
          (answer) => formattedChoices[answer.charCodeAt(0) - 65]
        ),
      };

      await createQuestion(questionData);
      navigate("/all-quizzes");
    } catch (error) {
      setError("Failed to create question");
      console.error(error);
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjectOptions.includes(newSubject.trim())) {
      setSubject(newSubject.trim());
      setSubjectOptions([...subjectOptions, newSubject.trim()]);
      setNewSubject("");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-5">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Add New Questions</h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="p-2">
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label text-info">
                    Select a Subject
                  </label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select subject</option>
                    <option value="New">Add New</option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {subject === "New" && (
                  <div className="mb-3">
                    <label
                      htmlFor="new-subject"
                      className="form-label text-info"
                    >
                      Add New Subject
                    </label>
                    <input
                      type="text"
                      id="new-subject"
                      value={newSubject}
                      onChange={(event) => setNewSubject(event.target.value)}
                      className="form-control"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubject}
                      className="btn btn-outline-primary mt-2"
                    >
                      Add Subject
                    </button>
                  </div>
                )}

                <div className="mb-3">
                  <label
                    htmlFor="question-text"
                    className="form-label text-info"
                  >
                    Question
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={question}
                    onChange={(e) => setQuestionText(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="choices" className="form-label text-primary">
                    Choices
                  </label>
                  {choices.map((choice, index) => (
                    <div key={index} className="input-group mb-3">
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) =>
                          handleChoiceChange(index, e.target.value)
                        }
                        className="form-control"
                      />
                      {choices.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveChoice(index)}
                          className="btn btn-outline-danger"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  {choices.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddChoice}
                      className="btn btn-outline-primary"
                    >
                      Add Choice
                    </button>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="answer" className="form-label text-success">
                    Correct Answer(s)
                  </label>
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
                      className="btn btn-outline-info"
                      onClick={handleAddCorrectAnswer}
                    >
                      Add Correct Answer
                    </button>
                  )}
                </div>

                <div className="btn-group">
                  <button
                    type="submit"
                    className="btn btn-outline-success mr-2"
                  >
                    Save Question
                  </button>
                  <Link
                    to={"/all-quizzes"}
                    className="btn btn-outline-primary ml-2"
                  >
                    Back to existing questions
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
