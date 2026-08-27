import { defineStore } from 'pinia'

/*
 * 날씨 화면에서 공통으로 사용하는 온도 단위 Store입니다.
 *
 * 이 Store를 사용하면 메인 화면과 상세 화면이
 * 같은 온도 단위 상태를 함께 사용할 수 있습니다.
 */
export const useConfigStore = defineStore('config', {
  /*
   * state
   *
   * 컴포넌트들이 함께 사용할 반응형 데이터를 저장합니다.
   */
  state: () => ({
    // 과제 요구사항: 초기 온도 단위는 섭씨
    unit: 'celsius',

    /*
     * 나만의 추가 상태
     *
     * 사용자가 온도 단위를 몇 번 변경했는지 저장합니다.
     */
    unitChangeCount: 0,
  }),

  /*
   * getters
   *
   * state를 이용해 화면에 필요한 값을 계산합니다.
   * 컴포넌트의 computed와 비슷한 역할입니다.
   */
  getters: {
    /*
     * 과제 요구사항
     *
     * 현재 단위가 섭씨라면 ℃,
     * 화씨라면 ℉를 반환합니다.
     */
    unitSymbol: (state) => {
      return state.unit === 'celsius' ? '℃' : '℉'
    },

    /*
     * 나만의 추가 getter
     *
     * 화면에 표시할 한글 단위 이름을 반환합니다.
     */
    unitName: (state) => {
      return state.unit === 'celsius' ? '섭씨' : '화씨'
    },
  },

  /*
   * actions
   *
   * Store의 state를 변경하는 함수를 작성합니다.
   */
  actions: {
    /*
     * 과제 요구사항
     *
     * celsius와 fahrenheit를 서로 전환합니다.
     */
    toggleUnit() {
      if (this.unit === 'celsius') {
        this.unit = 'fahrenheit'
      } else {
        this.unit = 'celsius'
      }

      // 단위를 변경할 때마다 변경 횟수를 1 증가시킵니다.
      this.unitChangeCount += 1
    },
  },
})
