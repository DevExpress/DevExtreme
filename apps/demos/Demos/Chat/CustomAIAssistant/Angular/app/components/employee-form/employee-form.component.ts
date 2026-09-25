import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { DxFormModule, DxFormComponent, DxFormTypes } from 'devextreme-angular/ui/form';
import { DxToastModule, DxToastComponent } from 'devextreme-angular/ui/toast';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { employee, formFieldsConfig, type Employee } from '../../data';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, DxFormModule, DxToastModule],
  templateUrl: `.${modulePrefix}/components/employee-form/employee-form.component.html`,
  styleUrls: [`.${modulePrefix}/components/employee-form/employee-form.component.css`],
})
export class EmployeeFormComponent {
  @Input({ required: true }) aiIntegration!: AIIntegration;

  @ViewChild(DxFormComponent) private dxForm!: DxFormComponent;

  @ViewChild(DxToastComponent) private dxToast!: DxToastComponent;

  formData: Employee = { ...employee };

  readonly formFields = formFieldsConfig;

  readonly saveButtonOptions: DxButtonTypes.Properties = {
    text: 'Save',
    type: 'default',
    disabled: true,
    useSubmitBehavior: true,
    width: '120px',
    onClick: () => this.dxToast.instance.show(),
  };

  get formComponent(): DxFormComponent {
    return this.dxForm;
  }

  onOptionChanged(e: DxFormTypes.OptionChangedEvent): void {
    if (e.name === 'isDirty') {
      e.component.getButton('Save')?.option('disabled', !e.value);
    }
  }
}
