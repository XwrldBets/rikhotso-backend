import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// API route to save requests
app.post("/api/request", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "INSERT INTO requests (name, email, phone, message) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, phone, message], (err) => {
    if (err) {
      console.error("Error saving request:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, message: "Request saved successfully" });
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Rikhotso Attorneys Backend API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
