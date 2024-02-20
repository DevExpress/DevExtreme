function setCookie(name, value, options = {}) {
  let { expires } = options;

  if (typeof expires === 'number' && expires) {
    const d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    options.expires = d;
    expires = options.expires;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  let updatedCookie = `${name}=${encodeURIComponent(value)}`;

  Object.keys(options).forEach((propName) => {
    updatedCookie += `; ${propName}`;
    const propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += `=${propValue}`;
    }
  });

  document.cookie = updatedCookie;
}

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

const GROUP_ID_KEY = 'dx-SchedulerSignalRHub-groupId';
if (document.cookie.indexOf(`${GROUP_ID_KEY}=`) < 0) {
  setCookie(GROUP_ID_KEY, randomInteger(1, 1000000), {
    expires: 365 * 24 * 60 * 1000,
    path: '/',
  });
}
