import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RadioGroupModule } from '@devextreme/angular';
import { RadioGroupExampleComponent } from './radio-group-example.component';

const routes = [{
  path: '',
  component: RadioGroupExampleComponent,
}];

@NgModule({
  declarations: [
    RadioGroupExampleComponent,
  ],
  imports: [
    CommonModule,
    RadioGroupModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RadioGroupExampleComponent,
  ],
})
export class RadioGroupExampleModule {
}
