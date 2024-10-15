# Fall Project

## Project Overview
This is the **TrackMentor**, a web application designed using HTML, CSS, and JavaScript on the frontend, with a Node.js and Express backend. The application is connected to a MongoDB database for data storage, using JWT for authentication and Nodemailer for sending emails.

## Features
- User registration and login with JWT authentication.
- Email confirmation using Nodemailer.
- Dynamic frontend interface.
- CRUD operations on the database.
- Secure and scalable backend.

## Technologies Used
### Frontend:
- HTML
- CSS
- JavaScript

### Backend:
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Nodemailer for email services

## Installation

### Prerequisites:
Make sure you have Node.js and MongoDB installed.

1. Clone the repository:
    ```bash
    git TrackMentor
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
   Create a `.env` file and add your MongoDB URI, JWT secret, and Nodemailer credentials:
    ```bash
    MONGO_URI=your_mongo_uri
    JWT_SECRET=your_jwt_secret
    EMAIL_HOST=smtp.your-email-provider.com
    EMAIL_PORT=your-email-port
    EMAIL_USER=your-email-address
    EMAIL_PASS=your-email-password
    ```

4. Run the application:
    ```bash
    npm start
    ```

## Usage
Once the application is running, navigate to `http://localhost:5001` to interact with the app.
