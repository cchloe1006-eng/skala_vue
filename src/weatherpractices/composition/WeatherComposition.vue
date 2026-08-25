<template>
  <div class="page-layout">
    <!-- 왼쪽: 검색 + 정렬 + 목록 -->
    <div class="weather-composition">
      <h2>오늘의 날씨</h2>

      <!-- 도시/날씨 검색 입력창 -->
      <div class="search-row">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="도시 이름 또는 날씨(맑음/비/흐림)를 검색하세요"
        />
        <button class="search-btn" @click="handleSearchClick">검색</button>
      </div>

      <!-- 정렬 토글 버튼 -->
      <div class="sort-toggle">
        <button :class="{ active: sortOrder === 'none' }" @click="sortOrder = 'none'">
          기본순
        </button>
        <button :class="{ active: sortOrder === 'asc' }" @click="sortOrder = 'asc'">
          온도 낮은순
        </button>
        <button :class="{ active: sortOrder === 'desc' }" @click="sortOrder = 'desc'">
          온도 높은순
        </button>
      </div>

      <!-- 검색 결과 표시 영역 -->
      <div class="weather-list">
        <!-- 검색어가 비었을 때: 원본 데이터 전체 출력 -->
        <template v-if="searchQuery === ''">
          <div
            v-for="item in sortedWeatherList"
            :key="item.city"
            class="weather-card"
            @click="selectCity(item.city)"
          >
            <span class="icon">{{ item.icon }}</span>
            <div class="info">
              <div class="city">{{ item.city }} · {{ item.weather }} · {{ item.temp }}°C</div>
              <div class="status">{{ item.status }}</div>
            </div>
            <button
              class="favorite-btn"
              :class="{ active: favoriteCities.includes(item.city) }"
              @click.stop="toggleFavorite(item.city)"
            >
              {{ favoriteCities.includes(item.city) ? '★' : '☆' }}
            </button>
          </div>
        </template>

        <!-- 검색어와 일치하는 데이터가 있을 때 -->
        <template v-else-if="filteredWeatherList.length > 0">
          <div
            v-for="item in filteredWeatherList"
            :key="item.city"
            class="weather-card"
            @click="selectCity(item.city)"
          >
            <span class="icon">{{ item.icon }}</span>
            <div class="info">
              <div class="city">{{ item.city }} · {{ item.weather }} · {{ item.temp }}°C</div>
              <div class="status">{{ item.status }}</div>
            </div>
            <button
              class="favorite-btn"
              :class="{ active: favoriteCities.includes(item.city) }"
              @click.stop="toggleFavorite(item.city)"
            >
              {{ favoriteCities.includes(item.city) ? '★' : '☆' }}
            </button>
          </div>
        </template>

        <!-- 검색어와 일치하는 데이터가 없을 때 -->
        <template v-else>
          <p>일치하는 도시가 없습니다.</p>
        </template>
      </div>

      <!-- 선택된 도시 상태바 -->
      <p v-if="selectedCityInfo" class="status-bar">{{ selectedCityInfo }}</p>
    </div>

    <!-- 오른쪽: 즐겨찾기 보관함 -->
    <div class="favorite-sidebar">
      <h3>⭐ 즐겨찾기</h3>

      <!-- 요약 정보: 전체 도시 평균 기온 -->
      <div class="summary-box">
        <div class="summary-label">전체 도시 평균 기온</div>
        <div class="summary-value">{{ averageTemp }}°C</div>
      </div>

      <div v-if="favoriteWeatherList.length > 0" class="favorite-list">
        <div class="weather-card" v-for="item in favoriteWeatherList" :key="'fav-' + item.city">
          <span class="icon">{{ item.icon }}</span>
          <div class="info">
            <div class="city">{{ item.city }} · {{ item.weather }} · {{ item.temp }}°C</div>
            <div class="status">{{ item.status }}</div>
          </div>
        </div>
      </div>
      <div v-else class="empty-favorite">
        <div class="empty-icon">☆</div>
        <p>별을 눌러 도시를 즐겨찾기에 추가해보세요.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 1. 검색어 (사용자가 입력하는 도시 이름 또는 날씨)
const searchQuery = ref('')

// 2. 선택된 도시의 상태바 문구
const selectedCityInfo = ref('')

// 3. 지역별 날씨 데이터 배열
const weatherList = ref([
  { city: '수원', weather: '비', temp: 24, status: '선선함', icon: '☔' },
  { city: '부산', weather: '맑음', temp: 28, status: '더움', icon: '☀️' },
  { city: '서울', weather: '흐림', temp: 22, status: '선선함', icon: '☁️' },
  { city: '제주', weather: '맑음', temp: 26, status: '따뜻함', icon: '🌤️' },
  { city: '강릉', weather: '비', temp: 20, status: '선선함', icon: '🌧️' },
])

// 온도 정렬 기준 ('none' | 'asc' | 'desc')
const sortOrder = ref('none')

// 정렬 기준에 따라 배열을 재정렬해주는 함수
function sortByTemp(list) {
  if (sortOrder.value === 'asc') {
    return [...list].sort((a, b) => a.temp - b.temp)
  }
  if (sortOrder.value === 'desc') {
    return [...list].sort((a, b) => b.temp - a.temp)
  }
  return list
}

