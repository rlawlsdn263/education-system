import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import DOMPurify from 'dompurify';
import data from '@/data/layers/AI28_LAYER.json'
import styles from './Table.module.css'
import { modalAtom, loadingAtom } from '@/atoms'
import { handleNavigate } from "@/utils/_index.ts";


const Table = () => {
  // const table = useRecoilValue(tableAtom)
  const setModal = useSetRecoilState(modalAtom)
  const setLoading = useSetRecoilState(loadingAtom)
  const navigate = useNavigate()
  const { keycloak } = useKeycloak();
  // const isLoggedIn = keycloak.authenticated;

    //진우 - 원래라면 useEffect를 사용하는 게 맞는 거 같다
    const { title, columns, rows, body } = data;

    return (
      <>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.table}>

          <div className={styles.columns}>
            {
              /* 테이블 헤더 */
              columns.map((column) => {
                return (
                  <div key={column.id} className={styles['column-data']}>
                    <span className={styles['column-text']}>{column.header}</span>
                  </div>
                )
              })
            }
          </div>

          <div className={styles.container}>
            <div className={styles.rows}>
              {
                /* 사이드 헤더 */
                rows.map((row) => {
                  return (
                    <div key={row.id} className={styles['row-data']}>
                      <span>{row.side}</span>
                    </div>
                  )
                })
              }
            </div>
            <div className={styles.body}>
              {
                /* 바디 데이터 */
                body.map((data) => {
                  //<br>을 사용하기 위해 dangerouslySetInnerHTML을 사용했다.
                  //dangerouslySetInnerHTML을 사용으로 인한 XSS 공격을 방지하기 위해 DOMPurify를 사용했다.
                  const cleanHTML = DOMPurify.sanitize(data.name);
                  
                  return (
                    <div
                      key={data.id}
                      className={styles['body-data']}
                      onClick={() => handleNavigate(data.id, keycloak, setLoading, setModal, navigate)}
                    >
                      <span
                        dangerouslySetInnerHTML={{ __html: cleanHTML }}
                      ></span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </>
    )
  } 

export default Table
