const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validator = require('validator');

class UserService {
  static validatePassword(password) {
    if (!password || password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  }

  static validateEmail(email) {
    return validator.isEmail(email);
  }

  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  static async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  static async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  static async create(username, email, password) {
    const existing = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [{ username }, { email }]
      }
    });

    if (existing) {
      return { error: 'User already exists', statusCode: 418 };
    }

    const password_hash = await this.hashPassword(password);

    const newUser = await User.create({ username, email, password_hash });
    return { success: true, userId: newUser.id };
  }
}

module.exports = UserService;
