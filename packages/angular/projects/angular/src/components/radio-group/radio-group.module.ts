import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RadioButtonComponent } from './radio-button.component';
import { RadioGroupComponent } from './radio-group.component';

@NgModule({
  declarations: [RadioGroupComponent, RadioButtonComponent],
  imports: [CommonModule],
  exports: [RadioGroupComponent, RadioButtonComponent],
})
export class RadioGroupModule {
}
