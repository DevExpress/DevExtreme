import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RadioButtonModule, RadioGroupModule } from '@devextreme/angular';
import { ThemesDynamicExampleComponent } from './themes-dynamic-example.component';
import { ThemesExampleComponent } from './themes-example.component';
import { ThemesScopedExampleComponent } from './themes-scoped-example.component';

const routes = [{
  path: '',
  component: ThemesExampleComponent,
}];

@NgModule({
  declarations: [
    ThemesExampleComponent,
    ThemesScopedExampleComponent,
    ThemesDynamicExampleComponent,
  ],
  imports: [
    CommonModule,
    RadioButtonModule,
    RadioGroupModule,
    RouterModule.forChild(routes),
  ],
})
export class ThemesExampleModule {
}
