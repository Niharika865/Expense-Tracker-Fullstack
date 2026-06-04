const Database = require("better-sqlite3");

const db = new Database("expenses.db");

db.exec(`
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT,
    paymentMethod TEXT,
    tags TEXT,
    recurring INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

console.log("Database Connected");

module.exports = db;