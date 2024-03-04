export async function sendRequest(url, method = 'GET', data = {}) {
  const params = Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
  const result = await fetch(url, {
    method,
    body: params || null,
    headers:
      method === 'GET'
        ? {}
        : {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
    credentials: 'include',
  });
  if (result.ok) {
    const text = await result.text();
    return text && JSON.parse(text);
  }
  const json = await result.json();
  throw json.Message;
}
