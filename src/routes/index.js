import { createRouter, createWebHistory } from "vue-router"

const route = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/dashboard",
      name: 'dashboard',
      component: () => import('../views/dashboard/indexView.vue'),
      redirect: to => {
        return { name: 'my-quizzes' }
      },
      children: [
        {
          path: 'login',
          name: 'login',
          meta: {
            authSystem: true
          },
          components: {
            dashboard: () => import('../views/auth/LogInView.vue')
          }
        },
        {
          path: 'sign-up',
          name: 'signup',
          meta: {
            authSystem: true
          },
          components: {
            dashboard: () => import('../views/auth/SignUpView.vue')
          }
        },
        {
          path: 'create-quiz',
          name: 'create',
          meta: {
            requiresAuth: true
          },
          components: {
            dashboard: () => import('../views/dashboard/CreateView.vue')
          }
        },
        {
          path: 'update-quiz/:quizId',
          name: 'update',
          meta: {
            requiresAuth: true
          },
          components: {
            dashboard: () => import('../views/dashboard/QuizzesView.vue')
          }
        },
        {
          path: 'my-quizzes',
          name: 'my-quizzes',
          meta: {
            requiresAuth: true
          },
          components: {
            dashboard: () => import('../views/dashboard/UserQuizzesView.vue')
          }
        }
      ]
    },
    {
      path: '/quiz',
      component: () => import('../views/QuizView.vue')
    },
    {
      path: '/',
      name: 'quizzes',
      component: () => import('../views/QuizzesView.vue')
    },
    {
      path: '/:quiz',
      name: 'quiz',
      component: () => import('../views/QuizView.vue')
    }
  ],
})

route.beforeEach((to, from, next) => {
  const token = localStorage.key('token')
  if (to.meta.requiresAuth) {
    if (token)
      next()
    else
      next({ name: 'login' })
  }

  if (token && to.meta.authSystem) {
    next({ name: 'quizzes' })
  } else next()

})

export default route 