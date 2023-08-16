import {
  Title,
  ApiURL,
  Input,
  Result,
  Button,
  DropdownMenu,
  RecordButton,
} from '@/components'
import styles from './DetailForm.module.css'
import { useCallback, useEffect, useState } from 'react'
import {
  alertAtom,
  detailDataAtom,
  inputValidationAtom,
  loadingAtom,
} from '@/atoms/index'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { DataType } from '@/pages/Detail/Detail'
// import { default as combinedFunction } from '@/axios/combinedAxios'
import addMimeType from '@/utils/addMimeType'

import { default as combinedProcessor } from '@/axios/combinedProcessor'
import { useLocation, useParams } from 'react-router-dom'

export type InferObj = {
  label: string
}

type SelectedFileType = Record<string, string> | null | undefined
export type InputType = string | string[] | null | undefined

interface DetailFormProps {
  data: DataType | null
  // pageId: string | undefined
}

const DetailForm = ({ data }: DetailFormProps) => {
  const [loading, setLoading] = useRecoilState(loadingAtom)
  const { id:pageId } = useParams() as { id: string | undefined }
  const [selected, setSelected] = useState('default')
  const [selectedFile, setSelectedFile] = useState<SelectedFileType>(null)
  const [value, setValue] = useRecoilState(detailDataAtom)
  const [isValid] = useRecoilState(inputValidationAtom)
  const [infer, setInfer] = useState<string | InferObj | null>(null)
  const [apiURL, setApiURL] = useState<string>('')
  const setAlert = useSetRecoilState(alertAtom)

  const fileList = data &&
    data['data_list'] && [
      '예제 선택하기',
      ...data['data_list'].map(item => item.name),
    ]

  const onChange = useCallback(
    (selected: string) => {
      if (selected === '예제 선택하기') {
        setSelected('default')
        setSelectedFile(null)
      } else {
        setSelected(selected)
      }
    },
    [selected],
  )

  useEffect(() => {
    setSelected('default')
    setSelectedFile(null)
    setInfer(null)
  },[pageId])

  useEffect(() => {
    if (selected === 'default') {
      setSelectedFile(null)
    } else {
      const target =
        data && data['data_list'].find(item => item.name === selected)
      if (pageId && target) {
        if (pageId === '1202') {
          const mapping = {
            ...target,
            data: Array.isArray(target.data)
              ? target.data.map((item: string) => addMimeType(pageId, item))
              : addMimeType(pageId, target.data as string),
          }
          setSelectedFile(mapping as SelectedFileType)

          return
        }
        const mapping = { ...target, data: addMimeType(pageId, target.data) }
        setSelectedFile(mapping)
      }
    }
  }, [selected, data])

  const onClick = useCallback(async () => {
    if (value) {
      const inferResult = await combinedProcessor(
        pageId,
        value,
        apiURL,
        setLoading,
        setAlert,
      )
      setInfer(inferResult === undefined ? null : inferResult)
    } else if (!isValid.isValid) {
      setAlert({ visible: true, option: 'nullError' })
    }
  }, [value, apiURL, setLoading, isValid.isValid, pageId])

  const getInputData = useCallback((data: InputType) => {
    setValue(data as InputType)
  }, [])

  const isAudio = fileList && pageId === '9'

  if (pageId === '9' && data) {
    data['data_type'] = 'record'
  }

  return (
    <section className={styles.container}>
      <Title
        type={2}
        label={'예제 실행해보기'}
        className={'detailform-title'}
      />
      <ApiURL api={data && data.API} apiURL={apiURL} setApiURL={setApiURL} />
      <div className={styles['input-cont']}>
        {data ? (
          <Input
            selected={selectedFile}
            getData={getInputData}
            type={data['data_type']}
          />
        ) : loading ? (
          <div className={styles.loading}>데이터 로딩 중...</div>
        ) : (
          <div className={styles.loading}>데이터 로드에 실패했습니다.</div>
        )}

        <Result infer={infer} />
      </div>
      <div className={styles.fileList}>
        {fileList && <DropdownMenu options={fileList} onSelect={onChange} />}
        {isAudio && <RecordButton />}
      </div>
      <Button
        option={1}
        label={'추론하기'}
        onClick={onClick}
        className={styles['button--input']}
      />
    </section>
  )
}

export default DetailForm
