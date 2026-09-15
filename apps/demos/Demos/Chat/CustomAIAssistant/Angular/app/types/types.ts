import type { Column } from 'devextreme/ui/data_grid';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import type { DxChatTypes } from 'devextreme-angular/ui/chat';
import type { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import type { DxFormComponent, DxFormTypes } from 'devextreme-angular/ui/form';

export type TaskPriority = 'High' | 'Normal' | 'Low';
export type RouterTarget = 'form' | 'grid' | 'mixed' | 'none';
export type FormActionType = 'clear_field' | 'clear_all' | 'smart_paste';

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

export interface CommandResult {
  status: 'success' | 'failure';
  message: string;
}

export type FilterOperation =
  | '='
  | '<>'
  | '<'
  | '<='
  | '>'
  | '>='
  | 'contains'
  | 'notcontains'
  | 'startswith'
  | 'endswith'
  | 'anyof';

export type SortOrder = 'asc' | 'desc';

export type ScalarFilterValue = string | number | boolean | Date;

export interface GridCommandArgs {
  column?: string;
  operator?: FilterOperation;
  value?: ScalarFilterValue | string[];
  sortOrder?: SortOrder | 'none';
  visible?: boolean;
}

export interface GridCommand {
  description: string;
  schema: Record<string, unknown>;
  execute: (grid: DxDataGridComponent, args: GridCommandArgs, rawText?: string) => CommandResult;
}

export interface ExecuteGridAssistantAction {
  name: string;
  args?: GridCommandArgs;
}

export type FilterCondition = [string, FilterOperation, ScalarFilterValue | string[]];
export type GridFilterValue = FilterCondition | (FilterCondition | 'and')[];

export type ColumnFilterExpression = [(rowData: Task) => number, FilterOperation, number];

export type ColumnLookup =
  | { column: Column<Task, number>; failure: null }
  | { column: null; failure: CommandResult };

export interface FormFieldOption {
  dataField: string;
  label: string;
}

export interface FormAction {
  type: FormActionType;
  field?: string;
}

export interface ClassificationResult {
  target: RouterTarget;
  formAction: FormAction | null;
}

export interface OperationOutcome {
  results: CommandResult[];
  error: Error | null;
}

export type AIResult = DxFormTypes.SmartPastedEvent['aiResult'];

export type PushMessage = (message: DxChatTypes.TextMessage) => void;

export interface RouterContext {
  form: DxFormComponent;
  gridInstance: DxDataGridComponent;
  aiIntegration: AIIntegration;
}

export interface RouteMessageContext extends RouterContext {
  pushMessage: PushMessage;
}

export class ChatCommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChatCommandError';
    Object.setPrototypeOf(this, ChatCommandError.prototype);
  }
}
