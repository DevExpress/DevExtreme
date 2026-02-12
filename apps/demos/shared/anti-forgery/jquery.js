/* global $, DevExpress */
const orig$ = $;
const ajaxSendRequestOrig = DevExpress.utils.ajax.sendRequest;
let ANTI_FORGERY_SETTING_PROMISE = null;
  
function fetchAntiForgeryToken() {
  const d = orig$.Deferred();

  orig$.ajax({
    url: 'https://js.devexpress.com/Demos/NetCore/api/Common/GetAntiForgeryToken',
    method: 'GET',
    xhrFields: { withCredentials: true },
    cache: false,
  }).done((data) => {
    d.resolve(data);
  }).fail((xhr) => {
    const error = xhr.responseJSON?.message || xhr.statusText || 'Unknown error';
    d.reject(new Error(`Failed to retrieve anti-forgery token: ${error}`));
  });
  
  return d.promise();
}

function getAntiForgeryTokenValue() {
  const tokenMeta = document.querySelector('meta[name="csrf-token"]');
  if (tokenMeta) {
    const headerName = tokenMeta.dataset.headerName || 'RequestVerificationToken';
    const token = tokenMeta.getAttribute('content');
    return orig$.Deferred().resolve({ headerName, token });
  }

  return fetchAntiForgeryToken().then((tokenData) => {
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = tokenData.token;
    meta.dataset.headerName = tokenData.headerName;
    document.head.appendChild(meta);
    return tokenData;
  });
}

async function setAntiForgery() {
  const originalAjax = orig$.ajax;
  const tokenData = await getAntiForgeryTokenValue();

  // eslint-disable-next-line no-global-assign
  $ = orig$;
  ANTI_FORGERY_SETTING_PROMISE = null;
  
  $.ajax = (url, options) => {
    if (typeof url !== 'string') {
      // eslint-disable-next-line no-param-reassign
      options = url;
    } else {
      options.url = url;
    }

    options.headers = { [tokenData.headerName]: tokenData.token, ...(options.headers || {}) };
    options.xhrFields = { withCredentials: true, ...(options.xhrFields || {}) };

    return originalAjax.call(this, options);
  };

  DevExpress.utils.ajax.sendRequest = (options) => {
    options.headers = {
      [tokenData.headerName]: tokenData.token,
      ...(options.headers || {}),
    };

    options.xhrFields = {
      withCredentials: true,
      ...(options.xhrFields || {}),
    };

    return ajaxSendRequestOrig(options);
  };
}

// eslint-disable-next-line no-global-assign
$ = (...args) => orig$(async () => {
  if(!ANTI_FORGERY_SETTING_PROMISE) {
    ANTI_FORGERY_SETTING_PROMISE = setAntiForgery();
  }
  
  await ANTI_FORGERY_SETTING_PROMISE;

  return $(...args);
});
