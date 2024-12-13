<template lang="pug">
  .login-container
    .login-form
      Card
        template(#title)
          .text-center.mb-8
            .logo-container.mb-6
              //img(src="@/assets/images/logo.svg" alt="Logo" class="logo")
            h2.text-2xl.font-semibold Giriş Yap

        template(#content)
          form.p-fluid(@submit.prevent="handleSubmit")
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

            // API'den gelen hata mesajını göster
            .field(v-if="error")
              small.p-error {{ error }}

            Button(
              type="submit"
              label="Giriş Yap"
              class="p-button-success p-button-lg w-full"
              :loading="loading"
            )

        template(#footer)
          .text-center.mt-8
            router-link.text-color-secondary.text-lg(to="/register") Hesabınız yok mu? Kayıt Ol
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { validators } from '../../../utils/validators.js'
import { useAuthStore } from '@/stores/auth' // Auth store'u import ediyoruz

// Auth store'u başlatıyoruz
const authStore = useAuthStore()

// Form değerlerini tanımlıyoruz
const emailValue = ref('')
const password = ref('')

const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

const rules = {
  emailValue: {
    required: validators.required,
    email: validators.email
  },
  password: {
    required: validators.required,
    minLength: validators.minLength(6)
  }
}

const v$ = useVuelidate(rules, {
  emailValue,
  password
})

const handleSubmit = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  try {
    await authStore.login({
      email: emailValue.value,
      password: password.value
    })
  } catch (err) {
    console.error('Giriş başarısız:', err)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--surface-ground);
}

.login-form {
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