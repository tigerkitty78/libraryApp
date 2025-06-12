const User = require('../models/User');
const Session = require('../models/Session');

class UserController {
  static async register(req, res) {
    try {
      const { username, password, email } = req.body;

      // Validate input data
      if (!username || !password || !email) {
        return res.status(400).json({ error: 'Missing required fields: username, password, email' });
      }

      // Validate email format
      if (!User.validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Validate password strength
      if (!User.validatePassword(password)) {
        return res.status(400).json({ 
          error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
        });
      }

      // Validate username (alphanumeric and underscore only, 3-50 characters)
      if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
        return res.status(400).json({ 
          error: 'Username must be 3-50 characters long and contain only letters, numbers, and underscores' 
        });
      }

      // Create user
      const result = await User.create(username, email, password);

      if (result.error) {
        return res.status(result.statusCode).json({ error: result.error });
      }

      return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Basic protection against excessively large payloads
      if (username.length > 100 || password.length > 1000) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Find user
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create session
      const sessionToken = await Session.create(username);

      // Set session cookie
      res.cookie('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return res.status(200).json({
        username: user.username,
        email: user.email
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  static async logout(req, res) {
    try {
      const sessionToken = req.cookies.session;
      
      if (sessionToken) {
        await Session.deleteByToken(sessionToken);
      }

      res.clearCookie('session');
      return res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;