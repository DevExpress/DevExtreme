/* tslint:disable:component-selector */
import {
  Component,
  ViewChild,
} from '@angular/core';

import {
  TestBed,
} from '@angular/core/testing';

import {
  DxToolbarComponent, DxiToolbarItemComponent
} from 'devextreme-angular/ui/toolbar';

@Component({
  selector: 'test-container-component',
  template: '',
})
class TestContainerComponent {
  @ViewChild(DxToolbarComponent) innerWidget: DxToolbarComponent;
}

describe('DxToolbar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        declarations: [TestContainerComponent],
        imports: [DxToolbarComponent, DxiToolbarItemComponent],
      },
    );
  });

  // spec
  it('should not initialize the "items" property of an item if no children are declared inside the item (T472434)', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-toolbar>
                        <dxi-toolbar-item>Item1</dxi-toolbar-item>
                    </dx-toolbar>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const { instance } = fixture.componentInstance.innerWidget;
    expect(instance.option('items')[0].items).toBe(undefined);
    expect(instance.element().querySelector('.dx-toolbar-item').textContent).toBe('Item1');
  });
});
