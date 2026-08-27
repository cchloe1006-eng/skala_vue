<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/*
 * 메인과 상세 페이지가 함께 사용하는 도시 목록입니다.
 */
import { cityQueryMap } from '../data/cityData'

/*
 * OpenWeatherMap의 현재 날씨와
 * 최대 5일 예보 요청 함수입니다.
 */
import { fetchCurrentWeather, fetchFiveDayForecast } from '../services/weatherApi'

/* 섭씨·화씨 전역 상태 Store */
import { useConfigStore } from '../stores/configStore'

/* 현재 URL의 cityId를 확인합니다. */
const route = useRoute()

/* 코드로 다른 페이지에 이동합니다. */
const router = useRouter()

/* 모든 화면이 함께 사용하는 온도 단위 Store */
const configStore = useConfigStore()

/* 현재 도시의 상세 날씨 */
const selectedWeather = ref(null)

/* 최대 5일 예보 목록 */
const forecastItems = ref([])

/* 비동기 API 요청 상태 */
const isLoading = ref(false)
const errorMessage = ref('')

/*
 * OpenWeatherMap 날씨 코드에 맞는 이모지를 반환합니다.
 */
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

/* API 시간을 한국어 날짜로 변경합니다. */
function formatForecastDate(timestamp) {
  const date = new Date(timestamp * 1000)

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).format(date)
}

/*
 * 3시간 간격 예보에서 날짜별 첫 데이터를 골라
 * 최대 5일 예보를 만듭니다.
 */
function createDailyForecast(forecastList) {
  const dailyForecastMap = new Map()

  forecastList.forEach((item) => {
    const dateKey = item.dt_txt.slice(0, 10)

    if (!dailyForecastMap.has(dateKey)) {
      dailyForecastMap.set(dateKey, item)
    }
  })

  return Array.from(dailyForecastMap.values())
    .slice(0, 5)
    .map((item) => {
      return {
        id: item.dt,
        date: formatForecastDate(item.dt),
        temp: Math.round(item.main.temp),
        weather: item.weather[0].description,
        rainProbability: Math.round(item.pop * 100),
        icon: getWeatherIcon(item.weather[0].id),
      }
    })
}

/* 섭씨 온도를 현재 단위에 맞게 변환합니다. */
function convertTemp(rawTemp) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
}

/* 현재 날씨의 화면 표시 온도 */
const displayTemp = computed(() => {
  if (!selectedWeather.value) {
    return ''
  }

  return convertTemp(selectedWeather.value.temp)
})

/*
 * 현재 날씨와 최대 5일 예보를 비동기로 가져옵니다.
 */
