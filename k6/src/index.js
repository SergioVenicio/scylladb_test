import http from 'k6/http';
import { sleep } from 'k6';
import { generateSubscriber } from './fake-data'
export const options = {
  vus: 30,
  duration: '60s',
};
const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };


export default function () {
  console.log('resquesting....')
  http.post('http://localhost:3000/', JSON.stringify(generateSubscriber()), params);
  sleep(0.5);
}