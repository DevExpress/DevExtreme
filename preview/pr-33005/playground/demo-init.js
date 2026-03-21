import { u as utils, a as alert, c as confirm, b as custom, f as formatDate, d as formatMessage, e as formatNumber, l as loadMessages, g as locale, p as parseDate, h as parseNumber, j as jQuery, r as registerGradient, i as registerPattern, R as RemoteFileSystemProvider, k as generateColors, m as currentPalette, n as registerPalette, o as getPalette, A as Ajax, q as repaint, t as notify, G as Guid, v as query, D as DataSource, C as CustomStore, w as ArrayStore, x as setTemplateEngine, y as configMethod, _ as __vitePreload, s as setLicenseCheckSkipCondition } from './assets/preload-helper-LFsGM7aE.js';

const getTimeZones = utils.getTimeZones;

/**
 * @name ui.dialog
 */

const dialog = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    alert,
    confirm,
    custom
}, Symbol.toStringTag, { value: 'Module' }));

const localization = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    formatDate,
    formatMessage,
    formatNumber,
    loadMessages,
    locale,
    parseDate,
    parseNumber
}, Symbol.toStringTag, { value: 'Module' }));

window.$ = window.jQuery = jQuery;
const AspNet = {
  createStore(options) {
    return new CustomStore({
      key: options.key,
      load: loadOptions => Ajax.sendRequest({
        url: options.loadUrl,
        method: 'GET',
        data: loadOptions,
        dataType: 'json'
      }),
      insert: options.insertUrl ? values => Ajax.sendRequest({
        url: options.insertUrl,
        method: 'POST',
        data: JSON.stringify(values),
        contentType: 'application/json',
        dataType: 'json'
      }) : undefined,
      update: options.updateUrl ? (key, values) => Ajax.sendRequest({
        url: options.updateUrl,
        method: 'PUT',
        data: JSON.stringify({
          key,
          values
        }),
        contentType: 'application/json',
        dataType: 'json'
      }) : undefined,
      remove: options.deleteUrl ? key => Ajax.sendRequest({
        url: options.deleteUrl,
        method: 'DELETE',
        data: JSON.stringify(key),
        contentType: 'application/json',
        dataType: 'json'
      }) : undefined
    });
  },
  sendRequest: options => Ajax.sendRequest(options)
};
window.DevExpress = {
  config: configMethod,
  setTemplateEngine,
  data: {
    ArrayStore,
    CustomStore,
    DataSource,
    query,
    Guid,
    AspNet
  },
  ui: {
    notify,
    dialog,
    repaintFloatingActionButton: repaint
  },
  localization,
  utils: {
    getTimeZones: getTimeZones,
    ajax: Ajax
  },
  viz: {
    getPalette,
    registerPalette,
    currentPalette,
    generateColors,
    map: {
      sources: {}
    }
  },
  fileManagement: {
    RemoteFileSystemProvider
  },
  common: {
    charts: {
      registerPattern,
      registerGradient
    }
  }
};
setLicenseCheckSkipCondition();
const themeLoaders = /* #__PURE__ */ Object.assign({"../artifacts/css/dx.carmine.compact.css": () => __vitePreload(() => import('./assets/dx.carmine.compact-YllJu5_J.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.carmine.css": () => __vitePreload(() => import('./assets/dx.carmine-C1YYn_Pr.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.common.css": () => __vitePreload(() => import('./assets/dx.common-Cph7l5t5.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.contrast.compact.css": () => __vitePreload(() => import('./assets/dx.contrast.compact-Bdix6ycS.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.contrast.css": () => __vitePreload(() => import('./assets/dx.contrast-CCJfr63A.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.dark.compact.css": () => __vitePreload(() => import('./assets/dx.dark.compact-O6E787Fw.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.dark.css": () => __vitePreload(() => import('./assets/dx.dark-DcMkMmJv.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkmoon.compact.css": () => __vitePreload(() => import('./assets/dx.darkmoon.compact-QaEi2_DF.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkmoon.css": () => __vitePreload(() => import('./assets/dx.darkmoon-CkY3vlwz.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkviolet.compact.css": () => __vitePreload(() => import('./assets/dx.darkviolet.compact-BP06fhf-.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkviolet.css": () => __vitePreload(() => import('./assets/dx.darkviolet-BUVSS95y.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.dark.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.dark.compact-BmKrEcsK.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.dark.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.dark-DPzmpIFd.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.light.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.light.compact-5EkRDMg7.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.light.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.light-DwYbJb6s.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.dark.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.dark.compact-D_zm3SEh.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.dark.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.dark-DaH3pB9D.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.light.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.light.compact-CHQH74Ou.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.light.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.light-C5tQaRIq.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.greenmist.compact.css": () => __vitePreload(() => import('./assets/dx.greenmist.compact-DNm8tlcv.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.greenmist.css": () => __vitePreload(() => import('./assets/dx.greenmist-CYyv6lLW.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.light.compact.css": () => __vitePreload(() => import('./assets/dx.light.compact-DxXnqUJb.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.light.css": () => __vitePreload(() => import('./assets/dx.light-DNFvzA8L.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.blue.dark.compact-D2SaaS3r.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.dark.css": () => __vitePreload(() => import('./assets/dx.material.blue.dark-LMYrcgv3.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.blue.light.compact-D-yGg2P5.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.light.css": () => __vitePreload(() => import('./assets/dx.material.blue.light-JGZJeQXZ.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.lime.dark.compact-DreUfwQE.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.dark.css": () => __vitePreload(() => import('./assets/dx.material.lime.dark-BIdf2ltL.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.lime.light.compact-BhZppYYb.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.light.css": () => __vitePreload(() => import('./assets/dx.material.lime.light-DwNfNtE3.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.orange.dark.compact-CsEKtEmX.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.dark.css": () => __vitePreload(() => import('./assets/dx.material.orange.dark-z32eD6ru.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.orange.light.compact-_L81zkS6.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.light.css": () => __vitePreload(() => import('./assets/dx.material.orange.light-_ROrgN8j.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.purple.dark.compact-B12LVY9h.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.dark.css": () => __vitePreload(() => import('./assets/dx.material.purple.dark-CHqDA5WC.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.purple.light.compact-BkB2Q6qf.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.light.css": () => __vitePreload(() => import('./assets/dx.material.purple.light-CHcMxH3e.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.teal.dark.compact-C6boEXn3.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.dark.css": () => __vitePreload(() => import('./assets/dx.material.teal.dark-leicWruz.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.teal.light.compact-rKSjL-pp.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.light.css": () => __vitePreload(() => import('./assets/dx.material.teal.light-IwM9xBmn.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.softblue.compact.css": () => __vitePreload(() => import('./assets/dx.softblue.compact-QiUNrA2R.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.softblue.css": () => __vitePreload(() => import('./assets/dx.softblue-CD3XC5nY.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"])


});
const themeId = localStorage.getItem('currentThemeId');
const themeKey = themeId ? Object.keys(themeLoaders).find(p => p.includes(`dx.${themeId}.css`)) : Object.keys(themeLoaders)[0];
if (themeKey) {
  const rawUrl = await themeLoaders[themeKey]();
  const url = new URL(rawUrl, import.meta.url).href;
  await new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}
