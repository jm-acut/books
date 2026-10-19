const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let books = [
  { id: 1, title: "Noli Me Tangere", author: "Jose Rizal", year: 1887 },
  { id: 2, title: "El Filibusterismo", author: "Jose Rizal", year: 1891 },
];
let nextId = 3;

function validateBook(data, partial = false) {
  const errors = [];
  const currentYear = new Date().getFullYear();

  if (!partial || data.title !== undefined) {
    if (typeof data.title !== "string" || data.title.trim() === "") {
      errors.push("title is required and must be a non-empty string");
    }
  }
  if (!partial || data.author !== undefined) {
    if (typeof data.author !== "string" || data.author.trim() === "") {
      errors.push("author is required and must be a non-empty string");
    }
  }
  if (!partial || data.year !== undefined) {
    if (!Number.isInteger(data.year) || data.year < 1 || data.year > currentYear) {
      errors.push(`year is required and must be an integer between 1 and ${currentYear}`);
    }
  }
  return errors;
}

function parseId(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "id must be a positive integer" });
    return null;
  }
  return id;
}

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Books API is running", endpoints: "/api/books" });
});

app.get("/api/books", (req, res) => {
  res.status(200).json(books);
});

app.get("/api/books/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const book = books.find((b) => b.id === id);
  if (!book) return res.status(404).json({ error: `Book with id ${id} not found` });
  res.status(200).json(book);
});

app.post("/api/books", (req, res) => {
  const body = req.body || {};
  const errors = validateBook(body);
  if (errors.length) return res.status(400).json({ errors });
  const book = { id: nextId++, title: body.title.trim(), author: body.author.trim(), year: body.year };
  books.push(book);
  res.status(201).json(book);
});

app.put("/api/books/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const book = books.find((b) => b.id === id);
  if (!book) return res.status(404).json({ error: `Book with id ${id} not found` });
  const body = req.body || {};
  const errors = validateBook(body);
  if (errors.length) return res.status(400).json({ errors });
  book.title = body.title.trim();
  book.author = body.author.trim();
  book.year = body.year;
  res.status(200).json(book);
});

app.patch("/api/books/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const book = books.find((b) => b.id === id);
  if (!book) return res.status(404).json({ error: `Book with id ${id} not found` });
  const body = req.body || {};
  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: "Provide at least one field to update" });
  }
  const errors = validateBook(body, true);
  if (errors.length) return res.status(400).json({ errors });
  if (body.title !== undefined) book.title = body.title.trim();
  if (body.author !== undefined) book.author = body.author.trim();
  if (body.year !== undefined) book.year = body.year;
  res.status(200).json(book);
});

app.delete("/api/books/:id", (req, res) => {
  const id = parseId(req, res);
  if (id === null) return;
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return res.status(404).json({ error: `Book with id ${id} not found` });
  const [deleted] = books.splice(index, 1);
  res.status(200).json({ message: "Book deleted successfully", book: deleted });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  next(err);
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
