import axios from 'axios'

/*
 * OpenWeatherMap API의 공통 주소를 설정합니다.
 *
 * timeout은 서버 응답을 최대 10초까지 기다린다는 의미입니다.
 */
const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
})

/*
 * .env.local에 저장한 API 키를 가져옵니다.
 *
 * Vite에서는 VITE_로 시작하는 환경변수만
 * import.meta.env를 통해 읽을 수 있습니다.
 */
function getApiKey() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error('OpenWeatherMap API 키가 없습니다. .env.local 파일을 확인해주세요.')
  }

  return apiKey
}

/*
 * 특정 도시의 현재 날씨를 가져옵니다.
 *
 * 사용 예:
 * fetchCurrentWeather('Seoul,KR')
 *
 * units: metric
 * 온도를 섭씨 기준으로 받습니다.
 *
 * lang: kr
 * 날씨 설명을 한국어로 받습니다.
 */
export async function fetchCurrentWeather(cityQuery) {
  const response = await weatherApi.get('/weather', {
    params: {
      q: cityQuery,
      appid: getApiKey(),
      units: 'metric',
      lang: 'kr',
    },
  })

  return response.data
}

/*
 * 본인만의 추가 API 기능으로 사용할
 * 5일·3시간 단위 날씨 예보 요청입니다.
 *
 * 다음 단계에서 상세 페이지에 적용할 예정입니다.
 */
export async function fetchFiveDayForecast(cityQuery) {
  const response = await weatherApi.get('/forecast', {
    params: {
      q: cityQuery,
      appid: getApiKey(),
      units: 'metric',
      lang: 'kr',
    },
  })

  return response.data
}
