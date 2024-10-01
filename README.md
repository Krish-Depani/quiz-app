# QUIZ-APP

This is a simple quiz app that allows users to answer questions and get their scores at the end of the quiz. The frontend is built with React.js (Vite) and styled with Bootstrap. The backend is built with Spring Boot and uses a MySQL database to store questions and answers.

## Usage

1. Clone the repository
2. Go to the `quiz-app` directory
3. Go to the `backend` directory
4. Add env variables to `.env` file
5. Run `mvn spring-boot:run` to start the backend server (Make sure you have Maven & Java installed)
6. Go to the `frontend` directory
7. Run `npm install` to install dependencies
8. Run `npm run dev` to start the frontend server
9. Open your browser and go to [http://localhost:5173](http://localhost:5173)

## API Documentation

### Base URL

`http://localhost:8080`

### Authentication APIs

#### 1. Register User

```
POST /api/auth/register

Request Body:
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER"
}

Response:
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "role": "USER"
    }
}
```

#### 2. Register Admin

```
POST /api/auth/register

Request Body:
{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN"
}

Response:
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 2,
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com",
        "role": "ADMIN"
    }
}
```

#### 3. Login

```
POST /api/auth/login

Request Body:
{
    "email": "admin@example.com",
    "password": "admin123"
}

Response:
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 2,
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com",
        "role": "ADMIN"
    }
}
```

### Quiz APIs

For all Quiz APIs, add the JWT token to the request header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

#### 4. Create Question (Admin only)

```
POST /api/quizzes/create-new-question

Request Body:
{
    "question": "What is the capital of France?",
    "subject": "Geography",
    "questionType": "Multiple Choice",
    "choices": [
        "London",
        "Berlin",
        "Paris",
        "Madrid"
    ],
    "correctAnswers": [
        "Paris"
    ]
}

Response:
{
    "id": 1,
    "question": "What is the capital of France?",
    "subject": "Geography",
    "questionType": "Multiple Choice",
    "choices": [
        "London",
        "Berlin",
        "Paris",
        "Madrid"
    ],
    "correctAnswers": [
        "Paris"
    ]
}
```

#### 5. Get All Questions

```
GET /api/quizzes/all-questions

Response:
[
    {
        "id": 1,
        "question": "What is the capital of France?",
        "subject": "Geography",
        "questionType": "Multiple Choice",
        "choices": [
            "London",
            "Berlin",
            "Paris",
            "Madrid"
        ],
        "correctAnswers": [
            "Paris"
        ]
    }
]
```

#### 6. Get Question by ID

```
GET /api/quizzes/question/1

Response:
{
    "id": 1,
    "question": "What is the capital of France?",
    "subject": "Geography",
    "questionType": "Multiple Choice",
    "choices": [
        "London",
        "Berlin",
        "Paris",
        "Madrid"
    ],
    "correctAnswers": [
        "Paris"
    ]
}
```

#### 7. Update Question (Admin only)

```
PUT /api/quizzes/question/1/update

Request Body:
{
    "question": "What is the capital of France?",
    "subject": "Geography",
    "questionType": "Multiple Choice",
    "choices": [
        "London",
        "Berlin",
        "Paris",
        "Rome"
    ],
    "correctAnswers": [
        "Paris"
    ]
}

Response:
{
    "id": 1,
    "question": "What is the capital of France?",
    "subject": "Geography",
    "questionType": "Multiple Choice",
    "choices": [
        "London",
        "Berlin",
        "Paris",
        "Rome"
    ],
    "correctAnswers": [
        "Paris"
    ]
}
```

#### 8. Delete Question (Admin only)

```
DELETE /api/quizzes/question/1/delete

Response: 204 No Content
```

#### 9. Get All Subjects

```
GET /api/quizzes/subjects

Response:
[
    "Geography",
    "History",
    "Science"
]
```

#### 10. Get Questions for User

```
GET /api/quizzes/quiz/fetch-questions-for-user?numOfQuestions=2&subject=Geography

Response:
[
    {
        "id": 1,
        "question": "What is the capital of France?",
        "subject": "Geography",
        "questionType": "Multiple Choice",
        "choices": [
            "London",
            "Berlin",
            "Paris",
            "Rome"
        ],
        "correctAnswers": [
            "Paris"
        ]
    },
    {
        "id": 2,
        "question": "What is the largest ocean on Earth?",
        "subject": "Geography",
        "questionType": "Multiple Choice",
        "choices": [
            "Atlantic Ocean",
            "Indian Ocean",
            "Pacific Ocean",
            "Arctic Ocean"
        ],
        "correctAnswers": [
            "Pacific Ocean"
        ]
    }
]
```

## Testing Steps

1. First, register an admin user using the Register Admin API
2. Register a normal user using the Register User API
3. Login with the admin credentials to get the admin JWT token
4. Use the admin token to create some questions
5. Test getting questions, updating, and deleting with both admin and user tokens to verify that only admin can modify questions while both can view them
6. Test fetching questions for a quiz using the fetch-questions-for-user API

## If you like this project, please give it a 🌟.

## Thank you 😊.
