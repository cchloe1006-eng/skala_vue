<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
/*
 * 여러 화면에서 함께 사용하는 전국 주요 도시 목록입니다.
 */
import { cityRequests } from '../data/cityData'

import BaseDashboardCard from '../weatherpractices/component/BaseDashboardCard.vue'
import FavoriteSidebar from '../weatherpractices/component/FavoriteSidebar.vue'
import { getTemperatureLevel } from '../utils/temperature'
import SearchBar from '../weatherpractices/component/SearchBar.vue'
import WeatherCard from '../weatherpractices/component/WeatherCard.vue'

/*
 * OpenWeatherMap의 현재 날씨를 요청하는 함수입니다.
 */
import { fetchCurrentWeather } from '../services/weatherApi'

const router = useRouter()

/* =====================================================
   1. 반응형 상태
   ===================================================== */

/* 검색창에 입력한 검색어 */
const searchQuery = ref('')

/* 마지막으로 선택한 도시를 보여주는 문구 */
const selectedCityInfo = ref('')

/*
 * 온도 정렬 상태
 *
 * none: 기본순
 * asc: 온도 낮은순
 * desc: 온도 높은순
 */
const sortOrder = ref('none')

/* 즐겨찾기로 선택한 도시 이름 배열 */
const favoriteCities = ref([])

/* API 요청 진행 여부 */
const isWeatherLoading = ref(false)

/* API 요청 실패 시 화면에 보여줄 문구 */
const weatherErrorMessage = ref('')

/*
 * 기존 Mock Data입니다.
 *
 * API가 성공하면 실제 데이터로 교체됩니다.
 * API 요청이 실패하면 이 데이터가 유지됩니다.
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

/* =====================================================
   2. API 데이터 변환 함수
   ===================================================== */

/* 날씨 코드에 맞는 이모지를 반환합니다. */
function getWeatherIcon(weatherCode) {
  if (weatherCode >= 200 && weatherCode < 300) {
    return '⛈️'
  }

  if (weatherCode >= 300 && weatherCode < 600) {
    return '🌧️'
  }

  if (weatherCode >= 600 && weatherCode < 700) {
    return '❄️'
  }

  if (weatherCode >= 700 && weatherCode < 800) {
    return '🌫️'
  }

  if (weatherCode === 800) {
    return '☀️'
  }

  if (weatherCode > 800) {
    return '☁️'
  }

  return '🌤️'
}

/* 섭씨 기온에 맞는 상태 문구를 반환합니다. */
function getTemperatureStatus(temp) {
  return getTemperatureLevel(temp).label
}

/*
 * OpenWeatherMap에서 도시별 현재 날씨를 가져옵니다.
 */
async function loadWeatherData() {
  isWeatherLoading.value = true
  weatherErrorMessage.value = ''

  try {
    /*
     * Promise.all을 사용해 여러 도시의 날씨를
     * 동시에 요청합니다.
     */
    const apiWeatherList = await Promise.all(
      cityRequests.map(async (cityRequest) => {
        const apiData = await fetchCurrentWeather(cityRequest.query)

        const rawTemp = apiData.main.temp
        const weatherCode = apiData.weather[0].id

        return {
          id: cityRequest.id,
          city: cityRequest.city,
          weather: apiData.weather[0].description,
          temp: Math.round(rawTemp),
          status: getTemperatureStatus(rawTemp),
          icon: getWeatherIcon(weatherCode),
        }
      }),
    )

    weatherList.value = apiWeatherList

    console.log('[Axios 성공] OpenWeatherMap 날씨 데이터를 불러왔습니다.')
  } catch (error) {
    console.error('[Axios 오류]', error)

    if (error.response?.status === 401) {
      weatherErrorMessage.value = 'API 키가 아직 활성화되지 않았거나 올바르지 않습니다.'
    } else if (error.response?.status === 404) {
      weatherErrorMessage.value = 'OpenWeatherMap에서 도시 정보를 찾지 못했습니다.'
    } else {
      weatherErrorMessage.value = '실시간 날씨를 불러오지 못해 임시 데이터를 표시합니다.'
    }
  } finally {
    isWeatherLoading.value = false
  }
}

/* =====================================================
   3. 온도 정렬
   ===================================================== */

/*
 * Element Plus의 정렬 버튼이 sortOrder를 변경하면
 * 이 함수가 기존과 동일하게 날씨 목록을 정렬합니다.
 */
function sortByTemp(list) {
  if (sortOrder.value === 'asc') {
    return [...list].sort((first, second) => {
      return first.temp - second.temp
    })
  }

  if (sortOrder.value === 'desc') {
    return [...list].sort((first, second) => {
      return second.temp - first.temp
    })
  }

  return list
}

/* =====================================================
   4. computed
   ===================================================== */

/* 도시 이름 또는 날씨 상태로 검색합니다. */
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (query === '') {
    return sortByTemp(weatherList.value)
  }

  const filtered = weatherList.value.filter((item) => {
    const cityMatched = item.city.includes(query)
    const weatherMatched = item.weather.includes(query)

    return cityMatched || weatherMatched
  })

  return sortByTemp(filtered)
})

