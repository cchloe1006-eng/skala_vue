<template>
  <div class="weather-mockup">
    <h2>날씨 Mockup</h2>

    <!-- 도시 검색 입력창 (:value + @input 방식) -->
    <input
      :value="searchQuery"
      @input="handleInput"
      type="text"
      placeholder="검색할 도시 이름 입력"
    />
    <p>검색 중인 도시: {{ searchQuery }}</p>

    <div class="weather-list">
      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click="selectCity(item.name)"
      >
        <div class="name">{{ item.name }}</div>
        <div class="temp">현재 기온: {{ item.temp }}°C</div>
        <div class="status">{{ item.status }}</div>
        <div v-if="item.temp >= 25" class="temp-badge hot">🔥 더움 (25도 이상)</div>
        <div v-else class="temp-badge cool">❄️ 선선함 (25도 미만)</div>
        <button @click.stop="showDetail(item.name, item.status)">상세보기</button>
      </div>
    </div>

    <!-- 선택된 도시 상태바 -->
    <p v-if="selectedCityInfo" class="status-bar">{{ selectedCityInfo }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 지역별 날씨 데이터 배열
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '분당', temp: 25, status: '흐림' },
])

// 검색어 (한글 도시 이름 검색용)
const searchQuery = ref('')

// input 값이 바뀔 때마다 실행되는 함수
function handleInput(event) {
  searchQuery.value = event.target.value
}

// 선택된 도시의 상태바 문구
const selectedCityInfo = ref('')

// 카드를 클릭했을 때 실행되는 함수
function selectCity(cityName) {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

// 상세보기 버튼을 눌렀을 때 실행되는 함수 (버블링 없이 동작)
function showDetail(cityName, status) {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<style scoped></style>
