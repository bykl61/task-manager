import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import TaskListView from '@/views/task/TaskListView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: (to) => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? '/tasks' : '/login'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      public: true,
      hideAppHeader: true,
      requiresGuest: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      public: true,
      hideAppHeader: true,
      requiresGuest: true
    }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? '/tasks' : '/login'
    }
  }
]
const publicRoutes = ['login', 'register']
const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isPublicRoute = publicRoutes.includes(to.name)

  if (!isPublicRoute && !authStore.isAuthenticated) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  }

  if (isPublicRoute && authStore.isAuthenticated) {
    return next({ name: 'tasks' })
  }

  next()
})

export default router