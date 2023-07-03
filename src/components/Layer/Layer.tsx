import data from '@/data/LAYERS_DATA.json'
import styles from './Layer.module.css'

interface LayerProps {
  variant: '전국민 AI' | '전산업 AI의료' | '전장병 AI' | '개인 AI'
  className?: string
}

interface LayerDataProps {
  id: number
  name: string
}

const Layer = ({ className, variant }: LayerProps) => {
  // title, body는 variant props에 따라 채워질 내용이 달라지기 때문에 빈 값으로 선언됨
  // Q - 현재는 any 타입인데 이게 맞는 걸까?
  let title
  let body

  // 전달받은 variant prop에 따라 보여주는 레이어 콘텐츠가 달라지는 조건문
  if (variant === '전국민 AI') {
    title = data[0].title
    body = data[0].body
  } else if (variant === '전산업 AI의료') {
    title = data[1].title
    // 데이터가 준비되지 않은 값은 렝이어 통일성을 위해 인위적으로 배열을 생산함
    // M - 전산업 AI의료의 경우 기획에서 새로 전달받기로 함
    body = new Array(28).fill(0)
  } else if (variant === '전장병 AI') {
    title = data[2].title
    // 데이터가 준비되지 않은 값은 렝이어 통일성을 위해 인위적으로 배열을 생산함
    body = new Array(28).fill(0)
  } else {
    title = data[3].title
    // 데이터가 준비되지 않은 값은 렝이어 통일성을 위해 인위적으로 배열을 생산함
    // M - 개인 AI의 경우, DB를 별도로 생성해서 관리하기 때문에 수정될 예정임!
    body = new Array(28).fill(0)
  }

  // variant prop에 따라 backgroundColor의 값은 달라진다
  const layerBackgroundColor =
    variant === '전국민 AI'
      ? { background: '#EAEEFF' }
      : variant === '전산업 AI의료'
      ? { background: '#DBDFFE' }
      : variant === '전장병 AI'
      ? { background: '#BFC7FE' }
      : { background: '#93A4FD' }

  return (
    // variant prop에 따라 달라진 배경색이 인라인 스타일로 전달된다
    <div
      className={`${className} ${styles.Layer}`}
      style={layerBackgroundColor}
    >
      <h2 className={styles.title}>{title}</h2>
      <div className={styles['block-container']}>
        {body?.map((data: LayerDataProps) => {
          return (
            <div key={data.id} className={styles.block}>
              <span
                className={styles.content}
                // M - InnerHTML은 XSS 공격에 취약해 사용하면 안 된다!
                // M - DOMPurift를 사용하면 되지만, npm audit 문제로 우선은 보류했다
                dangerouslySetInnerHTML={{ __html: data.name }}
              ></span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Layer