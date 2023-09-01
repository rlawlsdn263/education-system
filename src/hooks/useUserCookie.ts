import Cookies from 'js-cookie';
import { useKeycloak } from '@react-keycloak/web'

const useUserCookie = () => {

    const { keycloak } = useKeycloak();

    // 사용자 쿠키 생성
    const createUserCookie = () => {
        if(keycloak.authenticated) {
            // 'user_auth'에 들어가는 객체 생성
            const authData = {
                access_token: keycloak.token,
                refresh_token: keycloak.refreshToken,
                id_token: keycloak.idToken,
                user_id: keycloak.idTokenParsed?.sub,
            }

            // 'user_auth'라는 쿠키를 생성
            Cookies.set('user_auth', JSON.stringify(authData), { expires: 1, path: '/' })
        }
    }

    const deleteUserCookie = () => {
        Cookies.remove('user_auth')
    }

    return { createUserCookie, deleteUserCookie }
}

export default useUserCookie