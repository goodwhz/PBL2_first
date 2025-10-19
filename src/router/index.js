import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PoemDetail from '../views/PoemDetail.vue'
import Authors from '../views/Authors.vue'
import AuthorDetail from '../views/AuthorDetail.vue'
import Dynasties from '../views/Dynasties.vue'
import Tags from '../views/Tags.vue'
import Search from '../views/Search.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/poem/:id',
    name: 'PoemDetail',
    component: PoemDetail,
    props: true
  },
  {
    path: '/authors',
    name: 'Authors',
    component: Authors
  },
  {
    path: '/author/:id',
    name: 'AuthorDetail',
    component: AuthorDetail,
    props: true
  },
  {
    path: '/dynasties',
    name: 'Dynasties',
    component: Dynasties
  },
  {
    path: '/tags',
    name: 'Tags',
    component: Tags
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router