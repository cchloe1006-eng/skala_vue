<template>
  <!--
    Element Plus의 Card 컴포넌트입니다.

    부모가 전달한 SearchBar와 WeatherCard 목록은
    기존처럼 Default Slot 위치에 표시됩니다.

    shadow="never":
    기본 상태에서는 과한 그림자를 표시하지 않습니다.
  -->
  <el-card class="base-dashboard-card" shadow="never">
    <slot></slot>
  </el-card>
</template>

<style scoped>
.base-dashboard-card {
  margin-bottom: 26px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background-color: #ffffff;
}

/*
 * Element Plus Card의 내부 영역에
 * 기존 공통 박스의 여백을 적용합니다.
 */
:deep(.base-dashboard-card .el-card__body) {
  padding: 28px;
}
</style>
