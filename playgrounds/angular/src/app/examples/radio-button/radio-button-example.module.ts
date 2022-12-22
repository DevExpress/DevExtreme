import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RadioButtonModule } from '@devextreme/angular';

import { RadioButtonExampleComponent } from './radio-button-example.component';

const routes = [{
  path: '',
  component: RadioButtonExampleComponent,
}];

@NgModule({
  declarations: [
    RadioButtonExampleComponent,
  ],
  imports: [
    CommonModule,
    RadioButtonModule,
    RouterModule.forChild(routes),
  ],
})
export class RadioButtonExampleModule {
}
