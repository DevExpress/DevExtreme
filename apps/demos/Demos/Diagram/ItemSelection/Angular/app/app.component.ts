import {
  NgModule, Component, Pipe, PipeTransform, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClientModule } from '@angular/common/http';
import ArrayStore from 'devextreme/data/array_store';
import { DxDiagramModule, DxDiagramTypes } from 'devextreme-angular/ui/diagram';
import { Service } from './app.service';

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

  selectedItems: DxDiagramTypes.Item[];

  textExpression = 'Full_Name';

  constructor(service: Service) {
    this.dataSource = new ArrayStore({
      key: 'ID',
      data: service.getEmployees(),
    });
  }

  contentReadyHandler(e: DxDiagramTypes.ContentReadyEvent) {
    const diagram = e.component;
    // preselect some shape
    const items = diagram.getItems().filter((item) => item.itemType === 'shape' && (item.dataItem[this.textExpression] === 'Greta Sims'));
    if (items.length > 0) {
      diagram.setSelectedItems(items);
      diagram.scrollToItem(items[0]);
      diagram.focus();
    }
  }

  selectionChangedHandler(e: DxDiagramTypes.SelectionChangedEvent) {
    this.selectedItems = e.items.filter((item) => item.itemType === 'shape');
  }
}

@Pipe({ name: 'stringifyItems' })
export class StringifyItemsPipe implements PipeTransform {
  transform(items: DxDiagramTypes.Item[], textExpression: string): string {
    return items
      .map((item) => item.dataItem[textExpression])
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
