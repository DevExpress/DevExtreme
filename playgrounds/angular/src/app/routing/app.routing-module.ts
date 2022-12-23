import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadioButtonExampleModule } from '../examples/radio-button';
import { RadioGroupExampleModule } from '../examples/radio-group';
import { RadioGroupCompatExampleModule } from '../examples/radio-group-compat';
import { HomeComponent } from '../home.component';
import { AppRoutes } from './app.routes';

const routes: Routes = [
  {
    path: AppRoutes.home,
    component: HomeComponent,
  },
  {
    path: AppRoutes.radioButton,
    loadChildren: () => RadioButtonExampleModule,
  },
  {
    path: AppRoutes.radioGroup,
    loadChildren: () => RadioGroupExampleModule,
  },
  {
    path: AppRoutes.radioGroupCompat,
    loadChildren: () => RadioGroupCompatExampleModule,
  },
  {
    path: '**',
    redirectTo: AppRoutes.home,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
