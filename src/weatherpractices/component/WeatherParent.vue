<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// [Router 과제 추가]
// 코드에서 페이지를 이동하기 위해 useRouter를 가져옵니다.
import { useRouter } from 'vue-router'

import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import FavoriteSidebar from './FavoriteSidebar.vue'

/*
 * useRouter()가 반환하는 Router 객체를 저장합니다.
 *
 * 이후 router.push()를 사용해서
 * 상세 날씨 페이지로 이동할 수 있습니다.
 */
const router = useRouter()

/* =====================================================
   1. 부모가 관리하는 반응형 상태
   ===================================================== */

// 검색어
const searchQuery = ref('')

// 사용자가 마지막으로 선택한 도시 안내 문구
const selectedCityInfo = ref('')

/*
 * 전체 날씨 데이터
 *
 * [Router 과제 추가]
 * 상세 페이지 주소에서 사용할 고유한 id를 추가했습니다.
 *
 * 부산 상세 페이지 예시:
 * /weather/busan
 */
const weatherList = ref([
  {
    id: 'suwon',
    city: '수원',
    weather: '비',
    temp: 24,
    status: '선선함',
    icon: '☔',
  },
  {
    id: 'busan',
    city: '부산',
    weather: '맑음',
    temp: 28,
    status: '더움',
    icon: '☀️',
  },
  {
    id: 'seoul',
    city: '서울',
    weather: '흐림',
    temp: 22,
    status: '선선함',
    icon: '☁️',
  },
  {
    id: 'jeju',
    city: '제주',
    weather: '맑음',
    temp: 26,
    status: '따뜻함',
    icon: '🌤️',
  },
  {
    id: 'gangneung',
    city: '강릉',
    weather: '비',
    temp: 20,
    status: '선선함',
    icon: '🌧️',
  },
])

/*
 * 온도 정렬 상태
 *
 * none: 기존 순서
 * asc: 온도가 낮은 순서
 * desc: 온도가 높은 순서
 */
const sortOrder = ref('none')

// 즐겨찾기로 선택한 도시 이름을 저장하는 배열
const favoriteCities = ref([])

/* =====================================================
   2. 온도 정렬 함수
   ===================================================== */

function sortByTemp(list) {
  if (sortOrder.value === 'asc') {
    return [...list].sort((first, second) => first.temp - second.temp)
  }

  if (sortOrder.value === 'desc') {
    return [...list].sort((first, second) => second.temp - first.temp)
  }

  return list
}

/* =====================================================
   3. computed: 상태를 이용해 새로운 값 계산
   ===================================================== */

/*
 * 검색 결과 목록
 *
 * 도시 이름 또는 날씨 상태와 일치하는 데이터만 남기고,
 * 현재 온도 정렬 기준까지 적용합니다.
 */
const filteredWeatherList = computed(() => {
  const filtered = weatherList.value.filter((item) => {
    const cityMatched = item.city.includes(searchQuery.value)
    const weatherMatched = item.weather.includes(searchQuery.value)

    return cityMatched || weatherMatched
  })

  return sortByTemp(filtered)
})

// 검색어가 없을 때 사용하는 전체 정렬 목록
const sortedWeatherList = computed(() => {
  return sortByTemp(weatherList.value)
})

/*
 * 실제 화면에 출력할 날씨 목록
 *
 * 검색어가 비어 있으면 전체 목록을 사용하고,
 * 검색어가 있으면 필터링된 목록을 사용합니다.
 */
const displayedWeatherList = computed(() => {
  if (searchQuery.value === '') {
    return sortedWeatherList.value
  }

  return filteredWeatherList.value
})

// 모든 도시의 평균 기온
const averageTemp = computed(() => {
  const total = weatherList.value.reduce((sum, item) => sum + item.temp, 0)

  return (total / weatherList.value.length).toFixed(1)
})

// 즐겨찾기로 선택된 도시 객체 목록
const favoriteWeatherList = computed(() => {
  return weatherList.value.filter((item) => {
    return favoriteCities.value.includes(item.city)
  })
})

/* =====================================================
   4. watch와 watchEffect
   ===================================================== */

// 선택된 도시 상태바 감시
watch(selectedCityInfo, (newValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}"`)
})

