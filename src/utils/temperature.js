/*
 * 섭씨 원본 온도를 기준으로 체감 단계와 색상을 반환합니다.
 *
 * 화면이 화씨로 표시되더라도 같은 날씨가 다른 단계로 바뀌지 않도록
 * 온도 분류에는 변환 전 섭씨값을 사용합니다.
 */
export function getTemperatureLevel(temp) {
  const celsiusTemp = Number(temp)

  if (celsiusTemp >= 33) {
    return {
      label: '매우 더움',
      color: '#b91c1c',
      background: '#fee2e2',
      textColor: '#7f1d1d',
    }
  }

  if (celsiusTemp >= 28) {
    return {
      label: '더움',
      color: '#ef4444',
      background: '#fef2f2',
      textColor: '#b91c1c',
    }
  }

  if (celsiusTemp >= 24) {
    return {
      label: '따뜻함',
      color: '#f59e0b',
      background: '#fffbeb',
      textColor: '#b45309',
    }
  }

  if (celsiusTemp >= 18) {
    return {
      label: '선선함',
      color: '#22c55e',
      background: '#f0fdf4',
      textColor: '#15803d',
    }
  }

  if (celsiusTemp >= 10) {
    return {
      label: '쌀쌀함',
      color: '#38bdf8',
      background: '#f0f9ff',
      textColor: '#0369a1',
    }
  }

  if (celsiusTemp >= 0) {
    return {
      label: '추움',
      color: '#2563eb',
      background: '#eff6ff',
      textColor: '#1d4ed8',
    }
  }

  return {
    label: '매우 추움',
    color: '#1e3a8a',
    background: '#e0e7ff',
    textColor: '#1e3a8a',
  }
}

/* CSS에서 공통 색상 변수로 사용할 객체를 만듭니다. */
export function getTemperatureStyle(temp) {
  const level = getTemperatureLevel(temp)

  return {
    '--temp-color': level.color,
    '--temp-background': level.background,
    '--temp-text-color': level.textColor,
  }
}
