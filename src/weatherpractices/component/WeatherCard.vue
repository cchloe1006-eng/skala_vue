<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore'
import { getTemperatureLevel, getTemperatureStyle } from '../../utils/temperature'

/*
 * 부모에게 전달받는 도시 데이터와 즐겨찾기 여부입니다.
 */
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },

  isFavorite: {
    type: Boolean,
    default: false,
  },
})

/*
 * 카드에서 발생한 동작을 부모에게 전달합니다.
 */
const emit = defineEmits(['select-card', 'click-detail', 'toggle-favorite'])

/* 전체 화면이 함께 사용하는 온도 단위 Store입니다. */
const configStore = useConfigStore()

/*
 * Store의 현재 단위에 맞게 표시할 온도를 계산합니다.
 */
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

/*
 * 카드의 온도 단계와 색상은 변환 전 섭씨값을 기준으로 계산합니다.
 */
const temperatureLevel = computed(() => {
  return getTemperatureLevel(props.cityItem.temp)
})

const temperatureStyle = computed(() => {
  return getTemperatureStyle(props.cityItem.temp)
})

/* 카드 선택 */
function handleSelectCard() {
  emit('select-card', props.cityItem.city)
}

/* 상세보기 */
function handleDetailClick() {
  emit('click-detail', props.cityItem.city, props.cityItem.weather)
}

/* 즐겨찾기 추가 또는 해제 */
function handleFavoriteClick() {
  emit('toggle-favorite', props.cityItem.city)
}
</script>

<template>
  <!--
    기존 article 박스를 Element Plus의 el-card로 변경했습니다.

    shadow="hover":
    마우스를 올렸을 때 카드 그림자가 나타납니다.
  -->
  <el-card
    class="weather-card"
    :style="temperatureStyle"
    shadow="hover"
    @click="handleSelectCard"
  >
    <div class="card-content">
      <span class="weather-icon">
        {{ cityItem.icon }}
      </span>

      <div class="weather-info">
        <h3>
          {{ cityItem.city }}
        </h3>

        <p class="weather-summary">
          {{ cityItem.weather }} · {{ displayTemp }}{{ configStore.unitSymbol }}
        </p>

        <!-- 원본 섭씨 온도 구간에 따라 문구와 색상이 달라집니다. -->
        <el-tag class="temperature-tag" effect="plain" round>
          {{ temperatureLevel.label }}
        </el-tag>
      </div>

      <div class="card-actions">
        <!--
          즐겨찾기 여부에 따라 Button 색상과 별 모양을 변경합니다.
        -->
        <el-button
          class="favorite-button"
          :type="isFavorite ? 'warning' : 'info'"
          :plain="!isFavorite"
          circle
          aria-label="즐겨찾기 변경"
          @click.stop="handleFavoriteClick"
        >
          {{ isFavorite ? '★' : '☆' }}
        </el-button>

        <!-- Element Plus 상세보기 버튼 -->
        <el-button type="primary" plain @click.stop="handleDetailClick"> 상세보기 </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.weather-card {
  border-left: 7px solid var(--temp-color);
  border-radius: 18px;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

/* 온도가 높을수록 빨강, 낮을수록 파랑 계열로 표시합니다. */
.temperature-tag {
  --el-tag-bg-color: var(--temp-background);
  --el-tag-border-color: var(--temp-color);
  --el-tag-text-color: var(--temp-text-color);

  font-weight: 700;
}

.weather-card:hover {
  transform: translateY(-3px);
}

/*
 * el-card 내부의 기본 padding을 조절합니다.
 */
:deep(.weather-card .el-card__body) {
  padding: 26px;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.weather-icon {
  flex-shrink: 0;
  font-size: 46px;
}

.weather-info {
  flex: 1;
  min-width: 0;
}

.weather-info h3 {
  margin: 0 0 7px;
  color: #1e293b;
  font-size: 21px;
}

.weather-summary {
  margin: 0 0 10px;
  color: #475569;
  font-size: 17px;
  font-weight: 600;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.favorite-button {
  font-size: 19px;
}

@media (max-width: 600px) {
  .card-content {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
