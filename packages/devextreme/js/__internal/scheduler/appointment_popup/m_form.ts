import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import Form from '@js/ui/form';

interface SchedulerInstance {
  createComponent: <T>(element: unknown, componentClass: unknown, options?: unknown) => T;
}

const defaultItems = ['name', {
  name: 'startDate',
  editorType: 'dxDateBox',
  validationRules: [{
    type: 'required',
  }],
}, 'endDate'];
export class AppointmentForm {
  noop = noop;

  private readonly createComponent: <T>(
    element: unknown,
    componentClass: unknown,
    options?: unknown
  ) => T;

  private readonly form: Form;

  constructor(scheduler: SchedulerInstance) {
    this.createComponent = scheduler.createComponent;
    const element = $('<div>');
    const form = this.createComponent<Form>(element, Form, { items: defaultItems });
    this.form = form;
  }

  get dxForm(): Form {
    return this.form;
  }

  set readOnly(value: boolean) {
    this.noop();
  }

  get formData(): unknown {
    return this.form?.option('formData');
  }

  set formData(value: unknown) {
    this.noop();
  }

  create(): void {
    this.noop();
  }

  setEditorsType(): void {
    this.noop();
  }

  updateRecurrenceEditorStartDate(): void {
    this.noop();
  }

  setEditorOptions(): void {
    this.noop();
  }

  updateFormData(): void {
    this.noop();
  }
}
