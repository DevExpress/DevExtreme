import CustomStore from '../js/data/custom_store';

const MOCK_BASE = 'https://js.devexpress.com/Demos/NetCore/';

// ---- Banner ----

function showBanner(): void {
    if (document.getElementById('dx-fake-server-banner')) return;
    const el = document.createElement('div');
    el.id = 'dx-fake-server-banner';
    el.style.cssText = [
        'position:fixed;top:0;left:0;right:0;z-index:99999',
        'background:#fff3cd;border-bottom:2px solid #e6a817',
        'color:#664d03;padding:5px 16px',
        'font:12px/1.6 -apple-system,BlinkMacSystemFont,sans-serif',
        'text-align:center;pointer-events:none',
    ].join(';');
    el.innerHTML = '&#9888;&nbsp;<b>Simulated server</b> &mdash; data is generated locally and changes are not persisted.';
    document.body.appendChild(el);
}

// ---- Mock data ----

const CUSTOMERS_LOOKUP = [
    { Value: 'ALFKI', Text: 'Alfreds Futterkiste' },
    { Value: 'ANATR', Text: 'Ana Trujillo' },
    { Value: 'ANTON', Text: 'Antonio Moreno' },
    { Value: 'AROUT', Text: 'Around the Horn' },
    { Value: 'BERGS', Text: 'Berglunds snabbköp' },
    { Value: 'BLAUS', Text: 'Blauer See Delikatessen' },
    { Value: 'BONAP', Text: "Bon app'" },
    { Value: 'BOTTM', Text: 'Bottom-Dollar Markets' },
    { Value: 'BSBEV', Text: "B's Beverages" },
    { Value: 'CACTU', Text: 'Cactus Comidas para llevar' },
];

const SHIPPERS_LOOKUP = [
    { Value: 1, Text: 'Speedy Express' },
    { Value: 2, Text: 'United Package' },
    { Value: 3, Text: 'Federal Shipping' },
];

const COUNTRIES = ['Germany', 'France', 'UK', 'USA', 'Brazil', 'Canada', 'Australia', 'Japan', 'Mexico', 'Spain'];

const ORDERS: any[] = Array.from({ length: 50 }, (_, i) => ({
    OrderID: 10000 + i,
    CustomerID: CUSTOMERS_LOOKUP[i % CUSTOMERS_LOOKUP.length].Value,
    OrderDate: new Date(2021, i % 12, (i % 28) + 1),
    Freight: Math.round(((i * 17.3 + 12.5) % 2000) * 100) / 100,
    ShipCountry: COUNTRIES[i % COUNTRIES.length],
    ShipVia: (i % 3) + 1,
}));

const ORDER_DETAILS: any[] = Array.from({ length: 80 }, (_, i) => ({
    OrderID: 10000 + (i % 50),
    ProductName: ['Widget A', 'Widget B', 'Gadget Pro', 'Device X', 'Component Y'][i % 5],
    UnitPrice: Math.round(((i * 4.7 + 5) % 200) * 100) / 100,
    Quantity: (i % 20) + 1,
    Discount: (i % 5) * 0.05,
}));

const TASK_EMPLOYEES = [
    { ID: 1, Name: 'John Heart' },
    { ID: 2, Name: 'Samantha Bright' },
    { ID: 3, Name: 'Arthur Miller' },
    { ID: 4, Name: 'Robert Reagan' },
    { ID: 5, Name: 'Greta Sims' },
];

