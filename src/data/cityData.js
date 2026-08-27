/*
 * 날씨 대시보드에서 사용하는 도시 목록입니다.
 *
 * id:
 * Router의 /weather/:cityId에서 사용하는 값
 *
 * city:
 * 화면에 표시할 한글 이름
 *
 * query:
 * OpenWeatherMap API에 전달할 검색어
 */
export const cityRequests = [
  {
    id: 'seoul',
    city: '서울',
    query: 'Seoul,KR',
  },
  {
    id: 'busan',
    city: '부산',
    query: 'Busan,KR',
  },
  {
    id: 'suwon',
    city: '수원',
    query: 'Suwon,KR',
  },
  {
    id: 'incheon',
    city: '인천',
    query: 'Incheon,KR',
  },
  {
    id: 'daejeon',
    city: '대전',
    query: 'Daejeon,KR',
  },
  {
    id: 'daegu',
    city: '대구',
    query: 'Daegu,KR',
  },
  {
    id: 'gwangju',
    city: '광주',
    query: 'Gwangju,KR',
  },
  {
    id: 'ulsan',
    city: '울산',
    query: 'Ulsan,KR',
  },
  {
    id: 'sejong',
    city: '세종',
    query: 'Sejong,KR',
  },
  {
    id: 'jeju',
    city: '제주',
    query: 'Jeju City,KR',
  },
  {
    id: 'gangneung',
    city: '강릉',
    query: 'Gangneung,KR',
  },
  {
    id: 'chuncheon',
    city: '춘천',
    query: 'Chuncheon,KR',
  },
]

/*
 * 상세 페이지에서 cityId로 도시를 빠르게 찾기 위한 객체입니다.
 *
 * 예:
 * cityQueryMap.busan
 * → { city: '부산', query: 'Busan,KR' }
 */
export const cityQueryMap = Object.fromEntries(
  cityRequests.map((item) => {
    return [
      item.id,
      {
        city: item.city,
        query: item.query,
      },
    ]
  }),
)
