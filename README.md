# Books API

A RESTful API for managing a small library of books, built with Node.js and Express.js. Supports full CRUD operations with input validation and JSON responses.

## Technologies Used
- Node.js
- Express.js
- Postman (testing)
- GitHub (source control)
- Render (deployment)

## Installation and Local Execution
```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd books
npm install
npm start
```
The server runs at http://localhost:3000 (or the port set in process.env.PORT).

## Endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| GET | / | API status check |
| GET | /api/books | Retrieve all books |
| GET | /api/books/:id | Retrieve one book |
| POST | /api/books | Create a book |
| PUT | /api/books/:id | Replace a book (all fields required) |
| PATCH | /api/books/:id | Update one or more fields |
| DELETE | /api/books/:id | Delete a book |

Status codes: 200 OK, 201 Created, 400 Validation error / bad id / invalid JSON, 404 Book or route not found.

## Example Request Body (POST /api/books)
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008
}
```

## Validation Rules
- title: required, non-empty string
- author: required, non-empty string
- year: required integer between 1 and the current year

## Links
- GitHub Repository: https://github.com/jm-acut/books.git
- Render Deployment: https://YOUR-SERVICE.onrender.co

## Known Limitations
- Data is stored in an in-memory array, so records are temporary and reset whenever the server restarts or the Render instance is replaced.
- No authentication or database.
- Render free instances may sleep when idle, so the first request can be slow.
