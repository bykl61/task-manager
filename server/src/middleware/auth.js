import jwt from 'jsonwebtoken';
import { sessionManager } from '../config/sessionManager.js';
import { ErrorHelper } from '../utils/errorHelper.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Token bulunamadı');
    }

    // JWT'den kullanıcı bilgilerini al
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Redis'te token kontrolü
    const isValidSession = await sessionManager.validate(decoded.id, token);
    if (!isValidSession) {
      throw new Error('Oturum süresi dolmuş veya geçersiz');
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(ErrorHelper.authError(error.message));
  }
};