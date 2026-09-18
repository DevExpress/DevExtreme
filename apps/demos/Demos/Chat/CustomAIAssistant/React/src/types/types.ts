import type { ChatTypes } from 'devextreme-react/chat';
import type { DataGridTypes, DataGridRef } from 'devextreme-react/data-grid';
import type { FormRef } from 'devextreme-react/form';

import type { AIIntegration } from 'devextreme-react/common/ai-integration';
import type { OpenAI } from 'openai';

export type TaskPriority = 'High' | 'Normal' | 'Low';
export type RouterTarget = 'form' | 'grid' | 'mixed' | 'none';
export type FormActionType = 'clear_field' | 'clear_all' | 'smart_paste';
export type FilterOperation = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'notcontains' | 'startswith' | 'endswith' | 'anyof';

export type TaskGrid = ReturnType<DataGridRef['instance']>;
export type EmployeeForm = ReturnType<FormRef['instance']>;

export type ChatMessage = ChatTypes.Message;
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

export interface Employee {
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

export interface GridCommandArgs {
  column?: string;
  operator?: FilterOperation;
  value?: string | number | boolean | string[] | Date | null;
  sortOrder?: 'asc' | 'desc' | 'none';
  visible?: boolean;
}

export type FilterCondition = [string, FilterOperation, string | number | boolean | string[] | Date];
export type GridFilterValue = FilterCondition | (FilterCondition | 'and')[];

export interface ColumnLookup {
  column: DataGridTypes.Column | null;
  failure: CommandResult | null;
}

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

export interface RouterContext {
  form: EmployeeForm;
  gridInstance: TaskGrid;
  aiIntegration: AIIntegration;
}

export interface RouteMessageContext extends RouterContext {
  pushMessage: PushMessage;
}

export interface AiAssistantProps {
  form: EmployeeForm | null;
  grid: TaskGrid | null;
  aiIntegration: AIIntegration;
}

export interface EmployeeFormProps {
  aiIntegration: AIIntegration;
  onInitialized: (form: EmployeeForm) => void;
}

export interface TaskGridProps {
  onInitialized: (grid: TaskGrid) => void;
}

export type AIResult = Record<string, unknown>;

export const ROUTER_TARGETS = new Set<RouterTarget>(['form', 'grid', 'mixed', 'none']);
export const FORM_ACTION_TYPES = new Set<FormActionType>(['clear_field', 'clear_all', 'smart_paste']);
