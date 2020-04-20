export default {
  SET_USER (state, event) {
    state.user.name = event.name
    state.user.username = event.username
    state.user.expires = event.expires
  }
}
