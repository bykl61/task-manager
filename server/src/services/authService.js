import userRepository from '../repositories/userRepository.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { loginSchema } from '../middleware/validation/login.js';
import { ErrorHelper } from '../utils/errorHelper.js';
import { registerSchema } from '../middleware/validation/register.js';
import { sessionManager } from '../config/sessionManager.js';

class AuthService {
  async login(email, password) {
    const { error } = loginSchema.validate(
      { email, password },
      { abortEarly: false },
    );

    if (error) {
      return { error: ErrorHelper.validationError(error) };
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { error: ErrorHelper.notFoundError('Kullanıcı bulunamadı.') };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: ErrorHelper.authError('Şifreler eşleşmiyor.') };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    await sessionManager.store(user.id, token);

    return { success: true, data: { token } };
  }

  async register(userData) {
    const { error } = registerSchema.validate(userData, { abortEarly: false });
    if (error) {
      return { error: ErrorHelper.validationError(error) };
    }
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      return { error: ErrorHelper.conflictError('Kullanıcı zaten mevcut.') };
    }

    const { confirmPassword, ...userToSave } = userData;
    await userRepository.create(userToSave);

    return { success: true };
  }

  async logout(userId) {
    // Redis'ten token'ı sil
    await sessionManager.remove(userId);
    return { success: true };
  }
}

export default new AuthService;
