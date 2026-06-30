import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isBlacklisted } from '../utils/tokenBlacklist.js';

export const optionalAuth = async (req, _res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || isBlacklisted(token)) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch {
    // Ignore invalid tokens for optional auth
  }
  next();
};
