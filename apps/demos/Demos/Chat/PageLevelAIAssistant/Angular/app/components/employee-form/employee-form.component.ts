import { Component, input, viewChild } from '@angular/core';
import { DxFormModule, DxFormComponent, type DxFormTypes } from 'devextreme-angular/ui/form';
import { DxToastModule, DxToastComponent } from 'devextreme-angular/ui/toast';
import type { AIIntegration } from 'devextreme-angular/common/ai-integration';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import { employee, formFieldsConfig, type Employee } from '../../data';

@Component({
  selector: 'app-employee-form',
  imports: [DxFormModule, DxToastModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent {
  readonly aiIntegration = input.required<AIIntegration>();

  readonly formComponent = viewChild.required(DxFormComponent);

  private readonly dxToast = viewChild.required(DxToastComponent);

  readonly formData: Employee = { ...employee };

  readonly formFields = formFieldsConfig;

  readonly saveButtonOptions: DxButtonTypes.Properties = {
    text: 'Save',
    type: 'default',
    disabled: true,
    useSubmitBehavior: true,
    width: '120px',
    onClick: () => {
      this.formComponent().instance.reset(this.formData);
      this.dxToast().instance.show();
    },
  };

  onOptionChanged(e: DxFormTypes.OptionChangedEvent): void {
    if (e.name === 'isDirty') {
      e.component.getButton('Save')?.option('disabled', !e.value);
    }
  }
}
