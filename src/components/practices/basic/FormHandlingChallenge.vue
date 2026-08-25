<script setup>
import { ref } from 'vue'

// ===== 1) v-model 양방향 데이터 바인딩 =====
const text1 = ref('') // v-model용 변수
const text2 = ref('') // 원리 이해용 변수

// ===== 2) HTML Form 요소와 v-model 매핑 =====
const comment = ref('') // textarea → 문자열
const isAgreed = ref(false) // 단일 체크박스 → Boolean
const favoriteFruits = ref([]) // 다중 체크박스 → 배열([])로 시작!
const gender = ref('') // 라디오 → 문자열
const selectedCar = ref('') // select → 문자열

// ===== 3) v-model Modifiers =====
const lazyText = ref('')
const age = ref('')
const userEmail = ref('')
const price = ref('')
</script>

<template>
  <div class="practice-section">
    <h1>Code Challenge - Vue Form Handling</h1>

    <!-- 1) v-model 양방향 데이터 바인딩 -->
    <section>
      <h2>1) v-model 양방향 데이터 바인딩</h2>

      <h3>1-1) v-model 축약 문법 (양방향)</h3>
      <input type="text" v-model="text1" placeholder="여기에 입력하세요" />
      <p>
        입력된 값: <strong>{{ text1 }}</strong>
      </p>

      <h3>1-2) v-model의 내부 작동 원리 (단방향 + 이벤트)</h3>
      <input
        type="text"
        :value="text2"
        @input="(e) => (text2 = e.target.value)"
        placeholder="원리 파악용 입력창"
      />
      <p>
        입력된 값: <strong>{{ text2 }}</strong>
      </p>
    </section>

    <hr />

    <!-- 2) HTML Form 요소와 v-model 매핑 -->
    <section>
      <h2>2) 모든 HTML Form 요소와 v-model 매핑</h2>

      <div>
        <h3>2-1) Textarea (장문 텍스트)</h3>
        <textarea v-model="comment" placeholder="의견을 남겨주세요"></textarea>
        <p>
          데이터 상태: <span>{{ comment }}</span>
        </p>
      </div>

      <div>
        <h3>2-2) 단일 Checkbox (동의 여부)</h3>
        <label><input type="checkbox" v-model="isAgreed" /> 약관에 동의합니다.</label>
        <p>
          데이터 상태: <span>{{ isAgreed }}</span>
        </p>
      </div>

      <div>
        <h3>2-3) 다중 Checkbox (복수 선택 -&gt; 배열에 저장)</h3>
        <label><input type="checkbox" value="사과" v-model="favoriteFruits" /> 사과</label>
        <label><input type="checkbox" value="바나나" v-model="favoriteFruits" /> 바나나</label>
        <label><input type="checkbox" value="딸기" v-model="favoriteFruits" /> 딸기</label>
        <p>
          데이터 상태 (배열): <span>{{ favoriteFruits }}</span>
        </p>
      </div>

      <div>
        <h3>2-4) Radio (단일 선택)</h3>
        <label><input type="radio" value="남성" v-model="gender" /> 남성</label>
        <label><input type="radio" value="여성" v-model="gender" /> 여성</label>
        <p>
          데이터 상태: <span>{{ gender }}</span>
        </p>
      </div>

      <div>
        <h3>2-5) Select (드롭다운 선택)</h3>
        <select v-model="selectedCar">
          <option value="">-- 선택하세요 --</option>
          <option value="tesla">테슬라</option>
          <option value="hyundai">현대자동차</option>
          <option value="bmw">BMW</option>
        </select>
        <p>
          데이터 상태: <span>{{ selectedCar }}</span>
        </p>
      </div>
    </section>

    <hr />

    <!-- 3) v-model Modifiers -->
    <section>
      <h2>3) v-model 수식어 (Modifiers) 활용</h2>

      <div style="margin-bottom: 20px">
        <h3>3-1) .lazy 수식어 (change 이벤트 시점 반영)</h3>
        <input type="text" v-model.lazy="lazyText" placeholder="입력 후 Enter 또는 외부 클릭" />
        <p>
          실시간이 아닌 확정된 값: <strong>{{ lazyText }}</strong>
        </p>
      </div>

      <div style="margin-bottom: 20px">
        <h3>3-2) .number 수식어 (Number 타입 자동 형변환)</h3>
        <input type="text" v-model.number="age" placeholder="나이를 입력하세요" />
        <p>
          입력된 값: <strong>{{ age }}</strong>
        </p>
        <p>
          데이터 타입: <strong>{{ typeof age }}</strong>
        </p>
      </div>

      <div style="margin-bottom: 20px">
        <h3>3-3) .trim 수식어 (양끝 공백 자동 제거)</h3>
        <input
          type="text"
          v-model.trim="userEmail"
          placeholder="앞뒤 공백을 포함해 입력해 보세요"
        />
        <p>
          공백 제거된 값: <strong>"{{ userEmail }}"</strong>
        </p>
        <p>
          문자열 길이: <strong>{{ userEmail.length }}</strong>
        </p>
      </div>

      <div>
        <h3>3-4) Chaining (수식어 체이닝: .trim.number)</h3>
        <input
          type="text"
          v-model.trim.number="price"
          placeholder="공백과 숫자를 섞어 입력해 보세요"
        />
        <p>
          처리된 값: <strong>"{{ price }}"</strong>
        </p>
        <p>
          데이터 타입: <strong>{{ typeof price }}</strong>
        </p>
      </div>
    </section>

    <hr />

    <!-- 4) Vue Style Example -->
    <section>
      <h2>4) Scoped 스타일 및 외부 CSS 활용</h2>
      <p class="title">이 글자는 이 컴포넌트 내부에서만 빨간색이 됩니다.</p>
      <button class="btn-local">로컬 scoped 버튼 스타일</button>
    </section>
  </div>
</template>

<style scoped>
.practice-section {
  padding: 20px;
}
section {
  margin-bottom: 24px;
}

/* 4) Vue Style 실습용 - 내 방 전용 스타일 */
.title {
  color: #ff7675;
  font-weight: bold;
  font-size: 18px;
}
.btn-local {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
