import HttpHelper from '../utils/httpHelper.js';
import authService from '../services/authService.js';

class AuthController {
  async login(req, res) {
    const result = await authService.login(req.body.email, req.body.password);

    if (result.error) {
      return HttpHelper.error(res, result.error);
    }

    return HttpHelper.success(res, result.data);
  }

  async register(req, res) {
    const result = await authService.register(req.body);

    if (result.error) {
      return HttpHelper.error(res, result.error);
    }

    return HttpHelper.success(res, { message: 'Kayıt başarılı!' });
  }
}

export default new AuthController;
