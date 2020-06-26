import axios from "axios";

const axiosConfig = {
  baseURL: `${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}`
};

export default axios.create(axiosConfig);