/* 실제 화면에 출력할 날씨 목록 */
const displayedWeatherList = computed(() => {
  return filteredWeatherList.value
})

/* 전체 도시의 평균 섭씨 기온 */
const averageTemp = computed(() => {
  const total = weatherList.value.reduce((sum, item) => {
    return sum + item.temp
  }, 0)

  return (total / weatherList.value.length).toFixed(1)
})

/* 즐겨찾기로 선택한 도시 객체 목록 */
const favoriteWeatherList = computed(() => {
  return weatherList.value.filter((item) => {
    return favoriteCities.value.includes(item.city)
  })
})

/* =====================================================
   5. watch와 watchEffect
   ===================================================== */

watch(selectedCityInfo, (newValue) => {
  console.log(`[watch 감지] 상태 바 문구가 변경되었습니다: ${newValue}`)
})

watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어: ${searchQuery.value}`)
})

watch(
  favoriteCities,
  (newValue) => {
    console.log(`[watch 감지] 즐겨찾기 목록: ${newValue.join(', ')}`)
  },
  {
    deep: true,
  },
)

/* =====================================================
   6. 자식 컴포넌트의 Emits 처리
   ===================================================== */

function handleSearchClick() {
  console.log(`[검색 버튼 클릭] 현재 검색어: ${searchQuery.value}`)
}

function selectCity(cityName) {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

function showDetail(cityName) {
  const selectedCity = weatherList.value.find((item) => {
    return item.city === cityName
  })

  if (!selectedCity) {
    router.push({ name: 'not-found' })
    return
  }

  router.push({
    name: 'weather-detail',
    params: {
      cityId: selectedCity.id,
    },
  })
}

function toggleFavorite(cityName) {
  const index = favoriteCities.value.indexOf(cityName)

  if (index === -1) {
    favoriteCities.value.push(cityName)
  } else {
    favoriteCities.value.splice(index, 1)
  }
}

/* =====================================================
   7. Lifecycle
   ===================================================== */

onMounted(() => {
  loadWeatherData()
})
</script>

<template>
  <div class="page-layout">
    <main class="weather-composition">
      <h2>오늘의 날씨</h2>

      <!-- API 요청 중 -->
      <p v-if="isWeatherLoading" class="api-message loading">⏳ 실시간 날씨를 불러오고 있습니다.</p>

      <!-- API 요청 실패 -->
      <div v-if="weatherErrorMessage" class="api-message error">
        <span>⚠️ {{ weatherErrorMessage }}</span>

        <button type="button" @click="loadWeatherData">다시 시도</button>
      </div>

      <!-- 검색 영역 -->
      <BaseDashboardCard>
        <SearchBar
          :current-query="searchQuery"
          @update-query="searchQuery = $event"
          @search="handleSearchClick"
        />
      </BaseDashboardCard>

      <!--
        Element Plus의 Radio Button Group입니다.

        v-model로 기존 sortOrder와 연결했기 때문에
        정렬 기능은 기존과 동일하게 작동합니다.
      -->
      <div class="sort-toggle">
        <el-radio-group v-model="sortOrder" size="large">
          <el-radio-button value="none"> 기본순 </el-radio-button>

          <el-radio-button value="asc"> 온도 낮은순 </el-radio-button>

          <el-radio-button value="desc"> 온도 높은순 </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 지역별 날씨 목록 -->
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

          <p
            v-if="searchQuery.trim() !== '' && displayedWeatherList.length === 0"
            class="empty-result"
          >
            일치하는 도시가 없습니다.
          </p>
        </div>
      </BaseDashboardCard>

      <!-- 마지막으로 선택한 도시 -->
      <p v-if="selectedCityInfo" class="status-bar">
        {{ selectedCityInfo }}
      </p>
    </main>

    <!-- 즐겨찾기 컴포넌트 -->
    <FavoriteSidebar :average-temp="averageTemp" :favorite-items="favoriteWeatherList" />
  </div>
</template>

<style scoped>
/* 왼쪽 날씨 영역과 오른쪽 즐겨찾기 영역 */
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

/* API 로딩 및 오류 안내 */
.api-message {
  margin: 0 0 22px;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 16px;
}

.api-message.loading {
  color: #1d4ed8;
  background-color: #eff6ff;
}

.api-message.error {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  color: #b45309;
  background-color: #fff7ed;
}

.api-message.error button {
  padding: 9px 14px;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  color: #92400e;
  background-color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
}

/* 지역별 날씨 제목 */
.list-title {
  margin: 0 0 20px;
}

/*
 * Element Plus 정렬 버튼 영역입니다.
 *
 * 버튼 내부 디자인은 Element Plus가 담당하므로
 * 기존 button 스타일은 제거했습니다.
 */
.sort-toggle {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

/* WeatherCard들을 그리드로 배치 */
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

/* 좁은 화면에서는 세로로 배치 */
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

@media (max-width: 600px) {
  .api-message.error {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
