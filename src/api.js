export async function shortenUrl(data) {
  return fetch('http://localhost:5000/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function fetchStats() {
  return fetch('http://localhost:5000/stats').then(res => res.json());
} 