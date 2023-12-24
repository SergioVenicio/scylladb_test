import http from 'k6/http'
import { sleep } from 'k6'
import { generateSubscriber } from './fake-data'
export const options = {
  vus: 100,
  duration: '240s'
}
const params = {
  headers: {
    'Content-Type': 'application/json'
  }
}

export default function () {
  console.log('resquesting....')
  const fakeData = generateSubscriber()
  http.post('http://localhost:3000/', JSON.stringify(fakeData), params)
  http.put('http://localhost:3000/', JSON.stringify(fakeData), params)
  http.get('http://localhost:3000', JSON.stringify(fakeData), params)
  http.get(`http://localhost:3000/${fakeData.sku}`, JSON.stringify(fakeData), params)
  sleep(0.1)
}
