# 🌤️ 날씨 대시보드

> 한 줄 소개
>
> Vue 3에서 배운 반응형 상태, 컴포넌트 통신, Router, Pinia, 비동기 API, 외부 UI 라이브러리를 하나의 날씨 서비스로 연결한 프로젝트입니다.

---

## 📌 프로젝트 정보

| 구분        | 내용                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| 프로젝트    | 날씨 대시보드                                                          |
| 주요 기능   | 실시간 날씨, 검색, 정렬, 상세 예보, 즐겨찾기, 섭씨·화씨 전환           |
| 지원 지역   | 서울 외 11개 지역, 총 12개 지역                                        |
| 외부 데이터 | OpenWeatherMap Current Weather / 5 Day Forecast API                    |
| 핵심 기술   | Vue 3, Vue Router, Pinia, Axios, Element Plus                          |
| 저장소      | [GitHub Repository](https://github.com/cchloe1006-eng/skala_vue)       |
| 배포 주소   | [https://skalavue-sigma.vercel.app](https://skalavue-sigma.vercel.app) |     |

### ✅ 현재 구현 상태

- [x] Composition API를 이용한 반응형 데이터 처리
- [x] Props / Emits / Slot 기반 컴포넌트 분리
- [x] 검색 및 온도 정렬
- [x] Vue Router와 동적 상세 경로
- [x] Catch-all Not Found 처리
- [x] Pinia를 이용한 섭씨·화씨 상태 공유
- [x] Axios 비동기 GET 요청
- [x] 현재 날씨와 5일 예보 연동
- [x] Element Plus UI 적용
- [x] 로딩·오류·빈 결과 화면 처리
- [x] ESLint·Oxlint 검사 및 프로덕션 빌드
- [ ] 즐겨찾기 영구 저장
- [ ] 자동화 테스트
- [ ] 백엔드 프록시를 통한 API 키 보호

---

## 💭 프로젝트를 시작하며

처음에는 하나의 Vue 파일 안에 날씨 배열, 검색어, 클릭 이벤트, 화면, CSS를 모두 작성했습니다. 기능은 동작했지만 코드가 길어질수록 다음과 같은 의문이 생겼습니다.

> 💡 프로젝트를 진행하며 고민한 질문
>
> - 검색어는 부모와 검색창 중 누가 관리해야 할까?
> - 자식 카드가 부모 데이터를 직접 변경해도 될까?
> - 메인 화면과 상세 화면의 온도 단위를 어떻게 같게 유지할까?
> - 사용자가 URL을 직접 입력하거나 API가 실패하면 어떤 화면이 필요할까?
> - UI 라이브러리를 적용하면 기존 기능에 어떤 영향을 줄까?

이 질문에 하나씩 답하면서 단순 Mockup을 컴포넌트 기반 SPA로 확장했습니다.

> 🎯 프로젝트 목표
>
> 화면이 동작하는 것에서 끝나지 않고, 데이터의 주인·컴포넌트의 책임·상태의 범위·실패했을 때의 동작을 설명할 수 있는 구조를 만드는 것입니다.

---

## ✨ 주요 기능

### 🔎 1. 도시와 날씨 상태 검색

- 도시 이름으로 원하는 지역을 검색할 수 있습니다.
- `맑음`, `비`, `흐림` 같은 날씨 상태로도 검색할 수 있습니다.
- 입력 중인 값과 실제 검색에 적용할 값을 구분했습니다.
- 검색 결과가 없을 때는 빈 화면 대신 안내 UI를 보여줍니다.

### ↕️ 2. 온도 기준 정렬

- 기본순
- 온도 낮은순
- 온도 높은순

원본 날씨 배열을 직접 변경하지 않고 `computed`에서 검색과 정렬 결과를 계산합니다.

### 🌡️ 3. 섭씨·화씨 전환

Pinia의 `configStore`가 전체 애플리케이션의 온도 단위를 관리합니다.

| Store 구성        | 역할                             |
| ----------------- | -------------------------------- |
| `unit`            | `celsius` 또는 `fahrenheit` 저장 |
| `unitSymbol`      | 현재 단위의 `℃` 또는 `℉` 반환    |
| `unitName`        | `섭씨` 또는 `화씨` 반환          |
| `toggleUnit()`    | 두 단위를 전환하는 action        |
| `unitChangeCount` | 단위를 변경한 횟수 기록          |

메인, 즐겨찾기, 상세 페이지가 같은 Store를 사용하므로 페이지를 이동해도 선택한 단위가 유지됩니다.

### 🌍 4. 실시간 날씨와 상세 예보

- Axios의 비동기 `GET` 요청으로 현재 날씨를 가져옵니다.
- 상세 화면에서는 현재 날씨와 5일·3시간 예보를 함께 요청합니다.
- 응답 데이터는 화면에서 사용하기 쉬운 형태로 변환합니다.
- 요청 중에는 Skeleton을 표시합니다.
- 요청 실패 시 오류 메시지와 Mock Data를 사용합니다.

### ⭐ 5. 즐겨찾기와 카드 상호작용

- 별 버튼을 눌러 관심 도시를 즐겨찾기에 추가할 수 있습니다.
- 카드를 선택하면 선택 상태를 화면에 표시합니다.
- 상세보기 버튼은 도시 ID를 포함한 상세 Route로 이동합니다.

현재 메인 화면의 즐겨찾기는 반응형 상태로 동작하지만 새로고침 후에는 유지되지 않습니다. 이 부분은 아래의 개선 계획에 솔직하게 기록했습니다.

---

## 🧩 컴포넌트 설계

### 내가 정한 통신 원칙

> 상태의 소유자가 상태를 변경하고, 자식은 변경이 필요하다는 사실만 이벤트로 알린다.

| 구성                    | 적용 방식                  |
| ----------------------- | -------------------------- |
| 부모 → 자식             | `props`로 데이터 전달      |
| 자식 → 부모             | `emits`로 사용자 행동 전달 |
| 공통 레이아웃           | 기본 `slot`으로 내용 주입  |
| 여러 페이지의 공통 상태 | Pinia Store 사용           |

예를 들어 `SearchBar`는 부모의 검색어를 직접 수정하지 않습니다. 입력이 발생하면 `update-query` 이벤트와 입력값을 부모에게 전달하고, 실제 상태는 소유자인 `WeatherHomeView`가 변경합니다.

### 데이터 흐름

```text
사용자 입력
   ↓
SearchBar
   └─ emit('update-query' / 'search')
              ↓
       WeatherHomeView
          ├─ computed로 검색·정렬
          ├─ Axios로 날씨 요청
          └─ props로 데이터 전달
                    ↓
       WeatherCard / FavoriteSidebar
                    │
                    └─ emit('click-detail')
                              ↓
                  router.push('/weather/:cityId')
                              ↓
                    WeatherDetailView

UnitToggler ── action ──▶ Pinia configStore
                              └─ 메인·상세·즐겨찾기 화면이 함께 사용
```

---

## 🗂️ 프로젝트 구조

```text
src/
├── data/
│   └── cityData.js                  # 도시 정보의 단일 기준
├── router/
│   └── index.js                     # Route, Lazy Loading, Catch-all
├── services/
│   └── weatherApi.js                # Axios 인스턴스와 API 함수
├── stores/
│   └── configStore.js               # 온도 단위 전역 상태
├── views/
│   ├── WeatherHomeView.vue          # 메인 상태와 기능을 관리하는 View
│   ├── WeatherDetailView.vue        # 도시별 현재 날씨와 예보
│   ├── WeatherAboutView.vue         # 서비스 소개
│   ├── FavoriteWeatherView.vue      # 즐겨찾기 페이지
│   └── NotFoundView.vue             # 잘못된 주소 처리
└── weatherpractices/component/
    ├── BaseDashboardCard.vue        # Slot 기반 공통 레이아웃
    ├── SearchBar.vue                # 검색 UI와 이벤트
    ├── WeatherCard.vue              # 날씨 카드와 이벤트
    ├── FavoriteSidebar.vue          # 즐겨찾기 요약
    ├── UnitToggler.vue              # 온도 단위 전환
    └── WeatherParent.vue            # 이전 컴포넌트 과제 결과
```

---

## 🪜 학습 단계별 발전 과정

### Step 1. Weather Mockup

`ref`, `v-for`, `v-if`, 이벤트 수식어를 사용해 화면의 기본 동작을 만들었습니다.

배운 점: 반응형 값이 변경되면 Vue가 그 값을 사용하는 화면을 다시 계산합니다.

### Step 2. Composition API

검색과 정렬에 `computed`를 적용하고, 값의 변화를 관찰하는 `watch`와 `watchEffect`를 실습했습니다.

배운 점: 계산된 결과는 `computed`, 외부 작업이나 부수 효과는 `watch` 계열로 역할을 구분해야 합니다.

### Step 3. Component

하나였던 화면을 `BaseDashboardCard`, `SearchBar`, `WeatherCard`, `FavoriteSidebar` 등으로 분리했습니다.

배운 점: 파일 개수를 늘리는 것이 목적이 아니라, 데이터의 주인과 각 컴포넌트의 책임을 명확히 하는 것이 분리의 기준입니다.

### Step 4. Vue Router

View, `RouterLink`, `router.push()`, 동적 파라미터, Lazy Loading, Catch-all Route를 적용했습니다.

배운 점: URL도 애플리케이션 상태입니다. 버튼 이동뿐 아니라 주소창 직접 접근과 잘못된 주소도 함께 설계해야 합니다.

### Step 5. Pinia Store

메인과 상세 화면에 중복되던 온도 단위 상태를 `configStore`로 옮겼습니다.

배운 점: 여러 페이지가 같은 값을 사용한다면 컴포넌트 계층 밖의 Store에서 상태를 공유할 수 있습니다.

### Step 6. OpenWeatherMap API

Mock Data로 검증한 기능을 Axios 기반의 실시간 데이터로 교체했습니다.

배운 점: 비동기는 `await` 문법만의 문제가 아닙니다. 사용자가 기다리는 화면과 실패했을 때의 흐름까지 포함해야 합니다.

### Step 7. Element Plus

기존 기능은 유지하고 입력창, 버튼, 카드, 상태 화면의 표현만 외부 UI 컴포넌트로 변경했습니다.

배운 점: 외부 UI 라이브러리를 적용할 때에도 기능과 표현의 책임을 분리하면 오류 범위를 좁힐 수 있습니다.

### Step 8. Weather Deployment

Vercel을 통해 프로덕션 배포를 진행했습니다.

배운 점: 환경변수는 로컬 `.env.local`과 별개로 배포 플랫폼에도 등록해야 하며,
등록 후에는 재배포해야 빌드에 반영된다는 점을 확인했습니다.

---

## 🧠 주요 설계 판단

<details>
<summary><strong>1. 도시 정보를 왜 별도 파일로 분리했나요?</strong></summary>

처음에는 메인 화면과 상세 화면에 도시 배열을 각각 작성했습니다. 지역을 추가할 때 두 파일을 모두 수정해야 했고, 한쪽 ID가 다르면 상세 페이지가 Not Found로 이동할 수 있었습니다.

`src/data/cityData.js`에 다음 값을 모아 하나의 기준으로 만들었습니다.

- `id`: Router에서 사용하는 식별자
- `city`: 화면에 보여주는 한글 이름
- `query`: OpenWeatherMap에 전달하는 검색어

현재는 메인과 상세 페이지가 같은 도시 정보를 사용하며 12개 지역을 한 파일에서 관리합니다.

</details>

<details>
<summary><strong>2. API 원본 온도를 왜 섭씨로 유지했나요?</strong></summary>

OpenWeatherMap 요청은 `units=metric`으로 고정합니다. 원본 섭씨 값을 직접 바꾸지 않고 화면에 표시할 때만 Store의 설정에 따라 화씨를 계산합니다.

```js
const displayTemp = computed(() => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})
```

이렇게 하면 사용자가 단위를 반복해서 변경해도 변환된 값을 다시 변환하면서 생기는 오차가 누적되지 않습니다.

</details>

<details>
<summary><strong>3. UI 변경과 기능 변경을 왜 분리했나요?</strong></summary>

Element Plus를 적용할 때 검색, 정렬, 상세 이동 로직은 유지했습니다. HTML 입력창·버튼·카드처럼 화면에 보이는 요소만 UI 컴포넌트로 교체했습니다.

기능과 디자인을 동시에 바꾸지 않았기 때문에 문제가 발생했을 때 반응형 로직의 오류인지 UI 적용 오류인지 더 쉽게 구분할 수 있었습니다.

</details>

<details>
<summary><strong>4. 이전 실습 코드를 왜 남겨두었나요?</strong></summary>

기초 이벤트, Composition API, 컴포넌트 과제의 결과물을 별도 Route에 보관했습니다. 최종 코드만 남기는 것보다 프로젝트가 어떤 과정을 거쳐 발전했는지 비교하고 복습하기 위한 선택입니다.

</details>

---

## 🔧 문제 해결 기록

### 문제 1. Element Plus 적용 후 번들 크기 경고

증상

`app.use(ElementPlus)`로 전체 라이브러리를 등록하자 메인 JavaScript가 약 1,045 kB가 되었고 Vite의 500 kB 경고가 발생했습니다.

원인

프로젝트에서 사용하지 않는 Element Plus 컴포넌트까지 전체 번들에 포함되었습니다.

해결

실제로 사용하는 13개 컴포넌트만 `main.js`에서 선택 등록했습니다.

결과

메인 JavaScript가 약 238 kB로 줄었고 빌드 경고가 사라졌습니다.

> 📖 배운 점
>
> 라이브러리는 설치 여부뿐 아니라 가져오는 방식도 초기 로딩 성능에 영향을 줍니다.

### 문제 2. 환경변수를 읽지 못함

증상

API 키를 작성했지만 애플리케이션에서 키가 없다는 오류가 발생했습니다.

원인

`.env.local`을 프로젝트 루트가 아닌 `src` 안에 만들었습니다.

해결

- `.env.local`을 `package.json`과 같은 프로젝트 루트로 이동
- 변수 이름에 `VITE_` 접두사 사용
- 개발 서버 종료 후 재실행
- `.gitignore`에 환경변수 파일 포함
- `.env.example`에는 실제 키가 아닌 예시 값만 작성

> ⚠️ 보안 메모
>
> `VITE_` 환경변수는 브라우저 번들에서 사용되므로 완전한 비밀값이 아닙니다. 실제 서비스에서는 서버 또는 프록시가 API 키를 보관해야 합니다.

### 문제 3. 도시 정보가 여러 파일에 중복됨

증상

새 도시를 추가할 때 메인과 상세 파일을 모두 수정해야 했습니다.

해결

`cityData.js`를 만들고 Router ID, 표시 이름, API 검색어를 공통 관리했습니다.

### 문제 4. API를 기다리는 동안 화면이 비어 보임

원인

API 데이터만 준비하고 요청 중·실패 상태를 따로 설계하지 않았습니다.

해결

`loading`과 `errorMessage` 상태를 추가하고 Skeleton, 오류 안내, fallback Mock Data를 각각 렌더링했습니다.

---

## 🛣️ 라우트

| URL                        | 화면                    |
| -------------------------- | ----------------------- |
| `/`, `/weather`            | 날씨 대시보드           |
| `/about`, `/weather/about` | 서비스 소개             |
| `/weather/favorites`       | 즐겨찾기 화면           |
| `/weather/:cityId`         | 도시별 상세 날씨와 예보 |
| `/not-found`               | 지원하지 않는 도시 안내 |
| 그 외 주소                 | Catch-all Not Found     |

---

## 🛠️ 기술 스택

| 분류     | 기술                     | 사용 이유                        |
| -------- | ------------------------ | -------------------------------- |
| Frontend | Vue 3, Composition API   | 반응형 UI와 컴포넌트 구성        |
| Build    | Vite                     | 빠른 개발 서버와 프로덕션 빌드   |
| Routing  | Vue Router               | 페이지 이동, 동적 경로, 404 처리 |
| State    | Pinia                    | 온도 단위 전역 공유              |
| HTTP     | Axios                    | OpenWeatherMap 비동기 GET 요청   |
| UI       | Element Plus             | 일관된 입력·카드·상태 UI         |
| Quality  | ESLint, Oxlint, Prettier | 정적 검사와 코드 형식 관리       |

---

## 🚀 실행 방법

### 1. 저장소 복제

```bash
git clone https://github.com/cchloe1006-eng/skala_vue.git
cd skala_vue
```

### 2. 패키지 설치

```bash
npm install
```

> Node.js `22.18.0 이상` 또는 `24.12.0 이상`을 권장합니다.

### 3. API 키 설정

프로젝트 루트의 `.env.example`을 참고해 `.env.local` 파일을 만듭니다.

```env
VITE_OPENWEATHER_API_KEY=발급받은_API_KEY
```

`.env.local`은 Git에 올리지 않습니다. 환경변수를 변경했다면 개발 서버를 다시 실행해야 합니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

터미널에 출력된 Local 주소로 접속합니다. 기본 포트가 사용 중이면 Vite가 `5174`처럼 다른 포트를 자동 선택할 수 있습니다.

### 5. 검사와 빌드

```bash
npm run lint
npm run build
```

---

## 🌱 나만의 추가 구현

과제의 기본 기능에서 멈추지 않고 다음 내용을 추가했습니다.

- 지원 지역을 총 12곳으로 확장
- 즐겨찾기 기능과 전용 View 추가
- OpenWeatherMap 5일·3시간 Forecast API 적용
- 온도 단위 변경 횟수를 저장하는 `unitChangeCount` 추가
- 도시 데이터를 `cityData.js`로 통합
- API 실패 시 Mock Data fallback 구성
- Element Plus 전체 등록을 선택 등록으로 최적화
- 이전 학습 결과를 별도 Route에 보존

---

## ⚠️ 현재 한계

> 완성 여부를 과장하지 않고, 현재 구조에서 부족한 부분도 함께 기록했습니다.

- 메인 즐겨찾기는 새로고침하면 사라집니다.
- 즐겨찾기 전용 View와 메인 즐겨찾기 상태가 아직 하나의 Store로 통합되지 않았습니다.
- 메인 요청은 `Promise.all()`을 사용하므로 한 도시의 요청 실패가 전체 fallback으로 이어집니다.
- fallback Mock Data는 전체 12개가 아닌 일부 도시만 제공합니다.
- API 키를 클라이언트에서 사용하고 있습니다.
- 자동화된 컴포넌트·Store 테스트가 아직 없습니다.
- 모바일 환경과 키보드 접근성은 추가 검증이 필요합니다.

### 다음 개선 순서

1. 즐겨찾기 상태를 Pinia로 통합하고 Local Storage에 저장
2. `Promise.allSettled()`로 성공한 도시부터 부분 표시
3. Vitest로 Store와 온도 변환 로직 테스트
4. 백엔드 프록시를 이용한 API 키 보호
5. 모바일·접근성 점검

---

## 📝 프로젝트 회고

이번 프로젝트에서 가장 크게 달라진 생각은 “컴포넌트를 많이 나누면 좋은 코드”가 아니라는 점입니다. 상태를 누가 가지고 있는지, 자식이 무엇을 입력받고 어떤 사건을 알리는지, 여러 페이지가 공유해야 하는 상태인지 먼저 판단해야 분리의 기준이 생겼습니다.

또한 비동기 API는 `await`로 데이터를 받는 코드만을 의미하지 않았습니다. 사용자가 기다리는 동안의 화면, 실패했을 때의 대체 흐름, 설정값의 공개 범위, 여러 요청 중 일부만 실패하는 상황까지 함께 설계해야 실제 사용 가능한 기능이 됩니다.

> 🌱 최종 정리
>
> 이 프로젝트는 단순히 날씨를 보여주는 결과물이 아니라,
> Mockup → 반응형 로직 → Component → Router → Store → API → UI Library
> 순서로 기능을 확장하며 각 기술이 왜 필요한지 확인한 학습 기록입니다.