const TASKS: any[] = [
    { Task_ID: 1, Task_Subject: 'Software Development', Task_Status: 'In Progress', Task_Priority: 'High', Task_Assigned_Employee_ID: 1, Task_Start_Date: '2021-04-01T00:00:00', Task_Due_Date: '2021-04-30T00:00:00', Task_Completion: 0.35, Task_Parent_ID: null, Has_Items: true },
    { Task_ID: 2, Task_Subject: 'Planning', Task_Status: 'Completed', Task_Priority: 'Normal', Task_Assigned_Employee_ID: 1, Task_Start_Date: '2021-04-01T00:00:00', Task_Due_Date: '2021-04-05T00:00:00', Task_Completion: 1, Task_Parent_ID: 1, Has_Items: false },
    { Task_ID: 3, Task_Subject: 'Back-end Development', Task_Status: 'In Progress', Task_Priority: 'High', Task_Assigned_Employee_ID: 2, Task_Start_Date: '2021-04-05T00:00:00', Task_Due_Date: '2021-04-20T00:00:00', Task_Completion: 0.6, Task_Parent_ID: 1, Has_Items: false },
    { Task_ID: 4, Task_Subject: 'Front-end Development', Task_Status: 'In Progress', Task_Priority: 'High', Task_Assigned_Employee_ID: 3, Task_Start_Date: '2021-04-10T00:00:00', Task_Due_Date: '2021-04-25T00:00:00', Task_Completion: 0.4, Task_Parent_ID: 1, Has_Items: false },
    { Task_ID: 5, Task_Subject: 'Testing', Task_Status: 'Not Started', Task_Priority: 'Urgent', Task_Assigned_Employee_ID: 4, Task_Start_Date: '2021-04-25T00:00:00', Task_Due_Date: '2021-04-30T00:00:00', Task_Completion: 0, Task_Parent_ID: 1, Has_Items: false },
    { Task_ID: 6, Task_Subject: 'Design', Task_Status: 'Completed', Task_Priority: 'Normal', Task_Assigned_Employee_ID: 5, Task_Start_Date: '2021-04-01T00:00:00', Task_Due_Date: '2021-04-10T00:00:00', Task_Completion: 1, Task_Parent_ID: null, Has_Items: false },
    { Task_ID: 7, Task_Subject: 'Infrastructure', Task_Status: 'Deferred', Task_Priority: 'Low', Task_Assigned_Employee_ID: 2, Task_Start_Date: '2021-04-15T00:00:00', Task_Due_Date: '2021-04-30T00:00:00', Task_Completion: 0.1, Task_Parent_ID: null, Has_Items: true },
    { Task_ID: 8, Task_Subject: 'Server Setup', Task_Status: 'Deferred', Task_Priority: 'Low', Task_Assigned_Employee_ID: 2, Task_Start_Date: '2021-04-15T00:00:00', Task_Due_Date: '2021-04-22T00:00:00', Task_Completion: 0, Task_Parent_ID: 7, Has_Items: false },
    { Task_ID: 9, Task_Subject: 'DB Configuration', Task_Status: 'Deferred', Task_Priority: 'Low', Task_Assigned_Employee_ID: 3, Task_Start_Date: '2021-04-20T00:00:00', Task_Due_Date: '2021-04-30T00:00:00', Task_Completion: 0, Task_Parent_ID: 7, Has_Items: false },
    { Task_ID: 10, Task_Subject: 'Documentation', Task_Status: 'Not Started', Task_Priority: 'Normal', Task_Assigned_Employee_ID: 5, Task_Start_Date: '2021-04-25T00:00:00', Task_Due_Date: '2021-04-30T00:00:00', Task_Completion: 0, Task_Parent_ID: null, Has_Items: false },
];

const APPOINTMENTS: any[] = [
    { AppointmentId: 1, Text: 'Website Redesign', StartDate: '2021-04-27T09:00:00Z', EndDate: '2021-04-27T11:30:00Z', AllDay: false, Description: 'Plan the new website layout' },
    { AppointmentId: 2, Text: 'Book Flights', StartDate: '2021-04-27T12:00:00Z', EndDate: '2021-04-27T13:00:00Z', AllDay: false, Description: '' },
    { AppointmentId: 3, Text: 'Install New Router', StartDate: '2021-04-27T14:30:00Z', EndDate: '2021-04-27T15:30:00Z', AllDay: false, Description: '' },
    { AppointmentId: 4, Text: 'Prepare Sales Presentation', StartDate: '2021-04-28T09:00:00Z', EndDate: '2021-04-28T12:00:00Z', AllDay: false, Description: 'Q2 results' },
    { AppointmentId: 5, Text: 'Team Meeting', StartDate: '2021-04-28T14:00:00Z', EndDate: '2021-04-28T15:00:00Z', AllDay: false, Description: '' },
    { AppointmentId: 6, Text: 'Code Review', StartDate: '2021-04-29T10:00:00Z', EndDate: '2021-04-29T12:00:00Z', AllDay: false, Description: '' },
    { AppointmentId: 7, Text: 'Deploy to Production', StartDate: '2021-04-30T09:00:00Z', EndDate: '2021-04-30T11:00:00Z', AllDay: false, Description: '' },
];

