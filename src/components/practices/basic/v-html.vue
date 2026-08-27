<script setup>
/*
 * HTML 태그가 들어 있는 문자열입니다.
 *
 * 일반 보간법 {{ }}으로 출력하면 태그도 글자로 보이고,
 * v-html로 출력하면 HTML 태그가 실제 화면에 적용됩니다.
 */
const rawHtmlData =
  '<strong style="color: #2563eb;">v-html로 표시한 파란색 강조 문장입니다.</strong>'
</script>

<template>
  <div class="practice-section">
    <h2>v-html 디렉티브 학습</h2>

    <!-- HTML 문자열을 일반 글자로 출력합니다. -->
    <h3>일반 보간법 사용 결과</h3>
    <p>{{ rawHtmlData }}</p>

    <!-- HTML 문자열을 실제 HTML로 해석해서 출력합니다. -->
    <h3>v-html 디렉티브 사용 결과</h3>
    <p v-html="rawHtmlData"></p>
  </div>
</template>

<style scoped>
.practice-section {
  padding: 24px;
}

h2 {
  margin-bottom: 24px;
}

h3 {
  margin-top: 20px;
  margin-bottom: 8px;
}

p {
  line-height: 1.6;
}
</style>
