const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');
const { Op } = require('sequelize');

class SessionService {
  static async create(username) {
    try {
      const sessionToken = uuidv4();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await Session.create({
        session_token: sessionToken,
        username,
        expires_at: expiresAt,
      });

      return sessionToken;
    } catch (error) {
      throw error;
    }
  }

  static async findByToken(sessionToken) {
    try {
      const session = await Session.findOne({
        where: {
          session_token: sessionToken,
          expires_at: { [Op.gt]: new Date() }
        }
      });

      return session;
    } catch (error) {
      throw error;
    }
  }

  static async deleteExpired() {
    try {
      await Session.destroy({
        where: {
          expires_at: { [Op.lte]: new Date() }
        }
      });
    } catch (error) {
      console.error('Error deleting expired sessions:', error);
    }
  }

  static async deleteByToken(sessionToken) {
    try {
      await Session.destroy({ where: { session_token: sessionToken } });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SessionService;
