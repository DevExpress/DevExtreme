import { u as utils, a as alert, c as confirm, b as custom, f as formatDate, d as formatMessage, e as formatNumber, l as loadMessages, g as locale, p as parseDate, h as parseNumber, C as CustomStore, j as jQuery, r as registerGradient, i as registerPattern, R as RemoteFileSystemProvider, k as generateColors, m as currentPalette, n as registerPalette, o as getPalette, A as Ajax, q as repaint, t as notify, G as Guid, v as query, D as DataSource, w as ArrayStore, x as setTemplateEngine, y as configMethod, _ as __vitePreload, s as setLicenseCheckSkipCondition } from './assets/preload-helper-CkkjtEfI.js';

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

const MOCK_BASE = 'https://js.devexpress.com/Demos/NetCore/';
const SETTINGS_KEY = 'dx-fake-server-settings';

// ---- Settings ----

const DELAY_STEPS = [0, 50, 100, 300, 1000, 3000, 10000];
const INTERVAL_STEPS = [100, 200, 400, 1000, 2000, 5000];
function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null') ?? {
      delay: 0,
      interval: 400
    };
  } catch {
    return {
      delay: 0,
      interval: 400
    };
  }
}
function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
function formatMs(ms) {
  if (ms === 0) return 'instant';
  if (ms >= 1000) return `${ms / 1000}s`;
  return `${ms}ms`;
}
function delayedResolve(value) {
  const ms = getSettings().delay;
  if (ms === 0) return Promise.resolve(value);
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// ---- Banner ----

function makeSlider(labelText, steps, initialIdx, onChange) {
  const container = document.createElement('label');
  container.style.cssText = 'display:flex;flex-direction:column;gap:3px;';
  const lbl = document.createElement('span');
  const valSpan = document.createElement('b');
  valSpan.textContent = formatMs(steps[initialIdx]);
  lbl.appendChild(document.createTextNode(`${labelText}: `));
  lbl.appendChild(valSpan);
  const input = document.createElement('input');
  input.type = 'range';
  input.min = '0';
  input.max = String(steps.length - 1);
  input.step = '1';
  input.value = String(initialIdx);
  input.style.cssText = 'width:100%;accent-color:#c8a000;';
  input.oninput = () => {
    const v = steps[parseInt(input.value)];
    valSpan.textContent = formatMs(v);
    onChange(v);
  };
  container.appendChild(lbl);
  container.appendChild(input);
  return container;
}
function showBanner() {
  if (document.getElementById('dx-fake-server-banner')) return;
  const s = getSettings();
  const delayIdx = Math.max(0, DELAY_STEPS.indexOf(s.delay));
  const intervalIdx = Math.max(0, INTERVAL_STEPS.indexOf(s.interval));
  const wrap = document.createElement('div');
  wrap.id = 'dx-fake-server-banner';
  wrap.style.cssText = ['position:fixed;top:0;left:0;right:0;z-index:99999', 'font:12px/1.5 -apple-system,BlinkMacSystemFont,sans-serif', 'box-shadow:0 2px 6px rgba(0,0,0,0.12)'].join(';');
  const bar = document.createElement('div');
  bar.style.cssText = 'background:#fff3cd;border-bottom:1px solid #e6a817;color:#664d03;padding:5px 12px;display:flex;align-items:center;gap:8px;';
  const msg = document.createElement('span');
  msg.style.flex = '1';
  msg.innerHTML = '&#9888;&nbsp;<b>Simulated server</b> &mdash; data is generated locally, changes are not persisted.';
  const toggleBtn = document.createElement('button');
  toggleBtn.style.cssText = 'background:none;border:1px solid #c8a000;border-radius:3px;color:#664d03;cursor:pointer;font-size:11px;padding:2px 8px;line-height:1.4;';
  toggleBtn.textContent = '⚙ Settings';
  bar.appendChild(msg);
  bar.appendChild(toggleBtn);
  const panel = document.createElement('div');
  panel.style.cssText = ['display:none;background:#fffbe6;border-bottom:2px solid #e6a817', 'color:#664d03;padding:8px 16px', 'grid-template-columns:1fr 1fr;gap:6px 24px'].join(';');
  panel.appendChild(makeSlider('Response delay', DELAY_STEPS, delayIdx, v => saveSettings({
    ...getSettings(),
    delay: v
  })));
  panel.appendChild(makeSlider('Update interval', INTERVAL_STEPS, intervalIdx, v => saveSettings({
    ...getSettings(),
    interval: v
  })));
  toggleBtn.onclick = () => {
    panel.style.display = panel.style.display === 'none' ? 'grid' : 'none';
  };
  wrap.appendChild(bar);
  wrap.appendChild(panel);
  document.body.appendChild(wrap);
}

// ---- Mock data ----

const CUSTOMERS_LOOKUP = [{
  Value: 'ALFKI',
  Text: 'Alfreds Futterkiste'
}, {
  Value: 'ANATR',
  Text: 'Ana Trujillo'
}, {
  Value: 'ANTON',
  Text: 'Antonio Moreno'
}, {
  Value: 'AROUT',
  Text: 'Around the Horn'
}, {
  Value: 'BERGS',
  Text: 'Berglunds snabbköp'
}, {
  Value: 'BLAUS',
  Text: 'Blauer See Delikatessen'
}, {
  Value: 'BONAP',
  Text: "Bon app'"
}, {
  Value: 'BOTTM',
  Text: 'Bottom-Dollar Markets'
}, {
  Value: 'BSBEV',
  Text: "B's Beverages"
}, {
  Value: 'CACTU',
  Text: 'Cactus Comidas para llevar'
}];
const SHIPPERS_LOOKUP = [{
  Value: 1,
  Text: 'Speedy Express'
}, {
  Value: 2,
  Text: 'United Package'
}, {
  Value: 3,
  Text: 'Federal Shipping'
}];
const COUNTRIES = ['Germany', 'France', 'UK', 'USA', 'Brazil', 'Canada', 'Australia', 'Japan', 'Mexico', 'Spain'];
const ORDERS = Array.from({
  length: 50
}, (_, i) => ({
  OrderID: 10000 + i,
  CustomerID: CUSTOMERS_LOOKUP[i % CUSTOMERS_LOOKUP.length].Value,
  OrderDate: new Date(2021, i % 12, i % 28 + 1),
  Freight: Math.round((i * 17.3 + 12.5) % 2000 * 100) / 100,
  ShipCountry: COUNTRIES[i % COUNTRIES.length],
  ShipVia: i % 3 + 1
}));
const ORDER_DETAILS = Array.from({
  length: 80
}, (_, i) => ({
  OrderID: 10000 + i % 50,
  ProductName: ['Widget A', 'Widget B', 'Gadget Pro', 'Device X', 'Component Y'][i % 5],
  UnitPrice: Math.round((i * 4.7 + 5) % 200 * 100) / 100,
  Quantity: i % 20 + 1,
  Discount: i % 5 * 0.05
}));
const TASK_EMPLOYEES = [{
  ID: 1,
  Name: 'John Heart'
}, {
  ID: 2,
  Name: 'Samantha Bright'
}, {
  ID: 3,
  Name: 'Arthur Miller'
}, {
  ID: 4,
  Name: 'Robert Reagan'
}, {
  ID: 5,
  Name: 'Greta Sims'
}];
const TASKS = [{
  Task_ID: 1,
  Task_Subject: 'Software Development',
  Task_Status: 'In Progress',
  Task_Priority: 'High',
  Task_Assigned_Employee_ID: 1,
  Task_Start_Date: '2021-04-01T00:00:00',
  Task_Due_Date: '2021-04-30T00:00:00',
  Task_Completion: 0.35,
  Task_Parent_ID: null,
  Has_Items: true
}, {
  Task_ID: 2,
  Task_Subject: 'Planning',
  Task_Status: 'Completed',
  Task_Priority: 'Normal',
  Task_Assigned_Employee_ID: 1,
  Task_Start_Date: '2021-04-01T00:00:00',
  Task_Due_Date: '2021-04-05T00:00:00',
  Task_Completion: 1,
  Task_Parent_ID: 1,
  Has_Items: false
}, {
  Task_ID: 3,
  Task_Subject: 'Back-end Development',
  Task_Status: 'In Progress',
  Task_Priority: 'High',
  Task_Assigned_Employee_ID: 2,
  Task_Start_Date: '2021-04-05T00:00:00',
  Task_Due_Date: '2021-04-20T00:00:00',
  Task_Completion: 0.6,
  Task_Parent_ID: 1,
  Has_Items: false
}, {
  Task_ID: 4,
  Task_Subject: 'Front-end Development',
  Task_Status: 'In Progress',
  Task_Priority: 'High',
  Task_Assigned_Employee_ID: 3,
  Task_Start_Date: '2021-04-10T00:00:00',
  Task_Due_Date: '2021-04-25T00:00:00',
  Task_Completion: 0.4,
  Task_Parent_ID: 1,
  Has_Items: false
}, {
  Task_ID: 5,
  Task_Subject: 'Testing',
  Task_Status: 'Not Started',
  Task_Priority: 'Urgent',
  Task_Assigned_Employee_ID: 4,
  Task_Start_Date: '2021-04-25T00:00:00',
  Task_Due_Date: '2021-04-30T00:00:00',
  Task_Completion: 0,
  Task_Parent_ID: 1,
  Has_Items: false
}, {
  Task_ID: 6,
  Task_Subject: 'Design',
  Task_Status: 'Completed',
  Task_Priority: 'Normal',
  Task_Assigned_Employee_ID: 5,
  Task_Start_Date: '2021-04-01T00:00:00',
  Task_Due_Date: '2021-04-10T00:00:00',
  Task_Completion: 1,
  Task_Parent_ID: null,
  Has_Items: false
}, {
  Task_ID: 7,
  Task_Subject: 'Infrastructure',
  Task_Status: 'Deferred',
  Task_Priority: 'Low',
  Task_Assigned_Employee_ID: 2,
  Task_Start_Date: '2021-04-15T00:00:00',
  Task_Due_Date: '2021-04-30T00:00:00',
  Task_Completion: 0.1,
  Task_Parent_ID: null,
  Has_Items: true
}, {
  Task_ID: 8,
  Task_Subject: 'Server Setup',
  Task_Status: 'Deferred',
  Task_Priority: 'Low',
  Task_Assigned_Employee_ID: 2,
  Task_Start_Date: '2021-04-15T00:00:00',
  Task_Due_Date: '2021-04-22T00:00:00',
  Task_Completion: 0,
  Task_Parent_ID: 7,
  Has_Items: false
}, {
  Task_ID: 9,
  Task_Subject: 'DB Configuration',
  Task_Status: 'Deferred',
  Task_Priority: 'Low',
  Task_Assigned_Employee_ID: 3,
  Task_Start_Date: '2021-04-20T00:00:00',
  Task_Due_Date: '2021-04-30T00:00:00',
  Task_Completion: 0,
  Task_Parent_ID: 7,
  Has_Items: false
}, {
  Task_ID: 10,
  Task_Subject: 'Documentation',
  Task_Status: 'Not Started',
  Task_Priority: 'Normal',
  Task_Assigned_Employee_ID: 5,
  Task_Start_Date: '2021-04-25T00:00:00',
  Task_Due_Date: '2021-04-30T00:00:00',
  Task_Completion: 0,
  Task_Parent_ID: null,
  Has_Items: false
}];
const APPOINTMENTS = [{
  AppointmentId: 1,
  Text: 'Website Redesign',
  StartDate: '2021-04-27T09:00:00Z',
  EndDate: '2021-04-27T11:30:00Z',
  AllDay: false,
  Description: 'Plan the new website layout'
}, {
  AppointmentId: 2,
  Text: 'Book Flights',
  StartDate: '2021-04-27T12:00:00Z',
  EndDate: '2021-04-27T13:00:00Z',
  AllDay: false,
  Description: ''
}, {
  AppointmentId: 3,
  Text: 'Install New Router',
  StartDate: '2021-04-27T14:30:00Z',
  EndDate: '2021-04-27T15:30:00Z',
  AllDay: false,
  Description: ''
}, {
  AppointmentId: 4,
  Text: 'Prepare Sales Presentation',
  StartDate: '2021-04-28T09:00:00Z',
  EndDate: '2021-04-28T12:00:00Z',
  AllDay: false,
  Description: 'Q2 results'
}, {
  AppointmentId: 5,
  Text: 'Team Meeting',
  StartDate: '2021-04-28T14:00:00Z',
  EndDate: '2021-04-28T15:00:00Z',
  AllDay: false,
  Description: ''
}, {
  AppointmentId: 6,
  Text: 'Code Review',
  StartDate: '2021-04-29T10:00:00Z',
  EndDate: '2021-04-29T12:00:00Z',
  AllDay: false,
  Description: ''
}, {
  AppointmentId: 7,
  Text: 'Deploy to Production',
  StartDate: '2021-04-30T09:00:00Z',
  EndDate: '2021-04-30T11:00:00Z',
  AllDay: false,
  Description: ''
}];
const DIAGRAM_EMPLOYEES = [{
  ID: 1,
  FullName: 'John Heart',
  Prefix: 'Mr.',
  Title: 'CEO',
  City: 'Los Angeles',
  State: 'CA',
  HireDate: '1995-01-15',
  HeadID: null
}, {
  ID: 2,
  FullName: 'Samantha Bright',
  Prefix: 'Dr.',
  Title: 'COO',
  City: 'Los Angeles',
  State: 'CA',
  HireDate: '2004-05-24',
  HeadID: 1
}, {
  ID: 3,
  FullName: 'Arthur Miller',
  Prefix: 'Mr.',
  Title: 'CTO',
  City: 'Denver',
  State: 'CO',
  HireDate: '2011-02-01',
  HeadID: 1
}, {
  ID: 4,
  FullName: 'Robert Reagan',
  Prefix: 'Mr.',
  Title: 'CMO',
  City: 'Bentonville',
  State: 'AR',
  HireDate: '2005-06-28',
  HeadID: 1
}, {
  ID: 5,
  FullName: 'Greta Sims',
  Prefix: 'Ms.',
  Title: 'HR Manager',
  City: 'Los Angeles',
  State: 'CA',
  HireDate: '2009-04-14',
  HeadID: 2
}, {
  ID: 6,
  FullName: 'Brett Wade',
  Prefix: 'Mr.',
  Title: 'IT Manager',
  City: 'Atlanta',
  State: 'GA',
  HireDate: '2009-03-06',
  HeadID: 3
}, {
  ID: 7,
  FullName: 'Sandra Johnson',
  Prefix: 'Mrs.',
  Title: 'Controller',
  City: 'Los Angeles',
  State: 'CA',
  HireDate: '2005-05-11',
  HeadID: 2
}, {
  ID: 8,
  FullName: 'Kevin Carter',
  Prefix: 'Mr.',
  Title: 'Sr. Developer',
  City: 'San Jose',
  State: 'CA',
  HireDate: '2009-09-11',
  HeadID: 6
}, {
  ID: 9,
  FullName: 'Cynthia Stanwick',
  Prefix: 'Ms.',
  Title: 'Sr. Developer',
  City: 'San Jose',
  State: 'CA',
  HireDate: '2008-03-24',
  HeadID: 6
}, {
  ID: 10,
  FullName: 'Kent Nelson',
  Prefix: 'Mr.',
  Title: 'Jr. Developer',
  City: 'Atlanta',
  State: 'GA',
  HireDate: '2012-07-09',
  HeadID: 6
}];
const PRODUCT_CATEGORIES = ['Beverages', 'Condiments', 'Confections', 'Dairy Products', 'Grains/Cereals', 'Meat/Poultry', 'Produce', 'Seafood'];
const PRODUCT_NAMES = ['Chai', 'Chang', 'Aniseed Syrup', 'Chef Anton\'s Cajun Seasoning', 'Grandma\'s Boysenberry Spread', 'Uncle Bob\'s Organic Dried Pears', 'Queso Cabrales', 'Queso Manchego La Pastora', 'Konbu', 'Tofu', 'Genen Shouyu', 'Pavlova', 'Alice Mutton', 'Carnarvon Tigers', 'Teatime Chocolate Biscuits', 'Sir Rodney\'s Marmalade', 'Sir Rodney\'s Scones', 'Gustaf\'s Knäckebröd', 'Tunnbröd', 'Guaraná Fantástica'];
const LIST_DATA = PRODUCT_NAMES.map((name, i) => ({
  ProductID: i + 1,
  ProductName: name,
  UnitPrice: Math.round(((i * 3.7 + 8) % 150 + 5) * 100) / 100,
  Category: {
    CategoryName: PRODUCT_CATEGORIES[i % PRODUCT_CATEGORIES.length]
  },
  UnitsInStock: (i * 7 + 3) % 120
}));
const COLLABORATIVE_ROWS = Array.from({
  length: 20
}, (_, i) => ({
  ID: i + 1,
  Name: `Item ${i + 1}`,
  Value: Math.round(Math.random() * 1000),
  Status: ['Active', 'Inactive', 'Pending'][i % 3]
}));

// ---- SignalR mock data ----

const STOCKS = ['MSFT', 'AAPL', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'INTC', 'IBM', 'ORCL', 'SAP', 'CRM', 'ADBE', 'SNOW'].map((symbol, i) => {
  const base = 80 + i * 23.7;
  return {
    symbol,
    price: base,
    change: 0,
    percentChange: 0,
    dayOpen: base,
    dayMin: base * 0.97,
    dayMax: base * 1.03,
    lastUpdate: new Date()
  };
});
function generateChartTicks() {
  const ticks = [];
  const now = Date.now();
  let price = 150;
  for (let i = 200; i >= 0; i--) {
    price += (Math.sin(i * 0.3) + (Math.random() - 0.5)) * 1.5;
    ticks.push({
      date: new Date(now - i * 10000).toISOString(),
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 10000 + 1000)
    });
  }
  return ticks;
}
const CHART_TICKS = generateChartTicks();

