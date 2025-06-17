import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export const getContactsDuration = new Trend('get_contacts', true);
export const RateContentOK = new Rate('content_OK');

export const options = {
  thresholds: {
    http_req_duration: ['p(95) < 5700'],
    http_req_failed: ['rate < 0.12'],  
  },
  stages: [
    { duration: '30s', target: 50 },
    { duration: '10s', target: 40 },
    { duration: '60s', target: 80 },
    { duration: '20s', target: 70 },
    { duration: '40s', target: 110 },
    { duration: '20s', target: 100 },
    { duration: '40s', target: 130 },
    { duration: '30s', target: 140 },
    { duration: '20s', target: 230 },  
    { duration: '30s', target: 300 },
  ],
  maxDuration: '300s',  
};

export function handleSummary(data) {
  return {
    './src/output/index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  };
}

export default function () {
  const baseUrl = 'https://dog.ceo/api/breeds/image/random';

  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // };

  const OK = 200;

  const res = http.get(`${baseUrl}`); //,params

  getContactsDuration.add(res.timings.duration);

  RateContentOK.add(res.status === OK);

  check(res, {
    'GET Contacts - Status 200': () => res.status === OK
  });
}
