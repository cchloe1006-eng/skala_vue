/* Element Plus 기본 디자인 */
import 'element-plus/dist/index.css'

/* 프로젝트 전역 디자인 */
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

/*
 * 실제 프로젝트에서 사용하는
 * Element Plus 컴포넌트만 가져옵니다.
 */
import {
  ElButton,
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
  ElEmpty,
  ElInput,
  ElRadioButton,
  ElRadioGroup,
  ElResult,
  ElSkeleton,
  ElStatistic,
  ElSwitch,
  ElTag,
} from 'element-plus'

import App from './App.vue'
import router from './router'

const app = createApp(App)

/* Pinia와 Vue Router 등록 */
app.use(createPinia())
app.use(router)

/*
 * 사용하는 Element Plus 컴포넌트 목록입니다.
 */
const elementPlusComponents = [
  ElButton,
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
  ElEmpty,
  ElInput,
  ElRadioButton,
  ElRadioGroup,
  ElResult,
  ElSkeleton,
  ElStatistic,
  ElSwitch,
  ElTag,
]

/*
 * 목록의 컴포넌트를 전역으로 등록합니다.
 *
 * 따라서 각 Vue 파일에서 별도의 import 없이
 * <el-button>, <el-card> 등을 사용할 수 있습니다.
 */
elementPlusComponents.forEach((component) => {
  app.component(component.name, component)
})

app.mount('#app')
