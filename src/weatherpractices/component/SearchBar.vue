<script setup>
/*
 * 부모인 WeatherHomeView가 관리하는 검색어를
 * Props로 전달받습니다.
 */
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

/*
 * 검색어 변경과 검색 버튼 클릭을
 * 부모 컴포넌트에게 전달합니다.
 */
const emit = defineEmits(['update-query', 'search'])

/*
 * Element Plus의 el-input은 DOM 이벤트 객체가 아니라
 * 입력된 문자열을 직접 전달합니다.
 *
 * 예:
 * value는 '서울', '맑음' 같은 문자열입니다.
 */
function handleInput(value) {
  emit('update-query', value)
}

/* 검색 버튼을 누르면 부모에게 search 이벤트를 전달합니다. */
function handleSearchClick() {
  emit('search')
}
</script>

<template>
  <div class="search-area">
    <div class="search-label">🔍 검색</div>

    <div class="search-row">
      <!--
        Element Plus 입력창입니다.

        model-value:
        부모에게 받은 현재 검색어를 화면에 표시합니다.

        input:
        사용자가 입력한 문자열을 부모에게 전달합니다.

        keyup.enter:
        Enter 키를 눌러도 검색 이벤트를 발생시킵니다.
      -->
      <el-input
        class="weather-search-input"
        :model-value="currentQuery"
        size="large"
        placeholder="도시 이름 또는 날씨 상태를 검색하세요"
        @input="handleInput"
        @keyup.enter="handleSearchClick"
      />

      <!-- Element Plus 검색 버튼 -->
      <el-button class="search-button" type="primary" size="large" @click="handleSearchClick">
        검색
      </el-button>
    </div>

    <p class="search-status">
      검색 중인 내용:
      <strong>
        {{ currentQuery || '없음' }}
      </strong>
    </p>
  </div>
</template>

<style scoped>
.search-area {
  width: 100%;
}

.search-label {
  margin-bottom: 14px;
  color: #334155;
  font-size: 17px;
  font-weight: 700;
}

.search-row {
  display: flex;
  align-items: stretch;
  gap: 14px;
}

/* Element Plus 입력창이 남은 공간을 사용합니다. */
.weather-search-input {
  flex: 1;
}

/*
 * Element Plus 내부 요소에 scoped 스타일을 적용하려면
 * :deep()을 사용합니다.
 */
:deep(.weather-search-input .el-input__wrapper) {
  min-height: 64px;
  padding: 0 20px;
  border-radius: 16px;
}

:deep(.weather-search-input .el-input__inner) {
  font-size: 18px;
}

/* Element Plus 검색 버튼의 크기만 조정합니다. */
.search-button {
  min-width: 110px;
  height: 64px;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 700;
}

.search-status {
  margin: 14px 0 0;
  color: #64748b;
  font-size: 15px;
}

.search-status strong {
  color: #2563eb;
}

/* 좁은 화면에서는 입력창과 버튼을 세로로 배치합니다. */
@media (max-width: 600px) {
  .search-row {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }
}
</style>
