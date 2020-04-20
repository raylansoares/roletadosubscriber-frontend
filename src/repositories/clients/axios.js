import axios from 'axios'

const environment = {
  development: {
    baseURL: 'http://localhost:8000'
  },
  production: {
    baseURL: 'http://localhost:8000'
  }
}

export default axios.create(environment[process.env.NODE_ENV])
