import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import store from "../store";

dayjs.locale("pt-br");

const isAuthenticated = () => {
  if (!store.state.user) return false;

  const validToken = dayjs().isBefore(dayjs(store.state.user.expires));

  if (!validToken) {
    store.commit("SET_USER", null);
    return false;
  }

  return true;
};

const authConfig = {
  authUrl: "https://id.twitch.tv/oauth2/authorize",
  client_id: process.env.VUE_APP_CLIENT_ID,
  redirect_uri: `${process.env.VUE_APP_URL}/login/callback`,
  response_type: "code",
  scopes: "user:read:email"
};

export { isAuthenticated, authConfig };
