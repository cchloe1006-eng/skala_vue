<script setup>
/*
 * RouterLink: 새로고침 없이 다른 URL로 이동합니다.
 * RouterView: 현재 URL에 해당하는 View를 표시합니다.
 */
import { RouterLink, RouterView } from 'vue-router'

/*
 * Pinia의 온도 단위를 변경하는 버튼 컴포넌트입니다.
 */
import UnitToggler from './weatherpractices/component/UnitToggler.vue'
</script>

<template>
  <div class="app-shell">
    <!-- 모든 페이지에서 공통으로 보이는 상단 영역 -->
    <header class="app-header">
      <div class="header-inner">
        <!-- 제목을 누르면 날씨 메인 화면으로 이동합니다. -->
        <RouterLink :to="{ name: 'weather-home' }" class="service-title">
          🌤️ 날씨 대시보드
        </RouterLink>

        <!-- 내비게이션과 온도 단위 버튼을 하나의 그룹으로 묶습니다. -->
        <div class="header-actions">
          <!-- Vue Router를 사용하는 상단 내비게이션 -->
          <nav class="navigation">
            <RouterLink :to="{ name: 'weather-home' }"> 🏠 날씨 홈 </RouterLink>

            <RouterLink :to="{ name: 'weather-about' }"> ℹ️ 서비스 소개 </RouterLink>

            <RouterLink :to="{ name: 'favorite-weather' }"> ⭐ 즐겨찾기 </RouterLink>
          </nav>

          <!--
            Weather Store 과제에서 추가한 온도 단위 버튼입니다.

            App.vue에 배치했기 때문에 메인, 소개, 상세 페이지에서
            공통으로 사용할 수 있습니다.
          -->
          <UnitToggler />
        </div>
      </div>
    </header>

    <!-- 현재 주소에 해당하는 View가 표시되는 자리 -->
    <div class="page-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
/* 애플리케이션 전체 영역 */
.app-shell {
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
}

/* 모든 페이지에서 공통으로 보이는 상단 영역 */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e5e7eb;
  background-color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
}

/* 제목과 오른쪽 메뉴 그룹을 가로로 배치합니다. */
.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  width: min(1400px, 92%);
  margin: 0 auto;
  padding: 28px 0;
}

/* 왼쪽 서비스 제목 */
.service-title {
  color: #1e293b;
  font-size: 28px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

/*
 * 내비게이션과 UnitToggler를 가로로 배치하는 영역입니다.
 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 오른쪽 메뉴 그룹 */
.navigation {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* 각각의 메뉴 링크 */
.navigation a {
  padding: 14px 20px;
  border-radius: 11px;
  color: #64748b;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  transition:
    color 0.15s,
    background-color 0.15s;
}

.navigation a:hover {
  color: #2563eb;
  background-color: #eff6ff;
}

/*
 * 현재 URL과 일치하는 RouterLink에
 * Vue Router가 자동으로 붙이는 클래스입니다.
 */
.navigation a.router-link-active {
  color: #2563eb;
  background-color: #dbeafe;
}

/* 현재 View가 표시되는 영역 */
.page-content {
  width: 100%;
}

/* 화면이 좁아졌을 때의 배치 */
@media (max-width: 1100px) {
  .header-inner {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px 0;
  }

  .header-actions {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
    width: 100%;
  }

  .navigation {
    flex-wrap: wrap;
  }
}

@media (max-width: 720px) {
  .service-title {
    font-size: 23px;
  }

  .navigation a {
    padding: 11px 14px;
    font-size: 16px;
  }
}
</style>
