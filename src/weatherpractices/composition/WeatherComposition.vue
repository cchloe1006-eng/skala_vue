<template>
  <!-- 전체 페이지 레이아웃: 왼쪽(검색+목록) / 오른쪽(즐겨찾기) 2단 구성 -->
  <div class="page-layout">
    <!-- 왼쪽 영역: 검색 + 정렬 + 날씨 목록 -->
    <div class="weather-composition">
      <h2>오늘의 날씨</h2>

      <!-- [요구사항 1] searchQuery(ref)와 양방향 바인딩된 검색창 -->
      <!-- 도시 이름 또는 날씨 상태(맑음/비/흐림)로 검색 가능 -->
      <div class="search-row">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="도시 이름 또는 날씨(맑음/비/흐림)를 검색하세요"
        />
        <button class="search-btn" @click="handleSearchClick">검색</button>
      </div>

      <!-- [추가 기능] 온도 정렬 토글: sortOrder(ref) 값을 바꿔서 정렬 기준 전환 -->
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

      <!-- [요구사항 4] 검색 결과 표시 영역: v-if / v-else-if / v-else로 3가지 상태 분기 -->
      <div class="weather-list">
        <!-- 4-1) 검색어가 비어있을 때: 정렬만 적용된 전체 목록(sortedWeatherList) 출력 -->
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
            <!-- 즐겨찾기 버튼: @click.stop으로 카드 클릭(selectCity)과 분리 -->
            <button
              class="favorite-btn"
              :class="{ active: favoriteCities.includes(item.city) }"
              @click.stop="toggleFavorite(item.city)"
            >
              {{ favoriteCities.includes(item.city) ? '★' : '☆' }}
            </button>
          </div>
        </template>

        <!-- 4-2) 검색어와 일치하는 데이터가 있을 때: filteredWeatherList(computed) 출력 -->
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

        <!-- 4-3) 검색어와 일치하는 데이터가 없을 때: 안내 문구 출력 -->
        <template v-else>
          <p>일치하는 도시가 없습니다.</p>
        </template>
      </div>

      <!-- [요구사항 1] selectedCityInfo(ref)를 표시하는 상태바 -->
      <!-- watch()가 이 값을 감시하고 있어서, 값이 바뀔 때마다 콘솔 로그도 함께 찍힘 -->
      <p v-if="selectedCityInfo" class="status-bar">{{ selectedCityInfo }}</p>
    </div>

    <!-- 오른쪽 영역: 즐겨찾기 보관함 ([요구사항 5] 본인만의 상태/computed/watcher 구현부) -->
    <div class="favorite-sidebar">
      <h3>⭐ 즐겨찾기</h3>

      <!-- 전체 도시 평균 기온 요약 박스 (별도 computed: averageTemp) -->
      <div class="summary-box">
        <div class="summary-label">전체 도시 평균 기온</div>
        <div class="summary-value">{{ averageTemp }}°C</div>
      </div>

      <!-- favoriteWeatherList(computed)로 즐겨찾기한 도시만 필터링해서 출력 -->
      <div v-if="favoriteWeatherList.length > 0" class="favorite-list">
        <div class="weather-card" v-for="item in favoriteWeatherList" :key="'fav-' + item.city">
          <span class="icon">{{ item.icon }}</span>
          <div class="info">
            <div class="city">{{ item.city }} · {{ item.weather }} · {{ item.temp }}°C</div>
            <div class="status">{{ item.status }}</div>
          </div>
        </div>
      </div>
      <!-- 즐겨찾기가 하나도 없을 때 보여줄 안내 문구 -->
      <div v-else class="empty-favorite">
        <div class="empty-icon">☆</div>
        <p>별을 눌러 도시를 즐겨찾기에 추가해보세요.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

/* ─────────────────────────────────────────
   [요구사항 1] 반응형 상태 관리
   ref()로 감싼 변수만 Vue가 변화를 추적해서 화면을 자동으로 갱신함
───────────────────────────────────────── */

// 검색어 (사용자가 입력하는 도시 이름 또는 날씨 상태)
const searchQuery = ref('')

// 선택된 도시의 상태바 문구 (카드를 클릭하면 값이 채워짐)
const selectedCityInfo = ref('')

// 지역별 날씨 데이터 배열 (도시명 / 날씨 / 기온 / 상태 / 아이콘)
const weatherList = ref([
  { city: '수원', weather: '비', temp: 24, status: '선선함', icon: '☔' },
  { city: '부산', weather: '맑음', temp: 28, status: '더움', icon: '☀️' },
  { city: '서울', weather: '흐림', temp: 22, status: '선선함', icon: '☁️' },
  { city: '제주', weather: '맑음', temp: 26, status: '따뜻함', icon: '🌤️' },
  { city: '강릉', weather: '비', temp: 20, status: '선선함', icon: '🌧️' },
])

/* ─────────────────────────────────────────
   [추가 기능] 온도 정렬 로직
   sortOrder 값('none' | 'asc' | 'desc')에 따라 배열을 재정렬
───────────────────────────────────────── */

// 온도 정렬 기준을 담는 반응형 상태
const sortOrder = ref('none')

// 정렬 기준에 맞게 배열을 재정렬해주는 헬퍼 함수
// [...list]로 복사본을 만드는 이유: .sort()는 원본 배열을 직접 변경(mutate)하기 때문
function sortByTemp(list) {
  if (sortOrder.value === 'asc') {
    return [...list].sort((a, b) => a.temp - b.temp) // 낮은 온도 -> 높은 온도
  }
  if (sortOrder.value === 'desc') {
    return [...list].sort((a, b) => b.temp - a.temp) // 높은 온도 -> 낮은 온도
  }
  return list // 'none'이면 정렬 없이 원본 순서 그대로
}

