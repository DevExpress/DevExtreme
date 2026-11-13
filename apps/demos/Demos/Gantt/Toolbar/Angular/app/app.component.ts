import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxGanttModule, DxPopupModule } from 'devextreme-angular';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxGanttModule,
    DxPopupModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tasks = this.service.getTasks();

  readonly dependencies = this.service.getDependencies();

  readonly resources = this.service.getResources();

  readonly resourceAssignments = this.service.getResourceAssignments();

  readonly popupVisible = signal(false);

  readonly customButtonOptions: DxButtonTypes.Properties = {
    text: 'About',
    icon: 'info',
    stylingMode: 'text',
    onClick: () => {
      this.popupVisible.set(true);
    },
  };
}

bootstrapApplication(AppComponent);
