/* tslint:disable:component-selector */
import {
  Component,
  ViewChild,
  signal,
} from '@angular/core';

import {
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';

import { FormControl, ReactiveFormsModule } from '@angular/forms';

import eventsEngine from 'devextreme/common/core/events/core/events_engine';

import {
  DxTextBoxModule,
  DxTextBoxComponent,
  DxDataGridModule,
  DxDataGridComponent,
  DxPopupModule,
  DxPopupComponent,
  DxFormModule,
  DxFormComponent,
  DxListModule,
  DxListComponent,
  DxTemplateModule,
  DxDraggableModule,
  DxChartModule,
} from 'devextreme-angular';

const isZoneless = typeof (window as any).Zone === 'undefined';
const mode = isZoneless ? 'zoneless' : 'zone';

@Component({
  selector: 'test-host',
  imports: [
    DxTextBoxModule, DxDataGridModule, DxPopupModule, DxFormModule, DxListModule,
    DxTemplateModule, DxDraggableModule, DxChartModule, ReactiveFormsModule,
  ],
  template: '',
})
class TestHostComponent {
  @ViewChild(DxTextBoxComponent) textBox: DxTextBoxComponent;

  @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;

  @ViewChild(DxPopupComponent) popup: DxPopupComponent;

  @ViewChild(DxFormComponent) form: DxFormComponent;

  @ViewChild(DxListComponent) list: DxListComponent;

  text = signal('');

  plain = '';

  selectedKeys = signal<number[]>([]);

  visible = signal(true);

  pageIndex = signal(0);

  suffix = signal('1');

  clicks = 0;

  dragMoves = 0;

  renders = 0;

  rows = [{ id: 1 }, { id: 2 }, { id: 3 }];

  manyRows = Array.from({ length: 200 }, (_, i) => ({ id: i + 1 }));

  points = [{ arg: 1, val: 1 }, { arg: 2, val: 3 }, { arg: 3, val: 2 }];

  items = ['a', 'b'];

  itemObjects = [{ text: 'a', disabled: false }, { text: 'b', disabled: false }];

  formData = { name: 'initial' };

  control = new FormControl('');

  countRender(): string {
    this.renders += 1;
    return '';
  }
}

async function render(template: string): Promise<ComponentFixture<TestHostComponent>> {
  TestBed.configureTestingModule({ imports: [TestHostComponent] });
  TestBed.overrideComponent(TestHostComponent, { set: { template } });

  const fixture = TestBed.createComponent(TestHostComponent);
  if (!isZoneless) {
    fixture.autoDetectChanges();
  }
  await fixture.whenStable();

  return fixture;
}

// Runs a widget-side change the way it arrives in a real app: in a zone app user
// interaction runs inside the Angular zone, in a zoneless app there is no zone.
function act<T>(fixture: ComponentFixture<TestHostComponent>, fn: () => T): T {
  return isZoneless ? fn() : fixture.ngZone.run(fn);
}

function outputText(fixture: ComponentFixture<TestHostComponent>): string {
  return fixture.nativeElement.querySelector('.out').textContent.trim();
}

function mouse(target: EventTarget, type: string, x: number, y: number): void {
  target.dispatchEvent(new MouseEvent(type, {
    bubbles: true, cancelable: true, button: 0, buttons: 1, clientX: x, clientY: y,
  }));
}

const wait = (ms: number) => new Promise((resolve) => { setTimeout(resolve, ms); });

describe(`Change detection [${mode}]: environment`, () => {
  it(isZoneless ? 'runs without zone.js' : 'runs with zone.js', () => {
    expect(typeof (window as any).Zone).toBe(isZoneless ? 'undefined' : 'function');
  });

  if (isZoneless) {
    it('does not refresh the view without a change detection trigger', async () => {
      const fixture = await render(`
        <dx-text-box></dx-text-box>
        <span class="out">{{ plain }}</span>
      `);

      fixture.componentInstance.plain = 'changed';
      await wait(50);
      await fixture.whenStable();

      expect(outputText(fixture)).toBe('');
    });
  }
});

describe(`Change detection [${mode}]: template-bound outputs`, () => {
  it('[(value)] bound to a signal receives a widget-side change', async () => {
    const fixture = await render(`
      <dx-text-box [(value)]="text"></dx-text-box>
      <span class="out">{{ text() }}</span>
    `);

    act(fixture, () => fixture.componentInstance.textBox.instance.option('value', 'changed'));
    await fixture.whenStable();

    expect(fixture.componentInstance.text()).toBe('changed');
    expect(outputText(fixture)).toBe('changed');
  });

  it('[(value)] bound to a plain field receives a widget-side change', async () => {
    const fixture = await render(`
      <dx-text-box [(value)]="plain"></dx-text-box>
      <span class="out">{{ plain }}</span>
    `);

    act(fixture, () => fixture.componentInstance.textBox.instance.option('value', 'changed'));
    await fixture.whenStable();

    expect(outputText(fixture)).toBe('changed');
  });

  it('(onValueChanged) handler that sets a plain field updates the view', async () => {
    const fixture = await render(`
      <dx-text-box (onValueChanged)="plain = $event.value"></dx-text-box>
      <span class="out">{{ plain }}</span>
    `);

    act(fixture, () => fixture.componentInstance.textBox.instance.option('value', 'changed'));
    await fixture.whenStable();

    expect(outputText(fixture)).toBe('changed');
  });

  it('[(selectedRowKeys)] receives a selection made by the grid', async () => {
    const fixture = await render(`
      <dx-data-grid [dataSource]="rows" keyExpr="id" [(selectedRowKeys)]="selectedKeys">
        <dxo-selection mode="multiple"></dxo-selection>
      </dx-data-grid>
      <span class="out">{{ selectedKeys().join(',') }}</span>
    `);

    await act(fixture, () => fixture.componentInstance.grid.instance.selectRows([2], false));
    await fixture.whenStable();

    expect(outputText(fixture)).toBe('2');
  });

  it('[(visible)] receives a popup closed by the widget', async () => {
    const fixture = await render(`
      <dx-popup [(visible)]="visible"></dx-popup>
      <span class="out">{{ visible() }}</span>
    `);

    act(fixture, () => fixture.componentInstance.popup.instance.option('visible', false));
    await fixture.whenStable();

    expect(outputText(fixture)).toBe('false');
  });

  it('nested option [(pageIndex)] receives a page change made by the grid', async () => {
    const fixture = await render(`
      <dx-data-grid [dataSource]="rows" keyExpr="id">
        <dxo-paging [pageSize]="1" [(pageIndex)]="pageIndex"></dxo-paging>
      </dx-data-grid>
      <span class="out">{{ pageIndex() }}</span>
    `);

    await act(fixture, () => fixture.componentInstance.grid.instance.pageIndex(2));
    await fixture.whenStable();

    expect(outputText(fixture)).toBe('2');
  });
});

describe(`Change detection [${mode}]: events registered outside the Angular zone (mousemove)`, () => {
  it('(onDragMove) driven by mousemove updates the view', async () => {
    const fixture = await render(`
      <dx-draggable (onDragMove)="dragMoves = dragMoves + 1">
        <div class="drag-handle" style="width: 50px; height: 50px;"></div>
      </dx-draggable>
      <span class="out">{{ dragMoves > 0 }}</span>
    `);
    const handle = fixture.nativeElement.querySelector('.drag-handle');

    mouse(handle, 'mousedown', 10, 10);
    await fixture.whenStable();

    mouse(document, 'mousemove', 40, 40);
    mouse(document, 'mousemove', 60, 60);
    await fixture.whenStable();

    expect(fixture.componentInstance.dragMoves).toBeGreaterThan(0);
    expect(outputText(fixture)).toBe('true');

    mouse(document, 'mouseup', 60, 60);
  });

  it('mouse movement over a widget without handlers does not run change detection', async () => {
    const fixture = await render(`
      <dx-chart [dataSource]="points">
        <dxo-animation [enabled]="false"></dxo-animation>
        <dxi-series argumentField="arg" valueField="val"></dxi-series>
      </dx-chart>
      <span class="out">{{ countRender() }}</span>
    `);
    const host = fixture.componentInstance;
    const surface = fixture.nativeElement.querySelector('dx-chart svg');
    const rendersBefore = host.renders;

    for (let i = 0; i < 20; i += 1) {
      mouse(surface, 'mouseover', 10 + i * 5, 10 + i * 5);
      mouse(surface, 'mousemove', 10 + i * 5, 10 + i * 5);
      mouse(surface, 'mouseout', 10 + i * 5, 10 + i * 5);
    }
    await wait(50);
    await fixture.whenStable();

    expect(host.renders).toBe(rendersBefore);

    if (!isZoneless) {
      act(fixture, () => {});
      await fixture.whenStable();

      expect(host.renders).toBeGreaterThan(rendersBefore);
    }
  });

  it('public option changed by the widget during mousemove does not run change detection', async () => {
    const fixture = await render(`
      <dx-data-grid [dataSource]="rows" keyExpr="id"></dx-data-grid>
      <span class="out">{{ countRender() }}</span>
    `);
    await wait(50);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    let width = 100;
    const resize = () => {
      width += 10;
      host.grid.instance.columnOption(0, 'width', width);
    };
    eventsEngine.on(document, 'mousemove', resize);
    const rendersBefore = host.renders;

    try {
      for (let i = 0; i < 5; i += 1) {
        mouse(document, 'mousemove', 10 + i * 5, 10);
      }
      await wait(50);
      await fixture.whenStable();
    } finally {
      eventsEngine.off(document, 'mousemove', resize);
    }

    expect(host.grid.instance.columnOption(0, 'width')).toBe(150);
    expect(host.renders).toBe(rendersBefore);
  });

  it(isZoneless
    ? 'instance.on() handler for an event fired during mousemove updates the view'
    : 'instance.on() handler for an event fired during mousemove does not run change detection', async () => {
    const fixture = await render(`
      <dx-list [items]="items" selectionMode="single"></dx-list>
      <span class="out">{{ plain }}{{ countRender() }}</span>
    `);
    const host = fixture.componentInstance;
    let moves = 0;
    const change = () => {
      moves += 1;
      host.list.instance.selectItem(moves % 2);
    };
    host.list.instance.on('selectionChanged', (e) => { [host.plain] = e.addedItems; });
    eventsEngine.on(document, 'mousemove', change);
    const rendersBefore = host.renders;

    try {
      for (let i = 0; i < 3; i += 1) {
        mouse(document, 'mousemove', 10 + i * 5, 10);
      }
      await wait(50);
      await fixture.whenStable();
    } finally {
      eventsEngine.off(document, 'mousemove', change);
    }

    expect(host.plain).toBe('b');

    if (isZoneless) {
      expect(outputText(fixture)).toBe('b');
    } else {
      expect(host.renders).toBe(rendersBefore);
    }
  });

  it('template-bound handler for an event fired during mousemove runs a single change detection pass', async () => {
    const fixture = await render(`
      <dx-list [items]="items" selectionMode="single" (onSelectionChanged)="plain = $event.addedItems[0]"></dx-list>
      <span class="out">{{ plain }}{{ countRender() }}</span>
    `);
    const host = fixture.componentInstance;
    const change = () => host.list.instance.selectItem(1);
    eventsEngine.on(document, 'mousemove', change);
    const rendersBefore = host.renders;

    try {
      mouse(document, 'mousemove', 10, 10);
      await wait(50);
      await fixture.whenStable();
    } finally {
      eventsEngine.off(document, 'mousemove', change);
    }

    expect(outputText(fixture)).toBe('b');
    // one pass plus the dev-mode checkNoChanges pass
    expect(host.renders - rendersBefore).toBe(2);
  });

  if (!isZoneless) {
    it('widget events fired in a timer outside the Angular zone do not run change detection', async () => {
      const fixture = await render(`
        <dx-list [items]="items" selectionMode="single"></dx-list>
        <span class="out">{{ countRender() }}</span>
      `);
      const host = fixture.componentInstance;
      host.list.instance.on('selectionChanged', (e) => { [host.plain] = e.addedItems; });
      const rendersBefore = host.renders;

      fixture.ngZone.runOutsideAngular(() => setTimeout(() => host.list.instance.selectItem(1)));
      await wait(50);
      await fixture.whenStable();

      expect(host.plain).toBe('b');
      expect(host.renders).toBe(rendersBefore);
    });
  }
});

if (isZoneless) {
  describe(`Change detection [${mode}]: widget-internal state`, () => {
    it('hovering over List items does not run change detection', async () => {
      const fixture = await render(`
        <dx-list [items]="items" [hoverStateEnabled]="true"></dx-list>
        <span class="out">{{ countRender() }}</span>
      `);
      const host = fixture.componentInstance;
      const listItems = fixture.nativeElement.querySelectorAll('.dx-list-item');
      const rendersBefore = host.renders;

      listItems.forEach((item: Element) => {
        mouse(item, 'mouseover', 5, 5);
        mouse(item, 'mouseenter', 5, 5);
      });
      const hovered = host.list.instance.option('hoveredElement');
      await wait(50);
      await fixture.whenStable();

      expect(hovered).toBeTruthy();
      expect(host.renders).toBe(rendersBefore);
    });

    it('internal option changed by the widget in a timer does not run change detection', async () => {
      const fixture = await render(`
        <dx-list [items]="items" [focusStateEnabled]="true"></dx-list>
        <span class="out">{{ countRender() }}</span>
      `);
      const host = fixture.componentInstance;
      const lastItem = fixture.nativeElement.querySelectorAll('.dx-list-item')[1];
      const rendersBefore = host.renders;

      setTimeout(() => host.list.instance.option('focusedElement', lastItem));
      await wait(50);
      await fixture.whenStable();

      expect(host.list.instance.option('focusedElement')).toBe(lastItem);
      expect(host.renders).toBe(rendersBefore);
    });

    it('scrolling a DataGrid without handlers does not run change detection', async () => {
      const fixture = await render(`
        <dx-data-grid [dataSource]="manyRows" keyExpr="id" [height]="200">
          <dxo-data-grid-scrolling mode="virtual"></dxo-data-grid-scrolling>
        </dx-data-grid>
        <span class="out">{{ countRender() }}</span>
      `);
      await wait(50);
      await fixture.whenStable();
      const host = fixture.componentInstance;
      const scrollable = host.grid.instance.getScrollable();
      const scrolled = jasmine.createSpy('scrolled');
      scrollable.on('scroll', scrolled);
      const rendersBefore = host.renders;

      const container = fixture.nativeElement.querySelector('.dx-datagrid-rowsview .dx-scrollable-container');

      for (let i = 0; i < 5; i += 1) {
        container.dispatchEvent(new Event('scroll'));
      }
      await wait(50);
      await fixture.whenStable();

      expect(scrolled).toHaveBeenCalled();
      expect(host.renders).toBe(rendersBefore);
    });
  });
}

describe(`Change detection [${mode}]: dxTemplate content`, () => {
  it('re-renders when a parent signal used in the template changes', async () => {
    const fixture = await render(`
      <dx-list [items]="items">
        <div *dxTemplate="let item of 'item'"><span class="tpl">{{ item }}-{{ suffix() }}</span></div>
      </dx-list>
    `);

    act(fixture, () => fixture.componentInstance.suffix.set('2'));
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.tpl').textContent).toBe('a-2');
  });

  it('updates the view after a (click) handler inside the template', async () => {
    const fixture = await render(`
      <dx-list [items]="items">
        <div *dxTemplate="let item of 'item'"><button class="tpl-btn" (click)="clicks = clicks + 1"></button></div>
      </dx-list>
      <span class="out">{{ clicks }}</span>
    `);

    fixture.nativeElement.querySelector('.tpl-btn').click();
    await fixture.whenStable();

    expect(outputText(fixture)).toBe('1');
  });
});

describe(`Change detection [${mode}]: state changed without a template binding`, () => {
  it('output subscribed in code updates the view', async () => {
    const fixture = await render(`
      <dx-data-grid [dataSource]="rows" keyExpr="id">
        <dxo-selection mode="multiple"></dxo-selection>
      </dx-data-grid>
      <span class="out">{{ plain }}</span>
    `);
    const host = fixture.componentInstance;

    host.grid.onSelectionChanged.subscribe((e) => { host.plain = e.selectedRowKeys.join(','); });
    await act(fixture, () => host.grid.instance.selectRows([2], false));
    await fixture.whenStable();

    expect(host.plain).toBe('2');
    expect(outputText(fixture)).toBe('2');
  });

  it('handler attached with instance.on() updates the view', async () => {
    const fixture = await render(`
      <dx-data-grid [dataSource]="rows" keyExpr="id">
        <dxo-selection mode="multiple"></dxo-selection>
      </dx-data-grid>
      <span class="out">{{ plain }}</span>
    `);
    const host = fixture.componentInstance;

    host.grid.instance.on('selectionChanged', (e) => { host.plain = e.selectedRowKeys.join(','); });
    await act(fixture, () => host.grid.instance.selectRows([2], false));
    await fixture.whenStable();

    expect(host.plain).toBe('2');
    expect(outputText(fixture)).toBe('2');
  });

  it('onOptionChanged subscribed in code updates the view for an unbound option', async () => {
    const fixture = await render(`
      <dx-text-box></dx-text-box>
      <span class="out">{{ plain }}</span>
    `);
    const host = fixture.componentInstance;

    host.textBox.onOptionChanged.subscribe((e) => {
      if (e.name === 'hint') {
        host.plain = e.value;
      }
    });
    act(fixture, () => host.textBox.instance.option('hint', 'changed'));
    await fixture.whenStable();

    expect(host.plain).toBe('changed');
    expect(outputText(fixture)).toBe('changed');
  });

  it('instance.on(\'optionChanged\') handler for an unbound public option updates the view', async () => {
    const fixture = await render(`
      <dx-text-box></dx-text-box>
      <span class="out">{{ plain }}</span>
    `);
    const host = fixture.componentInstance;

    host.textBox.instance.on('optionChanged', (e) => {
      if (e.name === 'hint') {
        host.plain = e.value;
      }
    });
    act(fixture, () => host.textBox.instance.option('hint', 'changed'));
    await wait(50);
    await fixture.whenStable();

    expect(host.plain).toBe('changed');
    expect(outputText(fixture)).toBe('changed');
  });

  it('template reading an unbound component option updates the view', async () => {
    const fixture = await render(`
      <dx-data-grid #gridRef [dataSource]="rows" keyExpr="id">
        <dxo-selection mode="multiple"></dxo-selection>
      </dx-data-grid>
      <span class="out">{{ gridRef.selectedRowKeys.length }}</span>
    `);

    expect(outputText(fixture)).toBe('0');

    await act(fixture, () => fixture.componentInstance.grid.instance.selectRows([2], false));
    await fixture.whenStable();

    expect(outputText(fixture)).toBe('1');
  });

  it('one-way [formData] changed in place by the Form updates the view', async () => {
    const fixture = await render(`
      <dx-form [formData]="formData"></dx-form>
      <span class="out">{{ formData.name }}</span>
    `);

    const editor = fixture.componentInstance.form.instance.getEditor('name');

    act(fixture, () => editor.option('value', 'first'));
    await fixture.whenStable();

    expect(outputText(fixture)).toBe('first');

    act(fixture, () => editor.option('value', 'second'));
    await fixture.whenStable();

    expect(fixture.componentInstance.formData.name).toBe('second');
    expect(outputText(fixture)).toBe('second');
  });

  it('FormControl.setValue() in a timer reaches the widget and releases the update lock', async () => {
    const fixture = await render(`
      <dx-text-box [formControl]="control"></dx-text-box>
    `);
    const host = fixture.componentInstance;

    act(fixture, () => setTimeout(() => host.control.setValue('changed')));
    await wait(50);
    await fixture.whenStable();

    expect(host.textBox.instance.option('value')).toBe('changed');
    expect(host.textBox.widgetUpdateLocked).toBe(false);
  });

  it('FormControl.setValue() in a (click) handler reaches the widget and releases the update lock', async () => {
    const fixture = await render(`
      <dx-text-box [formControl]="control"></dx-text-box>
      <button class="set" (click)="control.setValue('clicked')"></button>
    `);
    const host = fixture.componentInstance;

    fixture.nativeElement.querySelector('.set').click();
    await fixture.whenStable();

    expect(host.textBox.instance.option('value')).toBe('clicked');
    expect(host.textBox.widgetUpdateLocked).toBe(false);
  });

  it('component property set in a timer releases the update lock', async () => {
    const fixture = await render(`
      <dx-text-box></dx-text-box>
    `);
    const host = fixture.componentInstance;

    act(fixture, () => setTimeout(() => { host.textBox.hint = 'changed'; }));
    await wait(50);
    await fixture.whenStable();

    expect(host.textBox.instance.option('hint')).toBe('changed');
    expect(host.textBox.widgetUpdateLocked).toBe(false);
  });

  it('bound input change runs a single change detection pass', async () => {
    const fixture = await render(`
      <dx-text-box [value]="text()"></dx-text-box>
      <span class="out">{{ countRender() }}</span>
    `);
    const host = fixture.componentInstance;
    const rendersBefore = host.renders;

    act(fixture, () => host.text.set('changed'));
    await wait(50);
    await fixture.whenStable();

    expect(host.textBox.instance.option('value')).toBe('changed');
    // one pass plus the dev-mode checkNoChanges pass
    expect(host.renders - rendersBefore).toBe(2);
  });

  it(isZoneless
    ? 'item pushed to a bound array in a timer does not reach the widget (documented limitation)'
    : 'item pushed to a bound array in a timer reaches the widget', async () => {
    const fixture = await render(`
      <dx-list [items]="items"></dx-list>
    `);

    act(fixture, () => setTimeout(() => fixture.componentInstance.items.push('c')));
    await wait(50);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.dx-list-item').length).toBe(isZoneless ? 2 : 3);
  });

  it(isZoneless
    ? 'item field changed in a timer does not reach the widget (documented limitation)'
    : 'item field changed in a timer reaches the widget', async () => {
    const fixture = await render(`
      <dx-list [items]="itemObjects"></dx-list>
    `);

    act(fixture, () => setTimeout(() => { fixture.componentInstance.itemObjects[0].disabled = true; }));
    await wait(50);
    await fixture.whenStable();

    const firstItem = fixture.nativeElement.querySelector('.dx-list-item');
    expect(firstItem.classList.contains('dx-state-disabled')).toBe(!isZoneless);
  });
});