/* ─────────────────────────────────────────
   [요구사항 2] computed() 활용
   searchQuery나 weatherList가 바뀔 때마다 자동으로 다시 계산됨 (캐싱 지원)
───────────────────────────────────────── */

// 검색어에 맞는 도시만 필터링 + 정렬까지 적용한 결과
// .includes()로 도시 이름 또는 날씨 상태 둘 중 하나라도 검색어를 포함하면 결과에 포함
const filteredWeatherList = computed(() => {
  const filtered = weatherList.value.filter(
    (item) => item.city.includes(searchQuery.value) || item.weather.includes(searchQuery.value),
  )
  return sortByTemp(filtered)
})

// 검색어가 비어있을 때(전체 목록) 사용할, 정렬만 적용된 버전
const sortedWeatherList = computed(() => sortByTemp(weatherList.value))

// [요구사항 5] 본인만의 computed - 전체 도시의 평균 기온 계산 (소수점 첫째 자리까지)
const averageTemp = computed(() => {
  const total = weatherList.value.reduce((sum, item) => sum + item.temp, 0)
  return (total / weatherList.value.length).toFixed(1)
})

/* ─────────────────────────────────────────
   [요구사항 3] watch() / watchEffect()로 반응형 변수 변화 감시
───────────────────────────────────────── */

// selectedCityInfo를 watch로 감시: 값이 바뀔 때마다(카드를 클릭할 때마다) 콘솔에 로그 출력
watch(selectedCityInfo, (newValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newValue}"`)
})

// searchQuery를 watchEffect로 감시: 대상을 따로 지정하지 않아도
// 함수 내부에서 searchQuery.value를 읽는 순간 자동으로 감시 대상으로 등록됨
// (컴포넌트가 처음 렌더링될 때도 즉시 1회 실행됨)
watchEffect(() => {
  console.log(
    `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다`,
  )
})

/* ─────────────────────────────────────────
   이벤트 핸들러 함수들
───────────────────────────────────────── */

// 검색 버튼 클릭 시 실행 (실시간 검색은 v-model로 이미 처리되므로, 여기선 클릭 확인용 로그만 남김)
function handleSearchClick() {
  console.log(`[검색 버튼 클릭] 현재 검색어: '${searchQuery.value}'`)
}

// 도시 카드를 클릭했을 때 selectedCityInfo 값을 갱신하는 함수
// 이 값이 바뀌면 위에서 등록한 watch()가 자동으로 반응해서 콘솔 로그를 남김
function selectCity(cityName) {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

/* ─────────────────────────────────────────
   [요구사항 5] 본인만의 반응형 상태 + computed + watcher: 즐겨찾기 기능
───────────────────────────────────────── */

// 즐겨찾기한 도시 이름을 담는 배열 (반응형 상태)
const favoriteCities = ref([])

// 즐겨찾기한 도시들의 날씨 데이터만 골라내는 computed
const favoriteWeatherList = computed(() => {
  return weatherList.value.filter((item) => favoriteCities.value.includes(item.city))
})

// 즐겨찾기 배열의 변화를 감시하는 watch
// favoriteCities는 배열(참조 타입)이라, 내부 값(push/splice)이 바뀌는 것까지 감지하려면
// { deep: true } 옵션이 반드시 필요함 (얕은 감시로는 배열 내부 변화가 감지되지 않음)
watch(
  favoriteCities,
  (newValue) => {
    console.log(`[watch 감지] 즐겨찾기 목록이 변경되었습니다 -> [${newValue.join(', ')}]`)
  },
  { deep: true },
)

// 즐겨찾기 토글 함수: 이미 즐겨찾기된 도시면 배열에서 제거, 아니면 추가
function toggleFavorite(cityName) {
  const index = favoriteCities.value.indexOf(cityName)
  if (index === -1) {
    favoriteCities.value.push(cityName) // 없으면 추가
  } else {
    favoriteCities.value.splice(index, 1) // 있으면 제거
  }
}
</script>

<style scoped>
/* 전체 페이지: 왼쪽(날씨 목록) + 오른쪽(즐겨찾기 사이드바) 가로 배치 */
.page-layout {
  display: flex;
  flex-wrap: wrap; /* 화면이 좁아지면 사이드바가 아래로 자연스럽게 내려감 */
  align-items: flex-start;
  gap: 40px;
  width: 92%;
  margin: 50px auto;
  font-family: sans-serif;
}
.weather-composition {
  flex: 1;
  min-width: 480px; /* 너무 좁아져서 카드가 찌그러지는 것 방지 */
}
h2 {
  font-size: 34px;
  margin-bottom: 28px;
  font-weight: 700;
}

/* 검색창 + 검색 버튼 가로 배치 */
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

/* 정렬 토글 버튼 그룹 */
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

/* 날씨 카드 그리드: 화면 폭에 맞게 카드 개수 자동 조절 */
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

/* 선택된 도시 상태바 */
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

/* 즐겨찾기 별 버튼 */
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
  position: sticky; /* 스크롤해도 항상 화면에 고정되어 보임 */
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

/* 평균 기온 요약 박스 */
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

/* 즐겨찾기 목록 */
.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.favorite-list .weather-card {
  cursor: default; /* 즐겨찾기 목록의 카드는 클릭 동작이 없으므로 커서 모양 변경 */
  padding: 22px;
}
.favorite-list .weather-card:hover {
  transform: none;
  box-shadow: none;
}

/* 즐겨찾기가 비어있을 때 안내 문구 */
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
