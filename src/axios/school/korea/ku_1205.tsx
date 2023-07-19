/* 고려대학교 - 보행약자 보조 AI 1205 */
import axios from 'axios'
import { detailDataAtom, loadingAtom } from '@/atoms'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import base64DataToFile from '../../base64DataToFile'

const detailData = useRecoilValue<any>(detailDataAtom)
const setLoading = useSetRecoilState(loadingAtom)

const ku1205 = () => {
  let data = {
    file: base64DataToFile(detailData, '사진이름', 'image/jpeg'),
    url: 'http://dl.aihunmin.t3q.ai/model/api/7d3e0/inference',
  }

  setLoading(true)

  axios
    .post('/inference/file_req_ajx', data, {
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
        // content_result = 'data:image/jpg;base64,' + response_data

        // $("#resImgSrc").attr("src", content_result);
        // $("div.inner_next").addClass("show_img");
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

export default ku1205