async function loadWeatherDetail() {
  const cityId = String(route.params.cityId)

  /*
   * cityData.js에서 현재 URL의 도시를 찾습니다.
   */
  const cityConfig = cityQueryMap[cityId]

  /*
   * 등록되지 않은 도시라면 Not Found로 이동합니다.
   */
  if (!cityConfig) {
    router.replace({ name: 'not-found' })
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    /*
     * 현재 날씨와 예보 GET 요청을 동시에 실행합니다.
     */
    const [currentData, forecastData] = await Promise.all([
      fetchCurrentWeather(cityConfig.query),
      fetchFiveDayForecast(cityConfig.query),
    ])

    const firstForecast = forecastData.list[0]

    /*
     * 현재 날씨 API 응답을 화면용 객체로 변경합니다.
     */
    selectedWeather.value = {
      id: cityId,
      city: cityConfig.city,
      weather: currentData.weather[0].description,
      temp: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity,
      rainProbability: Math.round(firstForecast.pop * 100),
      windSpeed: currentData.wind.speed,
      icon: getWeatherIcon(currentData.weather[0].id),
    }

    /*
     * 3시간 간격 예보를 최대 5일 예보로 변경합니다.
     */
    forecastItems.value = createDailyForecast(forecastData.list)

    console.log('[Axios 성공] 현재 날씨와 최대 5일 예보를 불러왔습니다.')
  } catch (error) {
    console.error('[상세 날씨 Axios 오류]', error)

    if (error.response?.status === 401) {
      errorMessage.value = 'API 키가 아직 활성화되지 않았거나 올바르지 않습니다.'
    } else {
      errorMessage.value = '상세 날씨 정보를 불러오지 못했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

/*
 * 상세 페이지가 화면에 나타나면 API를 요청합니다.
 */
onMounted(() => {
  loadWeatherDetail()
})
</script>

<template>
  <main class="detail-view">
    <!--
      API 요청 중에는 Element Plus Skeleton을 표시합니다.
      비동기 요청 중에도 화면이 멈추지 않았다는 것을 보여줍니다.
    -->
    <el-card v-if="isLoading" class="detail-card" shadow="never">
      <el-skeleton :rows="8" animated />
    </el-card>

    <!-- API 요청 실패 -->
    <el-card v-else-if="errorMessage" class="detail-card" shadow="never">
      <el-result icon="error" title="날씨 정보를 불러오지 못했습니다." :sub-title="errorMessage">
        <template #extra>
          <div class="result-actions">
            <el-button type="primary" @click="loadWeatherDetail"> 다시 시도 </el-button>

            <el-button
              @click="
                router.push({
                  name: 'weather-home',
                })
              "
            >
              메인 대시보드
            </el-button>
          </div>
        </template>
      </el-result>
    </el-card>

    <!-- API 요청 성공 -->
    <el-card v-else-if="selectedWeather" class="detail-card" shadow="never">
      <!-- Element Plus Card의 Header Slot -->
      <template #header>
        <div class="detail-header">
          <h1>🌎 지역별 상세 기상 관측 정보</h1>

          <el-tag type="primary" size="large" round>
            {{ configStore.unitName }}
            {{ configStore.unitSymbol }}
          </el-tag>
        </div>
      </template>

      <!-- 현재 도시와 날씨 -->
      <div class="weather-title">
        <span class="weather-icon">
          {{ selectedWeather.icon }}
        </span>

        <div>
          <h2>{{ selectedWeather.city }}</h2>

          <el-tag type="info" effect="plain" round>
            {{ selectedWeather.weather }}
          </el-tag>
        </div>
      </div>

      <!--
        Element Plus Descriptions를 사용해
        현재 날씨 정보를 표 형태로 표시합니다.
      -->
      <el-descriptions title="현재 관측 정보" :column="2" border size="large">
        <el-descriptions-item label="현재 기온">
          <strong class="description-value"> {{ displayTemp }}{{ configStore.unitSymbol }} </strong>
        </el-descriptions-item>

        <el-descriptions-item label="습도">
          <strong class="description-value"> {{ selectedWeather.humidity }}% </strong>
        </el-descriptions-item>

        <el-descriptions-item label="강수 확률">
          <strong class="description-value"> {{ selectedWeather.rainProbability }}% </strong>
        </el-descriptions-item>

        <el-descriptions-item label="풍속">
          <strong class="description-value"> {{ selectedWeather.windSpeed }}m/s </strong>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 추가 OpenWeatherMap 예보 API 결과 -->
      <section class="forecast-section">
        <div class="section-title">
          <h2>📅 최대 5일 날씨 예보</h2>

          <el-tag type="success" effect="plain"> OpenWeatherMap 실시간 연동 </el-tag>
        </div>

        <div class="forecast-grid">
          <!-- 각 예보를 Element Plus Card로 표시합니다. -->
          <el-card
            v-for="item in forecastItems"
            :key="item.id"
            class="forecast-card"
            shadow="hover"
          >
            <h3>{{ item.date }}</h3>

            <span class="forecast-icon">
              {{ item.icon }}
            </span>

            <strong class="forecast-temp">
              {{ convertTemp(item.temp) }}{{ configStore.unitSymbol }}
            </strong>

            <p>{{ item.weather }}</p>

            <el-tag type="success" size="small" effect="plain" round>
              강수 확률 {{ item.rainProbability }}%
            </el-tag>
          </el-card>
        </div>
      </section>

      <!-- Element Plus 돌아가기 버튼 -->
      <el-button
        class="back-button"
        type="primary"
        size="large"
        @click="
          router.push({
            name: 'weather-home',
          })
        "
      >
        ← 메인 대시보드로 돌아가기
      </el-button>
    </el-card>
  </main>
</template>

<style scoped>
.detail-view {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 60px 24px;
  box-sizing: border-box;
}

.detail-card {
  width: 100%;
  max-width: 1050px;
  border-radius: 22px;
}

/* Element Plus Card 내부 여백 */
:deep(.detail-card > .el-card__body) {
  padding: 36px;
}

/* 상세 페이지 제목과 단위 Tag */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.detail-header h1 {
  margin: 0;
  color: #1e293b;
}

/* 현재 도시 영역 */
.weather-title {
  display: flex;
  align-items: center;
  gap: 22px;
  margin: 10px 0 34px;
}

.weather-icon {
  font-size: 66px;
}

.weather-title h2 {
  margin: 0 0 10px;
  color: #1e293b;
  font-size: 30px;
}

.description-value {
  color: #1e293b;
  font-size: 18px;
}

/* 최대 5일 예보 */
.forecast-section {
  margin-top: 42px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}

.section-title h2 {
  margin: 0;
  color: #1e293b;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px;
}

.forecast-card {
  border-radius: 16px;
  text-align: center;
}

:deep(.forecast-card .el-card__body) {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 9px;
  padding: 20px 12px;
}

.forecast-card h3 {
  margin: 0;
  color: #475569;
  font-size: 15px;
}

.forecast-icon {
  font-size: 36px;
}

.forecast-temp {
  color: #1e293b;
  font-size: 21px;
}

.forecast-card p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.back-button {
  margin-top: 34px;
}

.result-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 650px) {
  .detail-view {
    padding: 24px 16px;
  }

  :deep(.detail-card > .el-card__body) {
    padding: 22px;
  }

  .detail-header,
  .section-title {
    align-items: flex-start;
    flex-direction: column;
  }

  :deep(.el-descriptions__body) {
    overflow-x: auto;
  }
}
</style>
