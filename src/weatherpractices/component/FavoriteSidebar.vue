<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'
import { getTemperatureLevel, getTemperatureStyle } from '../../utils/temperature'

/*
 * 부모가 계산한 평균 기온과
 * 즐겨찾기 도시 목록을 전달받습니다.
 */
const props = defineProps({
  averageTemp: {
    type: [Number, String],
    required: true,
  },

  favoriteItems: {
    type: Array,
    default: () => [],
  },
})

/* 전체 화면에서 함께 사용하는 온도 단위 Store */
const configStore = useConfigStore()

/* 현재 단위에 맞게 평균 기온을 변환합니다. */
const displayAverageTemp = computed(() => {
  const rawTemp = Number(props.averageTemp)

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

/*
 * 섭씨 평균은 소수점 한 자리,
 * 화씨 평균은 정수로 표시합니다.
 */
const averagePrecision = computed(() => {
  return configStore.unit === 'celsius' ? 1 : 0
})

/* 평균 온도 영역도 같은 색상 기준을 사용합니다. */
const averageTemperatureLevel = computed(() => {
  return getTemperatureLevel(Number(props.averageTemp))
})

const averageTemperatureStyle = computed(() => {
  return getTemperatureStyle(Number(props.averageTemp))
})

/* 즐겨찾기 도시의 온도를 변환합니다. */
function convertTemp(rawTemp) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
}
</script>

<template>
  <!-- 즐겨찾기 전체 영역을 Element Plus Card로 변경 -->
  <el-card class="favorite-sidebar" shadow="never">
    <template #header>
      <div class="sidebar-header">
        <span>⭐ 즐겨찾기</span>

        <!-- 즐겨찾기 도시 개수를 Element Plus Tag로 표시 -->
        <el-tag type="warning" effect="plain" round> {{ favoriteItems.length }}개 </el-tag>
      </div>
    </template>

    <!--
      Element Plus Statistic으로 평균 기온을 표시합니다.
    -->
    <div class="summary-box" :style="averageTemperatureStyle">
      <el-statistic :value="displayAverageTemp" :precision="averagePrecision">
        <template #title>
          <span class="summary-title"> 전체 도시 평균 기온 </span>
        </template>

        <template #suffix>
          {{ configStore.unitSymbol }}
        </template>
      </el-statistic>

      <span class="average-temperature-label">
        {{ averageTemperatureLevel.label }}
      </span>
    </div>

    <!-- 즐겨찾기 도시가 있을 때 -->
    <div v-if="favoriteItems.length > 0" class="favorite-list">
      <!-- 각 도시도 Element Plus Card로 표시 -->
      <el-card
        v-for="item in favoriteItems"
        :key="`favorite-${item.city}`"
        class="favorite-card"
        :style="getTemperatureStyle(item.temp)"
        shadow="hover"
      >
        <div class="favorite-content">
          <span class="weather-icon">
            {{ item.icon }}
          </span>

          <div class="weather-info">
            <strong>{{ item.city }}</strong>

            <p>{{ item.weather }} · {{ convertTemp(item.temp) }}{{ configStore.unitSymbol }}</p>

            <el-tag class="temperature-tag" effect="plain" size="small" round>
              {{ getTemperatureLevel(item.temp).label }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 즐겨찾기 도시가 없을 때 -->
    <el-empty v-else description="별을 눌러 도시를 즐겨찾기에 추가해보세요." :image-size="80" />
  </el-card>
</template>

<style scoped>
.favorite-sidebar {
  position: sticky;
  top: 130px;
  width: 420px;
  flex-shrink: 0;
  border-radius: 20px;
  background-color: #fffdf5;
}

/* Element Plus Card 헤더 */
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  color: #1e293b;
  font-size: 22px;
  font-weight: 700;
}

/* 평균 기온 영역 */
.summary-box {
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid var(--temp-color);
  border-radius: 16px;
  background-color: var(--temp-background);
  text-align: center;
}

.summary-title {
  color: #64748b;
  font-size: 15px;
}

/* Element Plus Statistic의 숫자 디자인 */
:deep(.summary-box .el-statistic__content) {
  justify-content: center;
  color: var(--temp-text-color);
  font-size: 34px;
  font-weight: 700;
}

.average-temperature-label {
  display: inline-block;
  padding: 4px 10px;
  margin-top: 10px;
  border-radius: 999px;
  color: var(--temp-text-color);
  background-color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

/* 즐겨찾기 카드 목록 */
.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-card {
  border-left: 6px solid var(--temp-color);
  border-radius: 16px;
}

.temperature-tag {
  --el-tag-bg-color: var(--temp-background);
  --el-tag-border-color: var(--temp-color);
  --el-tag-text-color: var(--temp-text-color);

  font-weight: 700;
}

:deep(.favorite-card .el-card__body) {
  padding: 20px;
}

.favorite-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.weather-icon {
  flex-shrink: 0;
  font-size: 38px;
}

.weather-info {
  flex: 1;
}

.weather-info strong {
  color: #1e293b;
  font-size: 17px;
}

.weather-info p {
  margin: 6px 0 10px;
  color: #64748b;
  font-size: 15px;
}

@media (max-width: 900px) {
  .favorite-sidebar {
    position: static;
    width: 100%;
  }
}
</style>
