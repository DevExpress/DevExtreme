import ajax from 'devextreme/core/utils/ajax';
import { Deferred } from 'devextreme/core/utils/deferred';

const sendRequestOrig = ajax.sendRequest;
const fetchOrig = fetch;
let antiForgeryGettingPromise = null;

async function fetchAntiForgeryToken() {
  try {
    const response = await fetchOrig('https://js.devexpress.com/Demos/NetCore/api/Common/GetAntiForgeryToken', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-cache',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to retrieve anti-forgery token: ${errorMessage || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(errorMessage);
  }
}

async function getAntiForgeryTokenValue() {
  const tokenMeta = document.querySelector('meta[name="csrf-token"]');

  if (tokenMeta) {
    const headerName = tokenMeta.dataset.headerName || 'RequestVerificationToken';
    const token = tokenMeta.getAttribute('content') || '';

    return Promise.resolve({ headerName, token });
  }

  if (!antiForgeryGettingPromise) {
    antiForgeryGettingPromise = fetchAntiForgeryToken();
  }

  const tokenData = await antiForgeryGettingPromise;
  const meta = document.createElement('meta');

  meta.name = 'csrf-token';
  meta.content = tokenData.token;
  meta.dataset.headerName = tokenData.headerName;
  document.head.appendChild(meta);
  antiForgeryGettingPromise = null;

  return tokenData;
}

ajax.sendRequest = (options) => {
  const deferred = typeof Deferred !== 'undefined' ? new Deferred() : (() => {
    let resolve;
    let reject;
    // eslint-disable-next-line spellcheck/spell-checker
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise: () => promise, resolve, reject };
  })();

  getAntiForgeryTokenValue().then(({ headerName, token }) => {
    options.headers = {
      [headerName]: token,
      ...(options.headers || {}),
    };

    options.xhrFields = {
      withCredentials: true,
    };

    sendRequestOrig(options).then(
      (result) => {
        deferred.resolve(result);
        if (result.success) {
          deferred.resolve(result);
        } else {
          deferred.reject(result);
        }
      },
      (e) => deferred.reject(e),
    );
  });

  return deferred.promise();
};

window.fetch = async (url, options = {}) => {
  const { headerName, token } = await getAntiForgeryTokenValue();

  options.headers = {
    [headerName]: token,
    ...(options.headers || {}),
  };

  options.credentials = 'include';

  return fetchOrig(url, options);
};
