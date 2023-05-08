import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxScrollViewModule,
  DxSortableModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxNumberBoxModule,
} from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  items: string[];

  dropFeedbackMode: string;

  itemOrientation: string;

  dragDirection: string;

  dragDirections: string[];

  scrollSpeed: number;

  scrollSensitivity: number;

  handle: string;

  dragTemplate: string;

  cursorOffset: any;

  constructor(service: Service) {
    this.items = service.getTasks().map((task) => task.Task_Subject);
    this.dropFeedbackMode = 'push';
    this.itemOrientation = 'vertical';
    this.dragDirection = 'both';
    this.dragDirections = ['both', 'vertical'];
    this.scrollSpeed = 30;
    this.scrollSensitivity = 60;
    this.handle = '';
    this.dragTemplate = '';
    this.cursorOffset = null;
  }

  onDragStart(e) {
    e.itemData = this.items[e.fromIndex];
  }

  onReorder(e) {
    this.items.splice(e.fromIndex, 1);
    this.items.splice(e.toIndex, 0, e.itemData);
  }

  onItemOrientationChanged(e) {
    this.dragDirections = ['both', e.value];
    this.dragDirection = 'both';
  }

  onHandleChanged(e) {
    this.handle = e.value ? '.handle' : '';
  }

  onDragTemplateChanged(e) {
    this.dragTemplate = e.value ? 'drag' : '';
    this.cursorOffset = e.value ? { x: 10, y: 20 } : null;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxScrollViewModule,
    DxSortableModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
