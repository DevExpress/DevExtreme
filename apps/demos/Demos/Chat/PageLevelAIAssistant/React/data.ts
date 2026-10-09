import type React from 'react';
import type { ChatTypes } from 'devextreme-react/chat';
import type { DataGridTypes, DataGridRef } from 'devextreme-react/data-grid';
import type { FormRef, FormTypes } from 'devextreme-react/form';
import type { AIIntegration } from 'devextreme-react/common/ai-integration';
import type { OpenAI } from 'openai';

type TaskPriority = 'High' | 'Normal' | 'Low';
export type RouterTarget = 'form' | 'grid' | 'mixed' | 'none';
export type FormActionType = 'clear_field' | 'clear_all' | 'smart_paste';
type FilterOperation = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'notcontains' | 'startswith' | 'endswith' | 'anyof';

export type TaskGrid = ReturnType<DataGridRef['instance']>;
export type EmployeeForm = ReturnType<FormRef['instance']>;
export type ColumnFilterExpression = [(rowData: Task) => number, FilterOperation, number];

type ChatMessage = ChatTypes.Message;
export type AIMessage = OpenAI.ChatCompletionMessageParam;

export interface Task {
  ID: number;
  Subject: string;
  StartDate: string;
  DueDate: string;
  Status: string;
  Priority: TaskPriority;
  Completion: number;
  EmployeeID: number;
}

interface Employee {
  ID: number;
  Prefix: string;
  FirstName: string;
  LastName: string;
  Position: string;
  State: string;
  BirthDate: string;
}

export interface FormFieldOption {
  dataField: string;
  label: string;
}

export interface CommandResult {
  status: 'success' | 'failure';
  message: string;
}

export type GridCommand = {
  description: string;
  schema: Record<string, unknown>;
  execute: (grid: TaskGrid, args: GridCommandArgs, rawText?: string) => CommandResult;
};

interface GridCommandArgs {
  column?: string;
  operator?: FilterOperation;
  value?: string | number | boolean | string[] | Date | null;
  sortOrder?: 'asc' | 'desc' | 'none';
  visible?: boolean;
}

export type FilterCondition = [string, FilterOperation, string | number | boolean | string[] | Date];
export type GridFilterValue = FilterCondition | (FilterCondition | 'and')[];

export type ColumnLookup =
  | { column: DataGridTypes.Column; failure: null }
  | { column: null; failure: CommandResult };

export interface FormAction {
  type: FormActionType;
  field?: string;
}

export interface ExecuteGridAssistantAction {
  name: string;
  args?: GridCommandArgs;
}

export interface ClassificationResult {
  target: RouterTarget;
  formAction: FormAction | null;
}

export interface OperationOutcome {
  results: CommandResult[];
  error: Error | null;
}

export type PushMessage = (message: Partial<ChatMessage>) => void;

interface RouterContext {
  form: EmployeeForm;
  gridInstance: TaskGrid;
  aiIntegration: AIIntegration;
}

export interface RouteMessageContext extends RouterContext {
  pushMessage: PushMessage;
}

export interface AiAssistantProps {
  formRef: React.RefObject<FormRef>;
  gridRef: React.RefObject<DataGridRef>;
  aiIntegration: AIIntegration;
}

export interface EmployeeFormProps {
  aiIntegration: AIIntegration;
  formRef: React.RefObject<FormRef>;
}

export interface TaskGridProps {
  gridRef: React.RefObject<DataGridRef>;
}

export type AIResult = Record<string, unknown>;

export const ROUTER_TARGETS = new Set<RouterTarget>(['form', 'grid', 'mixed', 'none']);
export const FORM_ACTION_TYPES = new Set<FormActionType>(['clear_field', 'clear_all', 'smart_paste']);

const titles = ['Mr.', 'Mrs.', 'Ms.'];
const states = ['California', 'New York', 'Texas'];
const positions = ['CEO', 'Sales Assistant', 'CMO', 'Manager', 'Designer', 'Developer'];

export const AI_SERVICE_CONFIG = {
  dangerouslyAllowBrowser: true,
  deployment: 'demo-mini',
  endpoint: 'https://public-api.devexpress.com/demo-openai',
  apiVersion: '2024-02-01',
  apiKey: 'DEMO',
};

export class ChatCommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatCommandError';
    Object.setPrototypeOf(this, ChatCommandError.prototype);
  }
}

export const emptyViewMessage = 'How can I help with this page?';

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

export const formFieldsConfig: FormTypes.SimpleItem[] = [
  { dataField: 'Prefix', label: { text: 'Title' }, editorType: 'dxSelectBox', editorOptions: { items: titles, searchEnabled: true }, aiOptions: { instruction: 'Only fill this field with one of the allowed values (Mr., Mrs., Ms.) if a title is explicitly mentioned in the text. Never use this field for any part of a person\'s name.' } },
  { dataField: 'FirstName', label: { text: 'First Name' }, aiOptions: { instruction: "Only fill this field if the text clearly refers to a person's given name. Never use grid/task-related words like Subject, Priority, Status, Due Date, Completion, or generic verbs like sort/filter/show as a name." } },
  { dataField: 'LastName', label: { text: 'Last Name' }, aiOptions: { instruction: "If the text gives a full person name (e.g. 'customer name', 'employee name') without separately labeled first/last names, use only the first word as First Name and the rest of the name as Last Name." } },
  { dataField: 'Position', label: { text: 'Position' }, editorType: 'dxSelectBox', editorOptions: { items: positions, searchEnabled: true }, aiOptions: { instruction: "Only fill this field with one of the allowed job position values if the text explicitly refers to the employee's own job title/role." } },
  { dataField: 'State', label: { text: 'State' }, editorType: 'dxSelectBox', editorOptions: { items: states, searchEnabled: true }, aiOptions: { instruction: "Only fill this field with one of the allowed US state values if the text explicitly refers to the employee's home/office state." } },
  { dataField: 'BirthDate', label: { text: 'Birth Date' }, editorType: 'dxDateBox', editorOptions: { displayFormat: 'M/d/yyyy' }, aiOptions: { instruction: "Only fill this field if the text explicitly refers to the employee's own birth date or date of birth." } },
];

export const formFieldOptions: FormFieldOption[] = formFieldsConfig.map(({ dataField, label }) => ({
  dataField: dataField ?? '',
  label: label?.text ?? dataField ?? '',
}));
