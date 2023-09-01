import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import styles from './Book.module.css'
import { useBook, useKeycloakAuthenticated } from '@/hooks/_index'
import { bookAtom } from '@/atoms'
import { ReactComponent as BookmarkFill } from '@/assets/bookmark-fill.svg'
import { ReactComponent as BookmarkEmpty } from '@/assets/bookmark-empty.svg'

const Book = ({ className }: { className: string }) => {
  const book = useRecoilValue(bookAtom)
  
  const isKeycloakAuthenticated = useKeycloakAuthenticated()
  const { addBook, deleteBook, checkBook } = useBook()
  
  // 빠른 이동을 했을 경우에도 checkBook을 실행하기 위해 cartId 추적
  const cartId = localStorage.getItem("cartId")
  
  // 로그인이 된 상태면 개인 AI 데이터를 확인한다
  useEffect(() => {
    if(isKeycloakAuthenticated) {
      checkBook()
    }
  }, [isKeycloakAuthenticated, cartId])

  //book이 false면 예제 추가, true면 예제 제거
  const handleBook = () => {
    if (!book) {
      addBook()
    } else {
      deleteBook()
    }
  }

  return (
    <button
      type="button"
      className={`${className} ${styles.Book}`}
      onClick={handleBook}
      aria-label="북마크하기"
    >
      {book === false ? <BookmarkEmpty /> : <BookmarkFill />}
    </button>
  )
}

export default Book
