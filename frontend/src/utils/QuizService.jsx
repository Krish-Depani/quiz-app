import axios from "axios";

// Base API configuration with dynamic token setting
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication APIs
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post("/auth/register", {
      ...adminData,
      role: "ADMIN",
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Quiz APIs
export const createQuestion = async (quizQuestion) => {
  try {
    const response = await api.post(
      "/quizzes/create-new-question",
      quizQuestion
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllQuestions = async () => {
  try {
    const response = await api.get("/quizzes/all-questions");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchQuizForUser = async (numOfQuestions, subject) => {
  try {
    const response = await api.get(
      `/quizzes/quiz/fetch-questions-for-user?numOfQuestions=${numOfQuestions}&subject=${subject}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSubjects = async () => {
  try {
    const response = await api.get("/quizzes/subjects");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateQuestion = async (id, question) => {
  try {
    const response = await api.put(`/quizzes/question/${id}/update`, question);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getQuestionById = async (id) => {
  try {
    const response = await api.get(`/quizzes/question/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`/quizzes/question/${id}/delete`);
    return response.status === 204;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
