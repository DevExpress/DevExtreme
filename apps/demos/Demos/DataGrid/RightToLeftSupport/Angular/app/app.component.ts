import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, computed, inject, signal } from '@angular/core';
import { DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
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
    DxDataGridModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly dataSource = inject(Service).getEuropeanUnion();

  readonly rtlEnabled = signal(false);

  readonly placeholder = computed(() => (this.rtlEnabled() ? 'بحث' : 'Search...'));

  readonly languages: string[] = ['Arabic (Right-to-Left direction)', 'English (Left-to-Right direction)'];

  onSelectLanguage(data) {
    this.rtlEnabled.set(data.value === this.languages[0]);
  }
}

bootstrapApplication(AppComponent);
