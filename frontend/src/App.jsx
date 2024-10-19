import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import QuizStepper from "./components/quiz/QuizStepper";
import Quiz from "./components/quiz/Quiz";
import QuizResult from "./components/quiz/QuizResult";
import GetAllQuiz from "./components/quiz/GetAllQuiz";
import AddQuestion from "./components/question/AddQuestion";
import UpdateQuestion from "./components/question/UpdateQuestion";
import Navbar from "./components/layout/NavBar";
import Admin from "./components/Admin";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mt-5 mb-5">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (Require Authentication) */}
          <Route
            path="/quiz-stepper"
            element={
              <ProtectedRoute>
                <QuizStepper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/take-quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz-result"
            element={
              <ProtectedRoute>
                <QuizResult />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes (Require Admin Role) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-quiz"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-quiz/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <UpdateQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-quizzes"
            element={
              <ProtectedRoute requireAdmin={true}>
                <GetAllQuiz />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