const DIAGRAM_EMPLOYEES: any[] = [
    { ID: 1, FullName: 'John Heart', Prefix: 'Mr.', Title: 'CEO', City: 'Los Angeles', State: 'CA', HireDate: '1995-01-15', HeadID: null },
    { ID: 2, FullName: 'Samantha Bright', Prefix: 'Dr.', Title: 'COO', City: 'Los Angeles', State: 'CA', HireDate: '2004-05-24', HeadID: 1 },
    { ID: 3, FullName: 'Arthur Miller', Prefix: 'Mr.', Title: 'CTO', City: 'Denver', State: 'CO', HireDate: '2011-02-01', HeadID: 1 },
    { ID: 4, FullName: 'Robert Reagan', Prefix: 'Mr.', Title: 'CMO', City: 'Bentonville', State: 'AR', HireDate: '2005-06-28', HeadID: 1 },
    { ID: 5, FullName: 'Greta Sims', Prefix: 'Ms.', Title: 'HR Manager', City: 'Los Angeles', State: 'CA', HireDate: '2009-04-14', HeadID: 2 },
    { ID: 6, FullName: 'Brett Wade', Prefix: 'Mr.', Title: 'IT Manager', City: 'Atlanta', State: 'GA', HireDate: '2009-03-06', HeadID: 3 },
    { ID: 7, FullName: 'Sandra Johnson', Prefix: 'Mrs.', Title: 'Controller', City: 'Los Angeles', State: 'CA', HireDate: '2005-05-11', HeadID: 2 },
    { ID: 8, FullName: 'Kevin Carter', Prefix: 'Mr.', Title: 'Sr. Developer', City: 'San Jose', State: 'CA', HireDate: '2009-09-11', HeadID: 6 },
    { ID: 9, FullName: 'Cynthia Stanwick', Prefix: 'Ms.', Title: 'Sr. Developer', City: 'San Jose', State: 'CA', HireDate: '2008-03-24', HeadID: 6 },
    { ID: 10, FullName: 'Kent Nelson', Prefix: 'Mr.', Title: 'Jr. Developer', City: 'Atlanta', State: 'GA', HireDate: '2012-07-09', HeadID: 6 },
];

const COLLABORATIVE_ROWS: any[] = Array.from({ length: 20 }, (_, i) => ({
    ID: i + 1,
    Name: `Item ${i + 1}`,
    Value: Math.round(Math.random() * 1000),
    Status: ['Active', 'Inactive', 'Pending'][i % 3],
}));

// ---- SignalR mock data ----

