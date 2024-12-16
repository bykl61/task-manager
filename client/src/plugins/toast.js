// src/plugins/toast.js
export const toastPlugin = {
  install: (app, options) => {
    const toast = {
      success: (detail, summary = 'Success') => {
        app.config.globalProperties.$toast.add({
          severity: 'success',
          summary,
          detail,
          life: 3000,
          closable: true
        });
      },
      error: (detail, summary = 'Error') => {
        app.config.globalProperties.$toast.add({
          severity: 'error',
          summary,
          detail,
          life: 5000,
          closable: true
        });
      },
      info: (detail, summary = 'Info') => {
        app.config.globalProperties.$toast.add({
          severity: 'info',
          summary,
          detail,
          life: 3000,
          closable: true
        });
      },
      warn: (detail, summary = 'Warning') => {
        app.config.globalProperties.$toast.add({
          severity: 'warn',
          summary,
          detail,
          life: 4000,
          closable: true
        });
      }
    };

    app.provide('toast', toast);
  }
};