// 검색어 자동 감시
watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다.`,
  )
})

// 즐겨찾기 배열 감시
watch(
  favoriteCities,
  (newValue) => {
    console.log(`[watch 감지] 즐겨찾기 목록이 변경되었습니다 -> [${newValue.join(', ')}]`)
  },
  {
    deep: true,
  },
)

/* =====================================================
   5. 자식 컴포넌트의 Emits를 처리하는 부모 함수
   ===================================================== */

// 검색 버튼 클릭
function handleSearchClick() {
  console.log(`[검색 버튼 클릭] 현재 검색어: '${searchQuery.value}'`)
}

// 날씨 카드 선택
function selectCity(cityName) {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

/*
 * [Router 과제 핵심]
 * WeatherCard의 click-detail 이벤트를 처리합니다.
 *
 * 기존 코드:
 * window.alert(...)
 *
 * 변경 코드:
 * 1. 자식이 전달한 도시 이름으로 도시 객체를 찾습니다.
 * 2. 도시 객체에서 id를 가져옵니다.
 * 3. router.push()로 상세 페이지에 이동합니다.
 */
function showDetail(cityName) {
  const selectedCity = weatherList.value.find((item) => {
    return item.city === cityName
  })

  /*
   * 도시 데이터를 찾지 못했다면
   * Not Found 페이지로 이동합니다.
   */
  if (!selectedCity) {
    router.push({ name: 'not-found' })
    return
  }

  /*
   * 이름이 weather-detail인 Route로 이동합니다.
   *
   * 부산을 클릭했다면:
   * cityId = 'busan'
   * 결과 URL = /weather/busan
   */
  router.push({
    name: 'weather-detail',
    params: {
      cityId: selectedCity.id,
    },
  })
}

// 즐겨찾기 추가 및 제거
function toggleFavorite(cityName) {
  const index = favoriteCities.value.indexOf(cityName)

  if (index === -1) {
    favoriteCities.value.push(cityName)
  } else {
    favoriteCities.value.splice(index, 1)
  }
}
</script>

<template>
  <!-- 전체 페이지: 왼쪽 날씨 영역 + 오른쪽 즐겨찾기 -->
  <div class="page-layout">
    <!-- 왼쪽 영역 -->
    <main class="weather-composition">
      <h2>오늘의 날씨</h2>

      <!-- SearchBar를 Default Slot에 주입 -->
      <BaseDashboardCard>
        <SearchBar
          :current-query="searchQuery"
          @update-query="searchQuery = $event"
          @search="handleSearchClick"
        />
      </BaseDashboardCard>

      <!-- 온도 정렬 버튼 -->
      <div class="sort-toggle">
        <button type="button" :class="{ active: sortOrder === 'none' }" @click="sortOrder = 'none'">
          기본순
        </button>

        <button type="button" :class="{ active: sortOrder === 'asc' }" @click="sortOrder = 'asc'">
          온도 낮은순
        </button>

        <button type="button" :class="{ active: sortOrder === 'desc' }" @click="sortOrder = 'desc'">
          온도 높은순
        </button>
      </div>

      <!-- WeatherCard 목록을 Default Slot에 주입 -->
      <BaseDashboardCard>
        <h3 class="list-title">🏙️ 지역별 날씨 현황</h3>

        <div class="weather-list">
          <WeatherCard
            v-for="item in displayedWeatherList"
            :key="item.id"
            :city-item="item"
            :is-favorite="favoriteCities.includes(item.city)"
            @select-card="selectCity"
            @click-detail="showDetail"
            @toggle-favorite="toggleFavorite"
          />

          <!-- 검색 결과가 없을 때 -->
          <p v-if="searchQuery !== '' && displayedWeatherList.length === 0" class="empty-result">
            일치하는 도시가 없습니다.
          </p>
        </div>
      </BaseDashboardCard>

      <!-- WeatherCard 선택 결과 -->
      <p v-if="selectedCityInfo" class="status-bar">
        {{ selectedCityInfo }}
      </p>
    </main>

    <!-- 추가 즐겨찾기 컴포넌트 -->
    <FavoriteSidebar :average-temp="averageTemp" :favorite-items="favoriteWeatherList" />
  </div>
</template>

<style scoped>
/*
 * WeatherParent는 전체 페이지 배치만 담당합니다.
 *
 * 검색창 디자인은 SearchBar.vue,
 * 공통 카드 디자인은 BaseDashboardCard.vue,
 * 날씨 카드 디자인은 WeatherCard.vue,
 * 즐겨찾기 디자인은 FavoriteSidebar.vue에 있습니다.
 */

/* 왼쪽 날씨 영역과 오른쪽 즐겨찾기를 가로 배치 */
.page-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 40px;
  width: 92%;
  margin: 50px auto;
  font-family: sans-serif;
}

/* 왼쪽 날씨 영역 */
.weather-composition {
  flex: 1;
  min-width: 480px;
}

h2 {
  margin-bottom: 28px;
  font-size: 34px;
  font-weight: 700;
}

/* 지역별 날씨 현황 제목 */
.list-title {
  margin: 0 0 20px;
}

/* 온도 정렬 버튼 그룹 */
.sort-toggle {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.sort-toggle button {
  padding: 14px 24px;
  border: 1px solid #cccccc;
  border-radius: 26px;
  color: #666666;
  background-color: #ffffff;
  cursor: pointer;
  font-size: 17px;
  transition: all 0.15s;
}

.sort-toggle button.active {
  border-color: #2563eb;
  color: #ffffff;
  background-color: #2563eb;
}

/* WeatherCard 컴포넌트들을 그리드로 배치 */
.weather-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* 검색 결과가 없을 때 */
.empty-result {
  grid-column: 1 / -1;
  margin: 0;
  padding: 30px;
  color: #888888;
  text-align: center;
}

/* 선택한 도시 안내 상태바 */
.status-bar {
  margin-top: 28px;
  padding: 22px;
  border-radius: 14px;
  color: #1a7f37;
  background-color: #e6f4ea;
  font-size: 19px;
  font-weight: bold;
  text-align: center;
}

/* 좁은 화면에서는 왼쪽과 오른쪽을 세로로 배치 */
@media (max-width: 900px) {
  .page-layout {
    width: calc(100% - 32px);
    margin: 24px auto;
  }

  .weather-composition {
    min-width: 0;
    width: 100%;
  }
}
</style>