// ---- URL → data mapping ----

function getStoreData(loadUrl, method) {
  if (loadUrl.includes('/DataGridWebApi/Orders')) return ORDERS;
  if (loadUrl.includes('/DataGridWebApi/CustomersLookup')) return CUSTOMERS_LOOKUP;
  if (loadUrl.includes('/DataGridWebApi/ShippersLookup')) return SHIPPERS_LOOKUP;
  if (loadUrl.includes('/DataGridWebApi/OrderDetails')) return ORDER_DETAILS;
  if (loadUrl.includes('/TreeListTasks/Tasks')) return TASKS;
  if (loadUrl.includes('/TreeListTasks/TaskEmployees')) return TASK_EMPLOYEES;
  if (loadUrl.includes('/SchedulerData') || loadUrl.includes('/SchedulerSignalR')) return APPOINTMENTS;
  if (loadUrl.includes('/DiagramEmployees/Employees')) return DIAGRAM_EMPLOYEES;
  if (loadUrl.includes('/DataGridCollaborativeEditing')) return COLLABORATIVE_ROWS;
  if (loadUrl.includes('/api/ListData')) return LIST_DATA;
  return null;
}
function isMockUrl(url) {
  return url.startsWith(MOCK_BASE);
}

// ---- Override AspNet.createStore ----

