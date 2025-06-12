const Session = require('../models/Session');

const authenticateSession = async (req, res, next) => {
  try {
    const sessionToken = req.cookies.session;

    if (!sessionToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const session = await Session.findByToken(sessionToken);
    if (!session) {
      res.clearCookie('session');
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.user = { username: session.username };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const adminApiKey = process.env.ADMIN_API_KEY ;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Admin API key required' });
  }

  const apiKey = authHeader.substring(7);
  if (apiKey !== adminApiKey) {
    return res.status(401).json({ error: 'Invalid admin API key' });
  }

  next();
};

module.exports = { authenticateSession, authenticateAdmin };