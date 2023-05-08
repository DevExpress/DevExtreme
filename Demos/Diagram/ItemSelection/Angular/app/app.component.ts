import {
  NgModule, Component, Pipe, PipeTransform, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  dataSource: ArrayStore;

  selectedItems: any[];

  constructor(service: Service) {
    this.dataSource = new ArrayStore({
      key: 'ID',
      data: service.getEmployees(),
    });
  }

  contentReadyHandler(e) {
    const diagram = e.component;
    // preselect some shape
    const items = diagram.getItems().filter((item) => item.itemType === 'shape' && (item.text === 'Greta Sims'));
    if (items.length > 0) {
      diagram.setSelectedItems(items);
      diagram.scrollToItem(items[0]);
      diagram.focus();
    }
  }

  selectionChangedHandler(e) {
    this.selectedItems = e.items.filter((item) => item.itemType === 'shape');
  }
}

@Pipe({ name: 'stringifyItems' })
export class StringifyItemsPipe implements PipeTransform {
  transform(items: any[]) {
    return items
      .map((item) => item.text)
      .join(', ');
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    HttpClientModule,
    DxDiagramModule,
  ],
  declarations: [AppComponent, StringifyItemsPipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
