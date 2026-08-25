import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EventHandlingChallenge from '../components/practices/basic/EventHandlingChallenge.vue'
import FormHandlingChallenge from '../components/practices/basic/FormHandlingChallenge.vue'
import WeatherComposition from '../weatherpractices/composition/WeatherComposition.vue'
import ComputedExample from '../weatherpractices/composition/ComputedExample.vue'
import WatchExample from '../weatherpractices/composition/WatchExample.vue'
import MultiSourceWatchExample from '../weatherpractices/composition/MultiSourceWatchExample.vue'
import DeepWatchExample from '../weatherpractices/composition/DeepWatchExample.vue'
import ReactiveWatchExample from '../weatherpractices/composition/ReactiveWatchExample.vue'
import WatchEffectExample from '../weatherpractices/composition/WatchEffectExample.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/event-handling-challenge',
      name: 'event-handling-challenge',
      component: EventHandlingChallenge,
    },
    {
      path: '/form-handling-challenge',
      name: 'form-handling-challenge',
      component: FormHandlingChallenge,
    },
    {
      path: '/weather-composition',
      name: 'weather-composition',
      component: WeatherComposition,
    },
    {
      path: '/computed-example',
      name: 'computed-example',
      component: ComputedExample,
    },
    {
      path: '/watch-example',
      name: 'watch-example',
      component: WatchExample,
    },
    {
      path: '/multi-source-watch-example',
      name: 'multi-source-watch-example',
      component: MultiSourceWatchExample,
    },
    {
      path: '/deep-watch-example',
      name: 'deep-watch-example',
      component: DeepWatchExample,
    },
    {
      path: '/reactive-watch-example',
      name: 'reactive-watch-example',
      component: ReactiveWatchExample,
    },
    {
      path: '/watcheffect-example',
      name: 'watcheffect-example',
      component: WatchEffectExample,
    },
  ],
})

export default router
