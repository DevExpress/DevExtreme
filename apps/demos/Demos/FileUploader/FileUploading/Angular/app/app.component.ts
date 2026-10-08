import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, Pipe, PipeTransform, provideZoneChangeDetection } from '@angular/core';
import { DxCheckBoxModule, DxFileUploaderModule, DxSelectBoxModule } from 'devextreme-angular';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Pipe({ name: 'demodate', standalone: true })
export class DemoDatePipe implements PipeTransform {
  transform(date: number) {
    return new Date(date);
  }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxCheckBoxModule,
    DxFileUploaderModule,
    DxSelectBoxModule,
    DemoDatePipe,
  ],
})
export class AppComponent {
  value: File[] = [];
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
