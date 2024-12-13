<template lang="pug">
  .register-container
    .register-form
      Card
        template(#title)
          .text-center.mb-8
            .logo-container.mb-6
            h2.text-2xl.font-semibold Kayıt Ol

        template(#content)
          form.p-fluid(@submit.prevent="handleSubmit")
            .field
              span.p-float-label
                InputText#firstName(
                  v-model="firstName"
                  :class="{'p-invalid': v$.firstName.$error}"
                  class="p-inputtext-lg"
                  @blur="v$.firstName.$touch"
                  :disabled="loading"
                )
                label(for="firstName") İsim
              small.p-error(v-if="v$.firstName.$error")
                | {{ v$.firstName.$errors[0].$message }}

            .field
              span.p-float-label
                InputText#lastName(
                  v-model="lastName"
                  :class="{'p-invalid': v$.lastName.$error}"
                  class="p-inputtext-lg"
                  @blur="v$.lastName.$touch"
                  :disabled="loading"
                )
                label(for="lastName") Soyisim
              small.p-error(v-if="v$.lastName.$error")
                | {{ v$.lastName.$errors[0].$message }}

            .field
              span.p-float-label
                InputText#emailValue(
                  v-model="emailValue"
                  :class="{'p-invalid': v$.emailValue.$error}"
                  class="p-inputtext-lg"
                  @blur="v$.emailValue.$touch"
                  :disabled="loading"
                )
                label(for="emailValue") Email
              small.p-error(v-if="v$.emailValue.$error")
                | {{ v$.emailValue.$errors[0].$message }}

            .field
              span.p-float-label
                Password#password(
                  v-model="password"
                  :toggleMask="true"
                  :class="{'p-invalid': v$.password.$error}"
                  class="p-inputtext-lg"
                  :feedback="false"
                  @blur="v$.password.$touch"
                  :disabled="loading"
                )
                label(for="password") Şifre
              small.p-error(v-if="v$.password.$error")
                | {{ v$.password.$errors[0].$message }}

            .field
              span.p-float-label
                Password#confirmPassword(
                  v-model="confirmPassword"
                  :toggleMask="true"
                  :class="{'p-invalid': v$.confirmPassword.$error}"
                  class="p-inputtext-lg"
                  :feedback="false"
                  @blur="v$.confirmPassword.$touch"
                  :disabled="loading"
                )
                label(for="confirmPassword") Şifre Tekrarı
              small.p-error(v-if="v$.confirmPassword.$error")
                | {{ v$.confirmPassword.$errors[0].$message }}

            // API'den gelen hata mesajını göster
            .field(v-if="error")
              small.p-error {{ error }}

            Button(
              type="submit"
              label="Kayıt Ol"
              class="p-button-success p-button-lg w-full"
              :loading="loading"
            )

        template(#footer)
          .text-center.mt-8
            router-link.text-color-secondary.text-lg(to="/login") Hesabınız var mı? Giriş Yap
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { validators } from '../../../utils/validators.js'
import { useAuthStore } from '@/stores/auth'

// Auth store'u başlatıyoruz
const authStore = useAuthStore()

// Form değerlerini tanımlıyoruz
const firstName = ref('')
const lastName = ref('')
const emailValue = ref('')
const password = ref('')
const confirmPassword = ref('')

// Store'dan loading ve error durumlarını alıyoruz
const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

// Validasyon kuralları
const rules = {
  firstName: {
    required: validators.required,
    minLength: validators.minLength(2)
  },
  lastName: {
    required: validators.required,
    minLength: validators.minLength(2)
  },
  emailValue: {
    required: validators.required,
    email: validators.email
  },
  password: {
    required: validators.required,
    minLength: validators.minLength(6)
  },
  confirmPassword: {
    required: validators.required,
    sameAsPassword: validators.sameAs(password)
  }
}

const v$ = useVuelidate(rules, {
  firstName,
  lastName,
  emailValue,
  password,
  confirmPassword
})

// Form gönderme işlemi
const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  try {
    // Store üzerinden register action'ını çağırıyoruz
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: emailValue.value,
      password: password.value,
      confirmPassword: password.value
    })
    // Başarılı durumda store otomatik olarak login sayfasına yönlendirecek
  } catch (err) {
    // Hata yönetimi store tarafında yapılıyor
    console.error('Kayıt başarısız:', err)
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--surface-ground);
}

.register-form {
  width: 100%;
  max-width: 420px;
}

.logo {
  height: 60px;
  width: auto;
}

.text-color-secondary {
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.3s ease;
}

.text-color-secondary:hover {
  text-decoration: underline;
  opacity: 0.8;
}

:deep(.p-password input) {
  width: 100%;
}
</style>