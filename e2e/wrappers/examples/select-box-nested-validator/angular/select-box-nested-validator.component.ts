import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DxSelectBoxModule, DxFormModule, DxButtonModule, DxValidatorModule, DxValidationSummaryModule } from 'devextreme-angular';

@Component({
  selector: 'app-select-box-nested-validator',
  standalone: true,
  imports: [CommonModule, DxSelectBoxModule, DxFormModule, DxButtonModule, DxValidatorModule, DxValidationSummaryModule],
  template: `
    <dx-form 
      [validationGroup]="groupName"
      [formData]="formData">
      <dxi-item>
        <dx-select-box
          [value]="formData.type"
          (onValueChanged)="valueChanged($event)"
          [items]="items"
          [showClearButton]="true"
          valueExpr="id"
          displayExpr="description">
          <dx-validator [validationGroup]="groupName">
            <dxi-validation-rule
              type="required"
              message="Type is required">
            </dxi-validation-rule>
          </dx-validator>
        </dx-select-box>
      </dxi-item>
    </dx-form>
    <dx-validation-summary [validationGroup]="groupName"></dx-validation-summary>
    <dx-button 
      [validationGroup]="groupName"
      text="Validate"
      (onClick)="onClick($event)">
    </dx-button>
  `
})
export class SelectBoxNestedValidatorComponent {
  groupName = "sharedGroup";
  
  formData = { code: null, type: null };
  
  items = [
    {
      id: 1,
      description: "One",
    },
  ];

  valueChanged = (e: any) => {
    this.formData = {
      ...this.formData,
      type: e.value,
    };
  };

  onClick = (e: any) => {
    return e.validationGroup?.validate();
  };
}
