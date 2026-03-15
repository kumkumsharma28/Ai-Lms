// middleware/auth.js
const jwt    = require('jsonwebtoken');
const { getDb } = require('../config/database');

const protect = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided.' });

  const token = header.split(' ')[1];
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user   = getDb().prepare('SELECT id, full_name, email, role FROM users WHERE id=?').get(id);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: `Role '${req.user.role}' cannot access this resource.` });

module.exports = { protect, authorize };
