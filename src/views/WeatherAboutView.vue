<script setup>
// 이 페이지는 별도의 반응형 데이터가 필요하지 않으므로
// script setup 내부에 작성할 로직이 없습니다.
</script>

<template>
  <main class="about-view">
    <section class="about-card">
      <h1>🌤️ 날씨 서비스 소개</h1>

      <p>이 서비스는 Vue 3와 Vue Router를 활용해 만든 지역별 날씨 대시보드입니다.</p>

      <ul>
        <li>도시 이름이나 날씨 상태로 검색할 수 있습니다.</li>
        <li>기온이 낮은 순서와 높은 순서로 정렬할 수 있습니다.</li>
        <li>관심 있는 도시를 즐겨찾기에 추가할 수 있습니다.</li>
        <li>도시별 상세 날씨 페이지로 이동할 수 있습니다.</li>
      </ul>

      <!--
        RouterLink는 페이지를 새로고침하지 않고
        Vue Router를 이용해 다른 화면으로 이동합니다.

        weather-home은 나중에 router/index.js에서 등록할 route의 name입니다.
      -->
      <RouterLink :to="{ name: 'weather-home' }" class="home-link">
        날씨 대시보드로 돌아가기
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.about-view {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 60px 24px;
  box-sizing: border-box;
}

.about-card {
  width: 100%;
  max-width: 720px;
  padding: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.about-card h1 {
  margin-top: 0;
  color: #1e293b;
}

.about-card p,
.about-card li {
  color: #475569;
  line-height: 1.8;
}

.home-link {
  display: inline-block;
  margin-top: 24px;
  padding: 12px 20px;
  border-radius: 10px;
  color: #ffffff;
  background-color: #2563eb;
  text-decoration: none;
}

.home-link:hover {
  background-color: #1d4ed8;
}
</style>
