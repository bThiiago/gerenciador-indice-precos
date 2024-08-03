import axios from 'axios';
import { NoResponseError } from '../errors/NoResponseError';
import { ResponseError } from '../errors/ResponseError';
import { UnexpectedError } from '../errors/UnexpectedError';

// const baseURL = process.env.REACT_APP_API_LOCAL_URL; // Descomentar para rodar local
const baseURL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL,
  timeout: 15000,
});

instance.defaults.timeout = 15000;

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!axios.isCancel(error)) {
      if (error.response) {
        throw new ResponseError(error.response.data, error.response.status);
      } else if (error.request) {
        throw new NoResponseError(error.stack);
      }
      throw new UnexpectedError(error.stack);
    }
  }
);

export const api = instance;
