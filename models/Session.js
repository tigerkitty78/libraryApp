const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Session {
  static async create(username) {
    try {
      const sessionToken = uuidv4();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await pool.execute(
        'INSERT INTO sessions (session_token, username, expires_at) VALUES (?, ?, ?)',
        [sessionToken, username, expiresAt]
      );

      return sessionToken;
    } catch (error) {
      throw error;
    }
  }

  static async findByToken(sessionToken) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM sessions WHERE session_token = ? AND expires_at > NOW()',
        [sessionToken]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async deleteExpired() {
    try {
      await pool.execute('DELETE FROM sessions WHERE expires_at <= NOW()');
    } catch (error) {
      console.error('Error deleting expired sessions:', error);
    }
  }

  static async deleteByToken(sessionToken) {
    try {
      await pool.execute('DELETE FROM sessions WHERE session_token = ?', [sessionToken]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Session;