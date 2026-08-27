<script setup>
// 이 페이지는 별도의 데이터나 함수가 필요하지 않습니다.
// 존재하지 않는 URL에 접근했을 때 안내 화면만 보여줍니다.
</script>

<template>
  <main class="not-found-view">
    <section class="not-found-card">
      <div class="weather-symbol">☀️❓</div>

      <h1>페이지를 찾을 수 없습니다.</h1>

      <p>
        요청하신 주소가 존재하지 않거나,<br />
        아직 개발되지 않은 페이지입니다.
      </p>

      <!--
        잘못된 주소에서 날씨 메인 페이지로 돌아갈 수 있게 합니다.
        weather-home이라는 route name은 router/index.js에서 등록합니다.
      -->
      <RouterLink :to="{ name: 'weather-home' }" class="home-link"> 날씨 메인으로 이동 </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.not-found-view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 100px);
  padding: 40px 24px;
  box-sizing: border-box;
}

.not-found-card {
  width: 100%;
  max-width: 480px;
  padding: 56px 32px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  text-align: center;
}

.weather-symbol {
  margin-bottom: 24px;
  font-size: 72px;
}

.not-found-card h1 {
  margin-bottom: 16px;
  color: #1e293b;
}

.not-found-card p {
  margin-bottom: 30px;
  color: #64748b;
  line-height: 1.7;
}

.home-link {
  display: inline-block;
  padding: 13px 22px;
  border-radius: 10px;
  color: #ffffff;
  background-color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.home-link:hover {
  background-color: #1d4ed8;
}
</style>
