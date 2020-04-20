import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import store from '../store'

dayjs.locale('pt-br')

const isAuthenticated = () => {
  const valid = dayjs().isBefore(dayjs(store.state.user.expires))
  if (!valid) {
    store.commit('SET_USER', {
      name: '',
      expires: ''
    })
    return false
  }
  return true
}
export {
  isAuthenticated
}
