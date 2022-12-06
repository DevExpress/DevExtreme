import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadioGroupExampleModule } from '../examples/radio-group';
import { HomeComponent } from '../home.component';
import { AppRoutes } from './app.routes';

const routes: Routes = [
  {
    path: AppRoutes.home,
    component: HomeComponent,
  },
  {
    path: AppRoutes.radioGroup,
    loadChildren: () => RadioGroupExampleModule,
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
