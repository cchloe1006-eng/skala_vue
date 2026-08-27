<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'

const message = ref('Parent 초기 메시지')
</script>

<template>
  <div>
    <h2>부모 컴포넌트</h2>

    <p>
      부모가 가진 데이터:
      <strong>{{ message }}</strong>
    </p>

    <PropsEmitsChild :parent-data="message" />
  </div>
</template>
