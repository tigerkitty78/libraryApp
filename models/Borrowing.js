const { pool } = require('../config/database');

// Add a new borrowing
const addBorrowing = async (username, isbn) => {
  const query = `
    INSERT INTO borrowings (username, isbn)
    VALUES (?, ?)
  `;
  const [result] = await pool.execute(query, [username, isbn]);
  return result.insertId;
};

// Mark a book as returned
const returnBook = async (id) => {
  const query = `
    UPDATE borrowings
    SET returned_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  await pool.execute(query, [id]);
};

// Get all borrowings
const getAllBorrowings = async () => {
  const [rows] = await pool.execute('SELECT * FROM borrowings');
  return rows;
};

// Get borrowings by user
const getUserBorrowings = async (username) => {
  const [rows] = await pool.execute('SELECT * FROM borrowings WHERE username = ?', [username]);
  return rows;
};

module.exports = {
  addBorrowing,
  returnBook,
  getAllBorrowings,
  getUserBorrowings,
};

