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
import WeatherMockup from '../weatherpractices/composition/mockup/WeatherMockup.vue'

import LifecycleParent from '../components/practices/lifecycle/LifecycleParent.vue'
import PropsEmitsParent from '../components/practices/props-emits/PropsEmitsParent.vue'
import WeatherParent from '../weatherpractices/component/WeatherParent.vue'

/*
 * Weather Router 과제의 View는 Lazy Loading으로 가져옵니다.
 *
 * 사용자가 해당 주소에 처음 방문할 때
 * 필요한 View 파일을 불러옵니다.
 */
const WeatherHomeView = () => import('../views/WeatherHomeView.vue')
const WeatherAboutView = () => import('../views/WeatherAboutView.vue')
const WeatherDetailView = () => import('../views/WeatherDetailView.vue')
const FavoriteWeatherView = () => import('../views/FavoriteWeatherView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    /*
     * Weather Router 과제의 메인 페이지
     *
     * 과제 요구사항에 따라 / 경로에 WeatherHomeView를 연결합니다.
     *
     * alias를 사용했기 때문에 /weather로 접속해도
     * 같은 WeatherHomeView가 표시됩니다.
     */
    {
      path: '/',
      alias: '/weather',
      name: 'weather-home',
      component: WeatherHomeView,
    },

    /*
     * 기존 Vue 프로젝트의 HomeView를 삭제하지 않고
     * /original-home 경로에 보관합니다.
     */
    {
      path: '/original-home',
      name: 'home',
      component: HomeView,
    },

    /*
     * 기존 Vue 기본 AboutView는 삭제하지 않고
     * /original-about 주소에서 확인할 수 있게 보관합니다.
     */
    {
      path: '/original-about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },

    /* =================================================
       기존 기초 실습 Route
       ================================================= */

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

    /* =================================================
       Composition API 실습 Route
       ================================================= */

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
    {
      path: '/weather-mockup',
      name: 'weather-mockup',
      component: WeatherMockup,
    },

    /* =================================================
       Lifecycle / Props & Emits 실습 Route
       ================================================= */

    {
      path: '/lifecycle-example',
      name: 'lifecycle-example',
      component: LifecycleParent,
    },
    {
      path: '/props-emits-example',
      name: 'props-emits-example',
      component: PropsEmitsParent,
    },

    /*
     * 이전 Weather Component 과제 결과물을 확인하는 Route입니다.
     *
     * WeatherParent 파일은 이전 과제 결과물이므로
     * 삭제하지 않고 이 주소에서 확인할 수 있게 유지합니다.
     */
    {
      path: '/weather-component',
      name: 'weather-component',
      component: WeatherParent,
    },

    /* =================================================
       Weather Router 과제
       ================================================= */

    /*
     * 날씨 서비스 소개 페이지
     *
     * 과제 예시와 동일하게 /about을 기본 주소로 사용합니다.
     * alias를 설정했기 때문에 기존 /weather/about 주소도 사용할 수 있습니다.
     */
    {
      path: '/about',
      alias: '/weather/about',
      name: 'weather-about',
      component: WeatherAboutView,
    },

    // 본인이 추가한 즐겨찾기 View
    {
      path: '/weather/favorites',
      name: 'favorite-weather',
      component: FavoriteWeatherView,
    },

    /*
     * 동적 상세 경로
     *
     * 예:
     * /weather/busan
     * /weather/seoul
     *
     * busan 또는 seoul이 cityId로 전달됩니다.
     */
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: WeatherDetailView,
    },

    /*
     * 존재하지 않는 도시 ID를 발견했을 때
     * 코드에서 이동할 Not Found 주소입니다.
     */
    {
      path: '/not-found',
      name: 'not-found',
      component: NotFoundView,
    },

    /*
     * Catch-all Route
     *
     * 위에 등록된 어떤 주소와도 일치하지 않으면
     * NotFoundView를 표시합니다.
     *
     * Catch-all Route는 반드시 마지막에 배치합니다.
     */
    {
      path: '/:pathMatch(.*)*',
      name: 'catch-all',
      component: NotFoundView,
    },
  ],
})

export default router
