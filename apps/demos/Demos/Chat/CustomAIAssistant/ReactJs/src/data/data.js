export const titles = ['Mr.', 'Mrs.', 'Ms.'];
export const states = ['California', 'New York', 'Texas'];
export const positions = ['CEO', 'Sales Assistant', 'CMO', 'Manager', 'Designer', 'Developer'];
export const colors = {
  High: '#F1BBBC',
  Normal: '#F9E2AE',
  Low: '#9FD89F',
};
export const employee = {
  ID: 1,
  Prefix: 'Mr.',
  FirstName: 'John',
  LastName: 'Heart',
  Position: 'CEO',
  State: 'California',
  BirthDate: '1964/03/16',
};
export const tasks = [
  {
    ID: 5,
    Subject: 'Choose between PPO and HMO Health Plan',
    StartDate: '2026/02/15',
    DueDate: '2026/04/15',
    Status: 'In Progress',
    Priority: 'Low',
    Completion: 75,
    EmployeeID: 1,
  },
  {
    ID: 6,
    Subject: 'Google AdWords Strategy',
    StartDate: '2026/02/16',
    DueDate: '2026/02/28',
    Status: 'Completed',
    Priority: 'High',
    Completion: 100,
    EmployeeID: 1,
  },
  {
    ID: 7,
    Subject: 'New Brochures',
    StartDate: '2026/02/17',
    DueDate: '2026/02/24',
    Status: 'Completed',
    Priority: 'Normal',
    Completion: 100,
    EmployeeID: 1,
  },
  {
    ID: 22,
    Subject: 'Update NDA Agreement',
    StartDate: '2026/03/14',
    DueDate: '2026/03/16',
    Status: 'Completed',
    Priority: 'High',
    Completion: 100,
    EmployeeID: 1,
  },
  {
    ID: 52,
    Subject: 'Review Product Recall Report by Engineering Team',
    StartDate: '2026/05/17',
    DueDate: '2026/05/20',
    Status: 'Completed',
    Priority: 'High',
    Completion: 100,
    EmployeeID: 1,
  },
];
export const formFieldOptions = [
  { dataField: 'Prefix', label: 'Title' },
  { dataField: 'FirstName', label: 'First Name' },
  { dataField: 'LastName', label: 'Last Name' },
  { dataField: 'Position', label: 'Position' },
  { dataField: 'State', label: 'State' },
  { dataField: 'BirthDate', label: 'Birth Date' },
];
export const ROUTER_TARGETS = new Set(['form', 'grid', 'mixed', 'none']);
export const FORM_ACTION_TYPES = new Set(['clear_field', 'clear_all', 'smart_paste']);