function patchAspNetCreateStore(AspNet) {
  const orig = AspNet.createStore.bind(AspNet);
  AspNet.createStore = function (options) {
    const loadUrl = options.loadUrl ?? options.url ?? '';
    if (!isMockUrl(loadUrl)) return orig(options);
    showBanner();
    const data = getStoreData(loadUrl);
    if (data === null) return orig(options);
    return new CustomStore({
      key: options.key,
      load() {
        return delayedResolve({
          data: [...data],
          totalCount: data.length
        });
      },
      insert(values) {
        const maxId = data.reduce((m, r) => Math.max(m, r[options.key] ?? 0), 0);
        const item = {
          [options.key]: maxId + 1,
          ...values
        };
        data.push(item);
        return delayedResolve(item);
      },
      update(key, values) {
        const idx = data.findIndex(r => r[options.key] === key);
        if (idx !== -1) Object.assign(data[idx], values);
        return delayedResolve(data[idx]);
      },
      remove(key) {
        const idx = data.findIndex(r => r[options.key] === key);
        if (idx !== -1) data.splice(idx, 1);
        return delayedResolve(undefined);
      }
    });
  };
}

// ---- Fake signalR ----

class FakeHubConnection {
  constructor(url) {
    this._url = url;
    this._handlers = new Map();
    this._timers = [];
  }
  on(event, handler) {
    this._handlers.set(event, handler);
  }
  async invoke(method) {
    const ms = getSettings().delay;
    const wait = ms > 0 ? new Promise(r => setTimeout(r, ms)) : Promise.resolve();
    await wait;
    if (this._url.includes('liveUpdateSignalRHub') && method === 'getAllStocks') {
      return [...STOCKS];
    }
    if (this._url.includes('stockTickDataHub') && method === 'getAllData') {
      return [...CHART_TICKS];
    }
    return null;
  }
  async start() {
    showBanner();
    if (this._url.includes('liveUpdateSignalRHub')) {
      const tick = () => {
        const stock = STOCKS[Math.floor(Math.random() * STOCKS.length)];
        const delta = (Math.random() - 0.48) * stock.price * 0.005;
        stock.price = Math.round((stock.price + delta) * 10000) / 10000;
        stock.change = Math.round((stock.price - stock.dayOpen) * 10000) / 10000;
        stock.percentChange = Math.round(stock.change / stock.dayOpen * 1000000) / 10000;
        stock.dayMin = Math.min(stock.dayMin, stock.price);
        stock.dayMax = Math.max(stock.dayMax, stock.price);
        stock.lastUpdate = new Date();
        this._handlers.get('updateStockPrice')?.({
          ...stock
        });
        this._timers.push(setTimeout(tick, getSettings().interval));
      };
      this._timers.push(setTimeout(tick, getSettings().interval));
    }
    if (this._url.includes('stockTickDataHub')) {
      const tick = () => {
        const last = CHART_TICKS[CHART_TICKS.length - 1];
        const delta = (Math.random() - 0.48) * 2;
        const item = {
          date: new Date().toISOString(),
          price: Math.round((last.price + delta) * 100) / 100,
          volume: Math.floor(Math.random() * 10000 + 1000)
        };
        CHART_TICKS.push(item);
        this._handlers.get('updateStockPrice')?.({
          ...item
        });
        this._timers.push(setTimeout(tick, getSettings().interval));
      };
      this._timers.push(setTimeout(tick, getSettings().interval));
    }
  }
  async stop() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
  }
}
function setupFakeSignalR() {
  window.signalR = {
    HubConnectionBuilder: class {
      _url = '';
      withUrl(url) {
        this._url = url;
        return this;
      }
      configureLogging() {
        return this;
      }
      build() {
        return new FakeHubConnection(this._url);
      }
    },
    HttpTransportType: {
      WebSockets: 1,
      LongPolling: 4,
      ServerSentEvents: 2
    },
    LogLevel: {
      None: 0,
      Debug: 1,
      Information: 2,
      Warning: 3,
      Error: 4,
      Critical: 5
    }
  };
}

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
patchAspNetCreateStore(AspNet);
setupFakeSignalR();
function AiIntegrationStub(_options) {
  const noop = () => Promise.resolve(null);
  const methods = ['changeStyle', 'changeTone', 'execute', 'expand', 'proofread', 'shorten', 'summarize', 'translate', 'smartPaste', 'generateGridColumn', 'dispose'];
  const inst = {
    ...Object.fromEntries(methods.map(m => [m, noop]))
  };
  return inst;
}
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
  },
  aiIntegration: AiIntegrationStub
};
setLicenseCheckSkipCondition();
const themeLoaders = /* #__PURE__ */ Object.assign({"../artifacts/css/dx.carmine.compact.css": () => __vitePreload(() => import('./assets/dx.carmine.compact-Co4eXqJ4.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.carmine.css": () => __vitePreload(() => import('./assets/dx.carmine-lZ7yUyn0.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.common.css": () => __vitePreload(() => import('./assets/dx.common-Cph7l5t5.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.contrast.compact.css": () => __vitePreload(() => import('./assets/dx.contrast.compact-rouAuB7h.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.contrast.css": () => __vitePreload(() => import('./assets/dx.contrast-DTRqsmdb.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.dark.compact.css": () => __vitePreload(() => import('./assets/dx.dark.compact-BlWQb7er.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.dark.css": () => __vitePreload(() => import('./assets/dx.dark-BhSYHhGe.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkmoon.compact.css": () => __vitePreload(() => import('./assets/dx.darkmoon.compact-BIsNxxvE.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkmoon.css": () => __vitePreload(() => import('./assets/dx.darkmoon-CDPhLRmN.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkviolet.compact.css": () => __vitePreload(() => import('./assets/dx.darkviolet.compact-CNPWLLnK.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.darkviolet.css": () => __vitePreload(() => import('./assets/dx.darkviolet-DwB9tMHB.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.dark.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.dark.compact-2gEyyMgg.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.dark.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.dark-Cv4VORWD.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.light.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.light.compact-sQ4tv7hj.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.blue.light.css": () => __vitePreload(() => import('./assets/dx.fluent.blue.light-DZrXehi_.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.dark.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.dark.compact-BhoUKl4j.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.dark.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.dark-B_Yi6vFV.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.light.compact.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.light.compact-XSm84tru.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.fluent.saas.light.css": () => __vitePreload(() => import('./assets/dx.fluent.saas.light-rmbiZ00y.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.greenmist.compact.css": () => __vitePreload(() => import('./assets/dx.greenmist.compact-uvSQBK7a.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.greenmist.css": () => __vitePreload(() => import('./assets/dx.greenmist-CTHovVNW.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.light.compact.css": () => __vitePreload(() => import('./assets/dx.light.compact-CSAowon0.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.light.css": () => __vitePreload(() => import('./assets/dx.light-Dc_kNY-w.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.blue.dark.compact-BF2FbF_I.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.dark.css": () => __vitePreload(() => import('./assets/dx.material.blue.dark-DMUOSwXe.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.blue.light.compact-BfykrI-2.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.blue.light.css": () => __vitePreload(() => import('./assets/dx.material.blue.light-6cn2VNme.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.lime.dark.compact-1MlVvBzv.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.dark.css": () => __vitePreload(() => import('./assets/dx.material.lime.dark-BJx-PYJ0.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.lime.light.compact-DCyVKKNC.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.lime.light.css": () => __vitePreload(() => import('./assets/dx.material.lime.light-Cb1ALek_.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.orange.dark.compact-DMPpAH5A.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.dark.css": () => __vitePreload(() => import('./assets/dx.material.orange.dark-CWCnX5CO.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.orange.light.compact-D4qL04lj.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.orange.light.css": () => __vitePreload(() => import('./assets/dx.material.orange.light-CA6rrPIS.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.purple.dark.compact-CnahDUZ1.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.dark.css": () => __vitePreload(() => import('./assets/dx.material.purple.dark-CbLsP2jA.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.purple.light.compact-YO2bN_ij.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.purple.light.css": () => __vitePreload(() => import('./assets/dx.material.purple.light-Dn2SUKKe.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.dark.compact.css": () => __vitePreload(() => import('./assets/dx.material.teal.dark.compact-BQTSjJZc.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.dark.css": () => __vitePreload(() => import('./assets/dx.material.teal.dark-CsutK9Al.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.light.compact.css": () => __vitePreload(() => import('./assets/dx.material.teal.light.compact-DSMKciL5.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.material.teal.light.css": () => __vitePreload(() => import('./assets/dx.material.teal.light-DsVRQkOB.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.softblue.compact.css": () => __vitePreload(() => import('./assets/dx.softblue.compact-UzSe_nOR.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"]),"../artifacts/css/dx.softblue.css": () => __vitePreload(() => import('./assets/dx.softblue-Dsl9LNjW.js'),true              ?[]:void 0,import.meta.url).then(m => m["default"])


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