const STOCKS = ['MSFT', 'AAPL', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD', 'INTC', 'IBM', 'ORCL', 'SAP', 'CRM', 'ADBE', 'SNOW']
    .map((symbol, i) => {
        const base = 80 + i * 23.7;
        return { symbol, price: base, change: 0, percentChange: 0, dayOpen: base, dayMin: base * 0.97, dayMax: base * 1.03, lastUpdate: new Date() };
    });

function generateChartTicks(): any[] {
    const ticks = [];
    const now = Date.now();
    let price = 150;
    for (let i = 200; i >= 0; i--) {
        price += (Math.sin(i * 0.3) + (Math.random() - 0.5)) * 1.5;
        ticks.push({ date: new Date(now - i * 10000), price: Math.round(price * 100) / 100, volume: Math.floor(Math.random() * 10000 + 1000) });
    }
    return ticks;
}

const CHART_TICKS = generateChartTicks();

// ---- URL → data mapping ----

function getStoreData(loadUrl: string, method: string): any[] | null {
    if (loadUrl.includes('/DataGridWebApi/Orders')) return ORDERS;
    if (loadUrl.includes('/DataGridWebApi/CustomersLookup')) return CUSTOMERS_LOOKUP;
    if (loadUrl.includes('/DataGridWebApi/ShippersLookup')) return SHIPPERS_LOOKUP;
    if (loadUrl.includes('/DataGridWebApi/OrderDetails')) return ORDER_DETAILS;
    if (loadUrl.includes('/TreeListTasks/Tasks')) return TASKS;
    if (loadUrl.includes('/TreeListTasks/TaskEmployees')) return TASK_EMPLOYEES;
    if (loadUrl.includes('/SchedulerData') || loadUrl.includes('/SchedulerSignalR')) return APPOINTMENTS;
    if (loadUrl.includes('/DiagramEmployees/Employees')) return DIAGRAM_EMPLOYEES;
    if (loadUrl.includes('/DataGridCollaborativeEditing')) return COLLABORATIVE_ROWS;
    if (method === 'INSERT' || method === 'UPDATE' || method === 'DELETE') return [];
    return null;
}

function isMockUrl(url: string): boolean {
    return url.startsWith(MOCK_BASE);
}

// ---- Override AspNet.createStore ----

export function patchAspNetCreateStore(AspNet: any): void {
    const orig = AspNet.createStore.bind(AspNet);
    AspNet.createStore = function (options: any) {
        const loadUrl: string = options.loadUrl ?? options.url ?? '';
        if (!isMockUrl(loadUrl)) return orig(options);

        showBanner();

        const data = getStoreData(loadUrl, 'LOAD');
        if (data === null) return orig(options);

        return new CustomStore({
            key: options.key,
            load() {
                return Promise.resolve([...data]);
            },
            insert(values: any) {
                const maxId = data.reduce((m: any, r: any) => Math.max(m, r[options.key] ?? 0), 0);
                const item = { [options.key]: maxId + 1, ...values };
                data.push(item);
                return Promise.resolve(item);
            },
            update(key: any, values: any) {
                const idx = data.findIndex((r: any) => r[options.key] === key);
                if (idx !== -1) Object.assign(data[idx], values);
                return Promise.resolve(data[idx]);
            },
            remove(key: any) {
                const idx = data.findIndex((r: any) => r[options.key] === key);
                if (idx !== -1) data.splice(idx, 1);
                return Promise.resolve();
            },
        });
    };
}

// ---- Fake signalR ----

class FakeHubConnection {
    private _url: string;
    private _handlers = new Map<string, (...args: any[]) => void>();
    private _timers: ReturnType<typeof setInterval>[] = [];

    constructor(url: string) {
        this._url = url;
    }

    on(event: string, handler: (...args: any[]) => void): void {
        this._handlers.set(event, handler);
    }

    async invoke(method: string): Promise<any> {
        if (this._url.includes('liveUpdateSignalRHub') && method === 'getAllStocks') {
            return [...STOCKS];
        }
        if (this._url.includes('stockTickDataHub') && method === 'getAllData') {
            return [...CHART_TICKS];
        }
        return null;
    }

    async start(): Promise<void> {
        showBanner();

        if (this._url.includes('liveUpdateSignalRHub')) {
            this._timers.push(setInterval(() => {
                const stock = STOCKS[Math.floor(Math.random() * STOCKS.length)];
                const delta = (Math.random() - 0.48) * stock.price * 0.005;
                stock.price = Math.round((stock.price + delta) * 10000) / 10000;
                stock.change = Math.round((stock.price - stock.dayOpen) * 10000) / 10000;
                stock.percentChange = Math.round((stock.change / stock.dayOpen) * 1000000) / 10000;
                stock.dayMin = Math.min(stock.dayMin, stock.price);
                stock.dayMax = Math.max(stock.dayMax, stock.price);
                stock.lastUpdate = new Date();
                this._handlers.get('updateStockPrice')?.({ ...stock });
            }, 400));
        }

        if (this._url.includes('stockTickDataHub')) {
            this._timers.push(setInterval(() => {
                const last = CHART_TICKS[CHART_TICKS.length - 1];
                const delta = (Math.random() - 0.48) * 2;
                const tick = { date: new Date(), price: Math.round((last.price + delta) * 100) / 100, volume: Math.floor(Math.random() * 10000 + 1000) };
                CHART_TICKS.push(tick);
                this._handlers.get('updateStockPrice')?.({ ...tick });
            }, 1000));
        }
    }

    async stop(): Promise<void> {
        this._timers.forEach(clearInterval);
        this._timers = [];
    }
}

export function setupFakeSignalR(): void {
    (window as any).signalR = {
        HubConnectionBuilder: class {
            private _url = '';
            withUrl(url: string) { this._url = url; return this; }
            configureLogging() { return this; }
            build() { return new FakeHubConnection(this._url); }
        },
        HttpTransportType: { WebSockets: 1, LongPolling: 4, ServerSentEvents: 2 },
        LogLevel: { None: 0, Debug: 1, Information: 2, Warning: 3, Error: 4, Critical: 5 },
    };
}
