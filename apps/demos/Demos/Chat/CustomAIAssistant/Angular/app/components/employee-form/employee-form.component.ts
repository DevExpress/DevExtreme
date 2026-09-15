import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { DxFormModule, DxFormComponent } from 'devextreme-angular/ui/form';
import { DxToastModule, DxToastComponent } from 'devextreme-angular/ui/toast';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import { employee, formFieldsConfig } from '../../data/data';
import type { Employee } from '../../types/types';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, DxFormModule, DxToastModule],
  templateUrl: `.${modulePrefix}/components/employee-form/employee-form.component.html`,
  styleUrls: [`.${modulePrefix}/components/employee-form/employee-form.component.css`],
})
export class EmployeeFormComponent {
  @Input({ required: true }) aiIntegration!: AIIntegration;

  @ViewChild(DxFormComponent) private dxForm!: DxFormComponent;

  @ViewChild(DxToastComponent) private dxToast!: DxToastComponent;

  formData: Employee = { ...employee };

  readonly toastPosition = {
    of: '#form-container',
    at: 'bottom center',
    my: 'bottom center',
    offset: '0 -20',
  };

  readonly formFields = formFieldsConfig;

  readonly saveButtonOptions = {
    text: 'Save',
    type: 'default',
    disabled: true,
    useSubmitBehavior: true,
    width: '120px',
    onClick: () => this.dxToast.instance.show(),
  };

  get instance(): DxFormComponent {
    return this.dxForm;
  }

  onOptionChanged(e: { name: string; value: unknown }): void {
    if (e.name === 'isDirty') {
      this.dxForm.instance.getButton('Save')?.option('disabled', !e.value);
    }
  }
}
