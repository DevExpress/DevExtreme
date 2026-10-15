import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { DxFormModule, DxFormComponent, DxFormTypes } from 'devextreme-angular/ui/form';
import { DxToastModule, DxToastComponent } from 'devextreme-angular/ui/toast';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { employee, formFieldsConfig, type Employee } from '../../data';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, DxFormModule, DxToastModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
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
    onClick: () => {
      this.dxForm.instance.reset(this.formData);
      this.dxToast.instance.show();
    },
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
