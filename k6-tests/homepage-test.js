import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// Import HTML and terminal summary reporters
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

// --- Custom Metrics ---
const baselineDuration = new Trend('baseline_response_time', true);
const loadDuration = new Trend('load_response_time', true);
const errorRate = new Rate('error_rate');
const totalVisits = new Counter('total_homepage_visits');

// --- Target Configuration ---
const TARGET_URL = 'https://quickpizza.grafana.com/';
// const TARGET_URL = 'https://www.apple.com/';

// --- Test Configuration ---
export const options = {
  scenarios: {
    // 1. Measure response time BEFORE the test (Baseline: 1 user, 5 seconds)
    baseline_check: {
      executor: 'constant-vus',
      vus: 1,
      duration: '3s',
      startTime: '0s',
      tags: { phase: 'baseline' },
      exec: 'runBaseline',
    },

    // 2. Measure response time DURING the test (1000 users, 1 visit each, within 15 seconds)
    spike_1000_users: {
      executor: 'per-vu-iterations',
      vus: 1000,          // Exactly 1,000 users
      iterations: 1,      // Exactly 1 homepage visit per user
      maxDuration: '15s', // Strictly bounded to 15 seconds
      startTime: '4s',    // Starts immediately after baseline completes
      tags: { phase: 'spike_1000_users' },
      exec: 'runSpike',
    },
  },
  thresholds: {
    'http_req_duration{phase:baseline}': ['p(95)<500'],
    'http_req_duration{phase:spike_1000_users}': ['p(95)<2000'],
    'error_rate': ['rate<0.05'],
    'http_req_failed': ['rate<0.05'],
  },
};

// Phase 1: Baseline
export function runBaseline() {
  const res = http.get(TARGET_URL, { tags: { phase: 'baseline' } });

  const isSuccess = check(res, {
    'baseline status is 200': (r) => r.status === 200,
  });

  baselineDuration.add(res.timings.duration);
  errorRate.add(!isSuccess);
  sleep(1);
}

// Phase 2: 1000 Users visiting within 15s
export function runSpike() {
  // Stagger start times slightly across the 15s window (0 to 14s) to simulate natural user arrival
  sleep(Math.random() * 14);

  const res = http.get(TARGET_URL, { tags: { phase: 'spike_1000_users' } });

  const isSuccess = check(res, {
    'spike status is 200': (r) => r.status === 200,
    // 'homepage has expected content': (r) => r.body.includes('QuickPizza'),
  });

  loadDuration.add(res.timings.duration);
  errorRate.add(!isSuccess);
  if (isSuccess) totalVisits.add(1);
}

// Summary hook to export HTML report and show terminal summary
export function handleSummary(data) {
  return {
    'k6report.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}