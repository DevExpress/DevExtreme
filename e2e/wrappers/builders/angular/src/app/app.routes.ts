import { Routes } from '@angular/router';
import { ComponentViewComponent } from './component-view.component';

export const routes: Routes = [
  {
    path: 'examples/:examplePath',
    component: ComponentViewComponent,
  },
];
