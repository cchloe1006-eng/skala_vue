<script setup>
import { useConfigStore } from '../stores/configStore'

/*
 * 내비게이션의 UnitToggler와 같은 Store를 사용합니다.
 */
const configStore = useConfigStore()

/*
 * 과제에서 요구한 '본인만의 추가 View'에서 사용하는
 * 즐겨찾기 예시 데이터입니다.
 *
 * 모든 temp 값은 섭씨 원본 데이터입니다.
 */
const sampleFavorites = [
  {
    id: 'busan',
    city: '부산',
    weather: '맑음',
    temp: 28,
    icon: '☀️',
  },
  {
    id: 'jeju',
    city: '제주',
    weather: '맑음',
    temp: 26,
    icon: '🌤️',
  },
]

/*
 * 전달받은 섭씨 온도를 현재 Store 단위에 맞게 변환합니다.
 */
function convertTemp(rawTemp) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
}
</script>

<template>
  <main class="favorite-view">
    <section class="favorite-container">
      <div class="title-area">
        <div>
          <h1>⭐ 즐겨찾는 도시</h1>
          <p>관심 있는 도시의 날씨를 빠르게 확인할 수 있습니다.</p>
        </div>

        <RouterLink :to="{ name: 'weather-home' }" class="home-link">
          대시보드로 돌아가기
        </RouterLink>
      </div>

      <div class="favorite-grid">
        <article v-for="item in sampleFavorites" :key="item.id" class="favorite-card">
          <span class="weather-icon">{{ item.icon }}</span>

          <div class="weather-info">
            <h2>{{ item.city }}</h2>
            <p>{{ item.weather }} · {{ convertTemp(item.temp) }}{{ configStore.unitSymbol }}</p>
          </div>

          <!--
            이름으로 상세 페이지를 찾고,
            params로 선택한 도시의 id를 URL에 전달합니다.

            결과 예시: /weather/busan
          -->
          <RouterLink
            :to="{
              name: 'weather-detail',
              params: { cityId: item.id },
            }"
            class="detail-link"
          >
            상세보기
          </RouterLink>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.favorite-view {
  width: 100%;
  min-height: 100vh;
  padding: 60px 24px;
  box-sizing: border-box;
}

.favorite-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.title-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.title-area h1 {
  margin: 0 0 10px;
  color: #1e293b;
}

.title-area p {
  margin: 0;
  color: #64748b;
}

.home-link {
  padding: 12px 18px;
  border-radius: 10px;
  color: #ffffff;
  background-color: #2563eb;
  text-decoration: none;
  white-space: nowrap;
}

.favorite-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.favorite-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 26px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background-color: #fffdf5;
}

.weather-icon {
  font-size: 44px;
}

.weather-info {
  flex: 1;
}

.weather-info h2 {
  margin: 0 0 6px;
  color: #1e293b;
  font-size: 20px;
}

.weather-info p {
  margin: 0;
  color: #64748b;
}

.detail-link {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #334155;
  background-color: #ffffff;
  text-decoration: none;
  white-space: nowrap;
}

.detail-link:hover {
  border-color: #2563eb;
  color: #2563eb;
}

@media (max-width: 600px) {
  .title-area {
    align-items: flex-start;
    flex-direction: column;
  }

  .favorite-card {
    align-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
