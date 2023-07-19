/* 악성코드 분류 - 바이너리 분류 */
import axios from 'axios'
import base64DataToFile from '../../base64DataToFile'

const binaryClassification = async (
  value: any, // 사용자가 입력한 값 (string or base64)
  formUrl: any, // 사용자가 입력한 api Url
  setLoading: any, // 로딩
  // setResult: any,    // 결과 컴포넌트
) => {
  const axiosUrl = '/inference/file_req_ajx' // 고정값
  const convertData = await base64DataToFile(value, 'image', 'image/png')
  /* FormData (apiUrl, data) 형태로 전송 */
  const formData = new FormData()
  formData.append('url', formUrl)
  formData.append('file', convertData) // 사용자가 전송할 값이 [문자열] 형태일 때

  setLoading(true) // 로딩 표시
  /* axios 비동기 통신 함수 */
  axios
    .post(axiosUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'json',
    })
    .then(res => {
      let json = res.data
      if (json.res == 'true') {
        let response_data = json.response.data
        if (response_data == null) {
          response_data = json.response.inference
        }
        /* 결과  */
        if (response_data == 'benign') {
          // 정상 결과 컴포넌트
        } else {
          // 파손 결과 컴포넌트
        }
      } else {
        alert('API 호출에 실패했습니다.')
      }
    })
    .catch(err => {
      console.log(err.message)
    })
    .finally(() => {
      setLoading(false)
    })
}

export default binaryClassification