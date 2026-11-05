import {
  Component,
  Pipe,
  type PipeTransform,
  enableProdMode,
  inject,
  signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ArrayStore } from 'devextreme-angular/common/data';
import { DxDiagramModule, DxDiagramTypes } from 'devextreme-angular/ui/diagram';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Pipe({ name: 'stringifyItems', standalone: true })
export class StringifyItemsPipe implements PipeTransform {
  transform(items: DxDiagramTypes.Item[], textExpression: string): string {
    return items
      .map((item) => item.dataItem[textExpression])
      .join(', ');
  }
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxDiagramModule,
    StringifyItemsPipe,
  ],
})
export class AppComponent {
  readonly dataSource = new ArrayStore({
    key: 'ID',
    data: inject(Service).getEmployees(),
  });

  readonly selectedItems = signal<DxDiagramTypes.Item[]>([]);

  readonly textExpression = 'Full_Name';

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
    this.selectedItems.set(e.items.filter((item) => item.itemType === 'shape'));
  }
}

bootstrapApplication(AppComponent);
