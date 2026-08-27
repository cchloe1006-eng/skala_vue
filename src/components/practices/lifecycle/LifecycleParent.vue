<script setup>
import { ref } from 'vue'
import LifecycleHookExample from './LifecycleHookExample.vue'

const showChild = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>Lifecycle Hook 부모 컴포넌트</h2>
    <button @click="showChild = !showChild">
      {{ showChild ? '자식 컴포넌트 없애기 (onUnmounted 확인)' : '자식 컴포넌트 다시 만들기' }}
    </button>

    <hr />

    <LifecycleHookExample v-if="showChild" />
  </div>
</template>
