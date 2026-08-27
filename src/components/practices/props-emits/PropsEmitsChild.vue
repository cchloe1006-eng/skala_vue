<script setup>
defineProps({
  parentData: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>
    <h2>자식 컴포넌트</h2>

    <p>
      부모에게 받은 데이터:
      <strong>{{ parentData }}</strong>
    </p>
  </div>
</template>