// 4. 검색어에 맞는 도시만 필터링 + 정렬까지 적용한 결과
const filteredWeatherList = computed(() => {
  const filtered = weatherList.value.filter(
    (item) => item.city.includes(searchQuery.value) || item.weather.includes(searchQuery.value),
  )
  return sortByTemp(filtered)
})

// 검색어가 없을 때 쓰는 전체 목록 + 정렬 적용 버전
const sortedWeatherList = computed(() => sortByTemp(weatherList.value))

// 전체 도시의 평균 기온 (소수점 첫째 자리까지)
const averageTemp = computed(() => {
  const total = weatherList.value.reduce((sum, item) => sum + item.temp, 0)
  return (total / weatherList.value.length).toFixed(1)
})

// 5. selectedCityInfo 감시 (watch)
watch(selectedCityInfo, (newValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}"`)
})

// 6. searchQuery 감시 (watchEffect)
watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다`,
  )
})

// 검색 버튼 클릭 시 실행 (검색은 이미 실시간으로 이루어지므로, 콘솔 로그로 클릭 확인용)
function handleSearchClick() {
  console.log(`[검색 버튼 클릭] 현재 검색어: '${searchQuery.value}'`)
}

// 도시 카드를 클릭했을 때 실행되는 함수
function selectCity(cityName) {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

// 즐겨찾기한 도시 목록
const favoriteCities = ref([])

// 즐겨찾기한 도시의 날씨 데이터만 필터링
const favoriteWeatherList = computed(() => {
  return weatherList.value.filter((item) => favoriteCities.value.includes(item.city))
})

// 즐겨찾기 변화 감시
watch(
  favoriteCities,
  (newValue) => {
    console.log(`[watch 감지] 즐겨찾기 목록이 변경되었습니다 -> [${newValue.join(', ')}]`)
  },
  { deep: true },
)

// 즐겨찾기 토글 함수 (있으면 빼고, 없으면 추가)
function toggleFavorite(cityName) {
  const index = favoriteCities.value.indexOf(cityName)
  if (index === -1) {
    favoriteCities.value.push(cityName)
  } else {
    favoriteCities.value.splice(index, 1)
  }
}
</script>

<style scoped>
.page-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 40px;
  width: 92%;
  margin: 50px auto;
  font-family: sans-serif;
}
.weather-composition {
  flex: 1;
  min-width: 480px;
}
h2 {
  font-size: 34px;
  margin-bottom: 28px;
  font-weight: 700;
}
.search-row {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}
input {
  flex: 1;
  padding: 24px 28px;
  font-size: 21px;
  border: 2px solid #ddd;
  border-radius: 16px;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
input:focus {
  outline: none;
  border-color: #2563eb;
}
.search-btn {
  padding: 0 40px;
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  background-color: #2563eb;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s;
}
.search-btn:hover {
  background-color: #1d4fd6;
}
.sort-toggle {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}
.sort-toggle button {
  padding: 14px 24px;
  font-size: 17px;
  border: 1px solid #ccc;
  border-radius: 26px;
  background-color: #fff;
  cursor: pointer;
  color: #666;
  transition: all 0.15s;
}
.sort-toggle button.active {
  background-color: #2563eb;
  border-color: #2563eb;
  color: #fff;
}
.weather-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.weather-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  font-size: 19px;
  background-color: #f9fafb;
  cursor: pointer;
  transition: all 0.15s;
}
.weather-card:hover {
  background-color: #f0f2f5;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.07);
}
.weather-card .icon {
  font-size: 48px;
}
.weather-card .info {
  flex: 1;
}
.weather-card .city {
  font-weight: bold;
  font-size: 22px;
}
.weather-card .status {
  font-size: 16px;
  color: #666;
  margin-top: 8px;
}
p {
  font-size: 17px;
  color: #888;
}
.status-bar {
  margin-top: 28px;
  padding: 22px;
  background-color: #e6f4ea;
  color: #1a7f37;
  border-radius: 14px;
  text-align: center;
  font-weight: bold;
  font-size: 19px;
}
.favorite-btn {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #ccc;
}
.favorite-btn.active {
  color: #f5b400;
}

/* 오른쪽 즐겨찾기 사이드바 */
.favorite-sidebar {
  width: 420px;
  flex-shrink: 0;
  position: sticky;
  top: 50px;
  padding: 32px;
  border: 1px solid #eee;
  border-radius: 20px;
  background-color: #fffdf5;
  box-sizing: border-box;
}
.favorite-sidebar h3 {
  font-size: 24px;
  margin-bottom: 24px;
}
.summary-box {
  background-color: #fff;
  border: 1px solid #f0e6c8;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
}
.summary-label {
  font-size: 15px;
  color: #999;
  margin-bottom: 8px;
}
.summary-value {
  font-size: 36px;
  font-weight: 700;
  color: #f5b400;
}
.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.favorite-list .weather-card {
  cursor: default;
  padding: 22px;
}
.favorite-list .weather-card:hover {
  transform: none;
  box-shadow: none;
}
.empty-favorite {
  text-align: center;
  padding: 40px 0;
}
.empty-icon {
  font-size: 48px;
  color: #ddd;
  margin-bottom: 12px;
}
.empty-favorite p {
  font-size: 15px;
  color: #aaa;
}
</style>
