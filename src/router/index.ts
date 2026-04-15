import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/components/Index.vue'
import Chat from '@/components/Chat.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Index },
    { path: '/chat', component: Chat },
  ],
})

export default router
