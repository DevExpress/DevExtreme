import type {
  Employee, FormActionType, RouterTarget, Task, TaskPriority,
} from '../types/types';

export const CLASSES = {
  clearChatButton: 'ai-chat-clear-button',
};

export const AI_SERVICE_CONFIG = {
  deployment: 'demo-mini',
  apiVersion: '2024-02-01',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiKey: 'DEMO',
};

export const EMPTY_VIEW_MESSAGE = 'How can I help with this page?';

export const EMPTY_VIEW_PROMPT = 'Update employee <b>Form</b> fields.\nFilter or sort tasks, display or hide <b>DataGrid</b> columns, or clear all filters and sorting.';

export const SMART_PASTE_TIMEOUT_MS = 30000;
export const MAX_USER_MESSAGE_LENGTH = 2000;

export const FIELD_OR_VALUE_NOT_FOUND_MESSAGE = '❌ No field or column exists with such a name, or the entered value is invalid. Please check the name and value and try again.';

export const ROUTER_TARGETS = new Set<RouterTarget>(['form', 'grid', 'mixed', 'none']);
export const FORM_ACTION_TYPES = new Set<FormActionType>(['clear_field', 'clear_all', 'smart_paste']);

export const titles = ['Mr.', 'Mrs.', 'Ms.'];

export const colors: Record<TaskPriority, string> = {
  High: '#F1BBBC',
  Normal: '#F9E2AE',
  Low: '#9FD89F',
};

export const states = ['California', 'New York', 'Texas'];

export const positions = [
  'CEO',
  'Sales Assistant',
  'CMO',
  'Manager',
  'Designer',
  'Developer',
];

export const employee: Employee = {
  ID: 1,
  Prefix: 'Mr.',
  FirstName: 'John',
  LastName: 'Heart',
  Position: 'CEO',
  State: 'California',
  BirthDate: '1964/03/16',
};

export const tasks: Task[] = [
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

export const chatSuggestions = [
  { text: 'Show Completed Tasks', prompt: 'Show Completed Tasks' },
  { text: 'Change State to Texas', prompt: 'Change State to Texas' },
];

export interface FormFieldDescriptor {
  dataField: string;
  label: { text: string };
  editorType?: string;
  editorOptions?: Record<string, unknown>;
  aiOptions: { instruction: string };
}

export const formFieldsConfig: FormFieldDescriptor[] = [
  {
    dataField: 'Prefix',
    label: { text: 'Title' },
    editorType: 'dxSelectBox',
    editorOptions: { items: titles, searchEnabled: true },
    aiOptions: {
      instruction: 'Only fill this field with one of the allowed values (Mr., Mrs., Ms.) if a '
        + 'title is explicitly mentioned in the text. Never use this field for any part '
        + "of a person's name.",
    },
  },
  {
    dataField: 'FirstName',
    label: { text: 'First Name' },
    aiOptions: {
      instruction: "Only fill this field if the text clearly refers to a person's given name. "
        + 'Never use grid/task-related words like Subject, Priority, Status, Due Date, '
        + 'Completion, or generic verbs like sort/filter/show as a name.',
    },
  },
  {
    dataField: 'LastName',
    label: { text: 'Last Name' },
    aiOptions: {
      instruction: "If the text gives a full person name (e.g. 'customer name', 'employee name') "
        + 'without separately labeled first/last names, use only the first word as First '
        + 'Name and the rest of the name as Last Name.',
    },
  },
  {
    dataField: 'Position',
    label: { text: 'Position' },
    editorType: 'dxSelectBox',
    editorOptions: { items: positions, searchEnabled: true },
    aiOptions: {
      instruction: 'Only fill this field with one of the allowed job position values if the text '
        + "explicitly refers to the employee's own job title/role.",
    },
  },
  {
    dataField: 'State',
    label: { text: 'State' },
    editorType: 'dxSelectBox',
    editorOptions: { items: states, searchEnabled: true },
    aiOptions: {
      instruction: 'Only fill this field with one of the allowed US state values if the text '
        + "explicitly refers to the employee's home/office state",
    },
  },
  {
    dataField: 'BirthDate',
    label: { text: 'Birth Date' },
    editorType: 'dxDateBox',
    editorOptions: { displayFormat: 'M/d/yyyy' },
    aiOptions: {
      instruction: "Only fill this field if the text explicitly refers to the employee's own birth "
        + 'date or date of birth.',
    },
  },
];
