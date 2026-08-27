<script setup>
import { useConfigStore } from '../../stores/configStore'

/*
 * 모든 페이지가 함께 사용하는 온도 단위 Store입니다.
 */
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <!--
      Element Plus Tag로 현재 온도 단위를 표시합니다.
    -->
    <el-tag class="current-unit-tag" type="info" size="large" round>
      현재: {{ configStore.unitName }}
      {{ configStore.unitSymbol }}
    </el-tag>

    <!--
      Element Plus Switch입니다.

      false:
      섭씨

      true:
      화씨

      스위치를 변경하면 기존 configStore의
      toggleUnit action을 실행합니다.
    -->
    <el-switch
      :model-value="configStore.unit === 'fahrenheit'"
      size="large"
      active-text="화씨"
      inactive-text="섭씨"
      @change="configStore.toggleUnit"
    />

    <!-- 나만의 추가 Store 상태를 표시합니다. -->
    <el-tag v-if="configStore.unitChangeCount > 0" type="success" effect="plain" round>
      변경 {{ configStore.unitChangeCount }}회
    </el-tag>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.current-unit-tag {
  font-size: 15px;
  font-weight: 700;
}

/*
 * Element Plus Switch의 활성화 색상을
 * 날씨 대시보드의 파란색과 맞춥니다.
 */
:deep(.el-switch) {
  --el-switch-on-color: #2563eb;
  --el-switch-off-color: #94a3b8;
}

@media (max-width: 600px) {
  .unit-toggler {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
