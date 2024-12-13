// src/utils/validators.js
import { required, email, minLength, sameAs } from '@vuelidate/validators'

// Özel validasyon mesajları
export const withMessage = (validator, message) => {
  return {
    $validator: validator.$validator,
    $message: () => message
  }
}

// Yaygın kullanılan validasyonlar
export const validators = {
  required: withMessage(required, 'Bu alan zorunludur'),
  email: withMessage(email, 'Geçerli bir email adresi giriniz'),
  minLength: (min) => withMessage(minLength(min), `En az ${min} karakter giriniz`),
  sameAs: (field) => withMessage(sameAs(field), 'Şifreler eşleşmiyor')
}