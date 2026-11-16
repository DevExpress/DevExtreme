import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { DxCheckBoxModule, DxNumberBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxFormModule, type DxFormTypes } from 'devextreme-angular/ui/form';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxFormModule,
  ],
})
export class AppComponent {
  companies = inject(Service).getCompanies();

  readonly width = signal<number>(undefined);

  readonly labelMode = signal<DxFormTypes.FormLabelMode>('floating');

  readonly labelLocation = signal<DxFormTypes.LabelLocation>('left');

  readonly readOnly = signal(false);

  readonly showColon = signal(true);

  readonly minColWidth = signal(300);

  readonly colCount = signal(2);

  readonly companySelectorLabelMode = computed(() => (this.labelMode() === 'outside'
    ? 'hidden'
    : this.labelMode()));
}

bootstrapApplication(AppComponent);
