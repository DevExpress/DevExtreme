import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxScrollViewModule, DxNumberBoxModule } from 'devextreme-angular';
import { DxSortableModule, type DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { DxSelectBoxModule, type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { DxCheckBoxModule, type DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import type { DragDirection } from 'devextreme-angular/common';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxScrollViewModule,
    DxSortableModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
  ],
})
export class AppComponent {
  readonly items = signal(inject(Service).getTasks().map((task) => task.Task_Subject));

  readonly dropFeedbackMode = signal<DxSortableTypes.DragHighlight>('push');

  readonly itemOrientation = signal<DxSortableTypes.Orientation>('vertical');

  readonly dragDirection = signal<DragDirection>('both');

  readonly dragDirections = signal<DragDirection[]>(['both', 'vertical']);

  readonly scrollSpeed = signal(30);

  readonly scrollSensitivity = signal(60);

  readonly handle = signal('');

  readonly dragTemplate = signal('');

  readonly cursorOffset = signal<{ x: number, y: number }>(null);

  onDragStart(e: DxSortableTypes.DragStartEvent) {
    e.itemData = this.items()[e.fromIndex];
  }

  onReorder(e: DxSortableTypes.ReorderEvent) {
    this.items.update((items) => {
      const result = [...items];
      result.splice(e.fromIndex, 1);
      result.splice(e.toIndex, 0, e.itemData);
      return result;
    });
  }

  onItemOrientationChanged(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.dragDirections.set(['both', e.value]);
    this.dragDirection.set('both');
  }

  onHandleChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.handle.set(e.value ? '.handle' : '');
  }

  onDragTemplateChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.dragTemplate.set(e.value ? 'drag' : '');
    this.cursorOffset.set(e.value ? { x: 10, y: 20 } : null);
  }
}

bootstrapApplication(AppComponent);
