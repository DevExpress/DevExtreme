/* tslint:disable:component-selector */
import {
  VERSION,
  Component,
  ViewChild,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';

import {
  TestBed,
} from '@angular/core/testing';

import DxButton from 'devextreme/ui/button';

import {
  DxButtonModule,
  DxListModule,
  DxListComponent,
} from 'devextreme-angular';

@Component({
  selector: 'test-container-component',
  template: '',
})
class TestContainerComponent implements AfterViewChecked {
  emptyItems = undefined;

  items = [1];

  complexItems = [{ text: 'Item 1' }];

  emptyDataSource: Record<string, any> = { items: [] };

  defaultTemplateItems = [{ text: 'test', disabled: false }];

  disabled = false;

  @ViewChild(DxListComponent) innerWidget: DxListComponent;

  ngAfterViewChecked() {}
}

const testData = [
  {
    testName: 'legacy',
    nestedItem: 'dxi-item',
  },
  {
    testName: 'modern',
    nestedItem: 'dxi-list-item',
  },
];

describe('DxList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        declarations: [TestContainerComponent],
        imports: [DxListModule],
      },
    );
  });

  // spec
  it('should react to collection change', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-list [items]="items"></dx-list>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const { instance } = testComponent.innerWidget;

    const optionSpy = spyOn(instance, 'option').and.callThrough();

    testComponent.items.push(2);
    fixture.detectChanges();

    expect(instance.option).toHaveBeenCalledWith('items', [1, 2]);
    optionSpy.calls.reset();
  });

  it('should react to collection change for empty dataSource', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-list [dataSource]="emptyDataSource.items">
                        <div *dxTemplate="let i of 'item'">
                            {{i}}
                        </div>
                    </dx-list>
                `,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const { instance } = testComponent.innerWidget;

    testComponent.emptyDataSource = { items: [] };
    fixture.detectChanges();

    testComponent.emptyDataSource.items.push({ id: 1 });
    fixture.detectChanges();

    expect(instance?.option('items')?.length).toBe(1);
  });

  it('should not react if the same value is assigned to the collection', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-list [items]="items"></dx-list>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const { instance } = testComponent.innerWidget;

    const optionSpy = spyOn(instance, 'option').and.callThrough();

    testComponent.items = testComponent.items;
    fixture.detectChanges();

    expect(instance.option).toHaveBeenCalledTimes(1);
    optionSpy.calls.reset();
  });

  it('should react to item option change', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-list [(items)]="defaultTemplateItems"></dx-list>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const { instance } = testComponent.innerWidget;

    testComponent.defaultTemplateItems[0].disabled = true;
    fixture.detectChanges();

    const listItems = instance.element().querySelectorAll('.dx-list-item');
    const listItemHasDisabledClass = listItems[0].classList.contains('dx-state-disabled');

    expect(listItems.length).toEqual(1);
    expect(listItemHasDisabledClass).toBeTruthy();
  });

  testData.forEach(
    ({ testName, nestedItem }) => {
      it(`should be able to accept items as a static nested components list (with ${testName} nested items)`, () => {
        TestBed.overrideComponent(TestContainerComponent, {
          set: {
            template: `
                    <dx-list>
                        <${nestedItem}>Item 1</${nestedItem}>
                        <${nestedItem}>Item 2</${nestedItem}>
                    </dx-list>
                `,
          },
        });
        const fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        const { instance } = fixture.componentInstance.innerWidget;
        expect(instance?.option('items')?.length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('Item 1');
        expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('Item 2');
      });

      it(`should have correct item template (with ${testName} nested items)`, () => {
        TestBed.overrideComponent(TestContainerComponent, {
          set: {
            template: `
                    <dx-list>
                        <${nestedItem}>item</${nestedItem}>
                    </dx-list>
                `,
          },
        });
        const fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        const { instance } = fixture.componentInstance.innerWidget;
        const element = instance.element().querySelector('.dx-item-content');
        expect(element?.innerHTML).toBe('item');
        expect(element && window.getComputedStyle(element).display).toBe('block');
      });

      it(`should use properties of the nested components (with ${testName} nested items)`, () => {
        TestBed.overrideComponent(TestContainerComponent, {
          set: {
            template: `
                    <dx-list>
                        <${nestedItem} [disabled]="true">Item 1</${nestedItem}>
                        <${nestedItem}>Item 2</${nestedItem}>
                    </dx-list>
                `,
          },
        });
        const fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        const { instance } = fixture.componentInstance.innerWidget;
        expect(instance?.option('items')?.length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item.dx-state-disabled').length).toBe(1);
      });

      it(`nested component property bindings work (with ${testName} nested items)`, () => {
        TestBed.overrideComponent(TestContainerComponent, {
          set: {
            template: `
                    <dx-list>
                        <${nestedItem} [disabled]="disabled">Item 1</${nestedItem}>
                        <${nestedItem}>Item 2</${nestedItem}>
                    </dx-list>
                `,
          },
        });
        const fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        const testComponent = fixture.componentInstance;
        const { instance } = testComponent.innerWidget;

        expect(instance.element().querySelectorAll('.dx-item.dx-state-disabled').length).toBe(0);

        testComponent.disabled = true;
        fixture.detectChanges();

        expect(instance.element().querySelectorAll('.dx-item.dx-state-disabled').length).toBe(1);
      });

      [
        { name: '*ngFor', tpl: `<${nestedItem} *ngFor="let item of items">{{item}}</${nestedItem}>` },
        {
          name: '@for',
          tpl: `@for (item of items; track item) {
        <${nestedItem}>{{item}}</${nestedItem}>
     }`,
        },
      ].forEach(({ name, tpl }) => {
        it(`should be able to accept items as an ${name} components list (with ${testName} nested items)`, () => {
          TestBed.overrideComponent(TestContainerComponent, {
            set: {
              template: `<dx-list>${tpl}</dx-list>`,
            },
          });

          const fixture = TestBed.createComponent(TestContainerComponent);

          fixture.detectChanges();

          const testComponent = fixture.componentInstance; const
            { instance } = testComponent.innerWidget;

          expect(instance?.option('items')?.length).toBe(1);
          expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(1);
          expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('1');

          testComponent.items.push(2);

          fixture.detectChanges();

          expect(instance?.option('items')?.length).toBe(2);
          expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
          expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('1');
          expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('2');
        });

        it(`should be able to clear items rendered with ${name} (with ${testName} nested items)`, () => {
          TestBed.overrideComponent(TestContainerComponent, {
            set: {
              template: `<dx-list>
                        ${tpl}
                    </dx-list>`,
            },
          });
          const fixture = TestBed.createComponent(TestContainerComponent);
          fixture.detectChanges();

          const testComponent = fixture.componentInstance;
          const { instance } = testComponent.innerWidget;

          expect(instance?.option('items')?.length).toBe(1);
          expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(1);
          expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('1');

          testComponent.items.pop();
          expect(testComponent.items.length).toBe(0);
          fixture.detectChanges();

          expect(instance?.option('items')?.length).toBe(0);
          expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(0);
        });
      });

      [
        { name: '*ngFor', tpl: `<${nestedItem} *ngFor="let item of items" [badge]="10">{{item}}</${nestedItem}>` },
        {
          name: '@for',
          tpl: `@for (item of items; track item) {
        <${nestedItem} [badge]="10">{{item}}</${nestedItem}>
     }`,
        },
      ].forEach(({ name, tpl }) => {
        it(`should be able to replace items by ${name} (with ${testName} nested items)`, () => {
          TestBed.overrideComponent(TestContainerComponent, {
            set: {
              template: `<dx-list>${tpl}</dx-list>`,
            },
          });
          const fixture = TestBed.createComponent(TestContainerComponent);
          const testComponent = fixture.componentInstance;

          testComponent.items = [1, 2];
          fixture.detectChanges();

          const { instance } = testComponent.innerWidget;

          testComponent.items = [3, 4];
          fixture.detectChanges();

          expect(instance?.option('items')?.length).toBe(2);
          expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
          expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('3');
          expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('4');
        });
      });

      [
        { name: '*ngFor', tpl: `<${nestedItem} *ngFor="let item of complexItems">{{item.text}}</${nestedItem}>` },
        {
          name: '@for',
          tpl: `@for (item of complexItems; track item.text) {
        <${nestedItem}>{{item.text}}</${nestedItem}>
     }`,
        },
      ].forEach(({ name, tpl }) => {
        it(`should respond to items changes rendered with ${name}  (with ${testName} nested items)`, () => {
          TestBed.overrideComponent(TestContainerComponent, {
            set: {
              template: `<dx-list>${tpl}</dx-list>`,
            },
          });

          const fixture = TestBed.createComponent(TestContainerComponent);

          fixture.detectChanges();

          const testComponent = fixture.componentInstance;
          const { instance } = testComponent.innerWidget;

          expect(instance?.option('items')?.length).toBe(1);
          expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(1);
          expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('Item 1');

          const optionSpy = spyOn(instance, 'option').and.callThrough();

          fixture.detectChanges();

          expect(instance.option).not.toHaveBeenCalled;

          testComponent.complexItems.push({ text: 'Item 2' });

          fixture.detectChanges();

          expect(instance.option).toHaveBeenCalled;
          expect(instance?.option('items')?.length).toBe(2);
          expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
          expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('Item 1');
          expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('Item 2');

          optionSpy.calls.reset();

          testComponent.complexItems[0].text = 'Changed';

          fixture.detectChanges();

          expect(optionSpy).toHaveBeenCalledTimes(1);
          expect(optionSpy.calls.allArgs().length).toBe(1);
          expect(instance?.option('items')?.length).toBe(2);
          expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
          expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('Changed');
          expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('Item 2');

          optionSpy.calls.reset();
        });
      });

      it(`should be able to set option "template" for each item (with ${testName} nested items)`, () => {
        TestBed.overrideComponent(TestContainerComponent, {
          set: {
            template: `
                    <dx-list>
                        <${nestedItem} [template]="'testTemplate'"></${nestedItem}>

                        <div *dxTemplate="let item of 'testTemplate'">testTemplate</div>
                    </dx-list>
                `,
          },
        });
        const fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        const { instance } = fixture.componentInstance.innerWidget;
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('testTemplate');
      });

      it(`should be able to define item without template (with ${testName} nested items)`, () => {
        TestBed.overrideComponent(TestContainerComponent, {
          set: {
            template: `
                    <dx-list>
                        <${nestedItem} text="TestText"></${nestedItem}>
                    </dx-list>
                `,
          },
        });
        const fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        const { instance } = fixture.componentInstance.innerWidget;
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('TestText');
      });

      it(`should use item template to render/rerender an item with a template (T532675) (with ${testName} nested items)`, () => {
        const ngTemplateName = Number(VERSION.major) >= 4 ? 'ng-template' : 'template';

        TestBed.configureTestingModule({
          declarations: [TestContainerComponent],
          imports: [DxButtonModule, DxListModule],
        });

        TestBed.overrideComponent(TestContainerComponent, {
          set: {
            template: `
                    <dx-list>
                        <${nestedItem}>
                            <dx-button *dxTemplate></dx-button>
                        </${nestedItem}>
                        <${nestedItem}>
                            <${ngTemplateName} dxTemplate>
                                <dx-button></dx-button>
                            </${ngTemplateName}>
                        </${nestedItem}>
                    </dx-list>
                `,
          },
        });

        const fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        const { instance } = fixture.componentInstance.innerWidget;
        let elements = instance.element().querySelectorAll('.dx-button');
        expect(DxButton.getInstance(elements[0])).not.toBeUndefined();
        expect(DxButton.getInstance(elements[1])).not.toBeUndefined();

        instance.repaint();
        fixture.detectChanges();
        elements = instance.element().querySelectorAll('.dx-button');
        expect(DxButton.getInstance(elements[0])).not.toBeUndefined();
        expect(DxButton.getInstance(elements[1])).not.toBeUndefined();
      });
    },
  );

  it('should destroy angular components inside template', () => {
    let destroyed = false;
    @Component({
      selector: 'destroyable-component',
      template: '',
    })
    class DestroyableComponent implements OnDestroy {
      ngOnDestroy() {
        destroyed = true;
      }
    }

    TestBed.configureTestingModule({
      declarations: [DestroyableComponent, TestContainerComponent],
      imports: [DxListModule],
    });

    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-list [items]="items">
                        <div *dxTemplate="let item of 'item'">
                            <destroyable-component></destroyable-component>
                        </div>
                    </dx-list>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    fixture.componentInstance.items = [];
    fixture.detectChanges();

    expect(destroyed).toBe(true);
  });

  it('should destroy devextreme components inside template', () => {
    @Component({
      selector: 'test-container-component',
      template: '',
    })
    class TestContainerComponent {
      items = [0];

      buttonDestroyed = false;

      listVisible = true;
    }

    TestBed.configureTestingModule({
      declarations: [TestContainerComponent],
      imports: [DxButtonModule, DxListModule],
    });

    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-list *ngIf="listVisible" [items]="items">
                        <div *dxTemplate="let item of 'item'">
                            <dx-button text="Test" (onDisposing)="buttonDestroyed = true"></dx-button>
                        </div>
                    </dx-list>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    fixture.componentInstance.listVisible = false;
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonDestroyed).toBe(true);
  });

  it('should destroy devextreme components in template root correctly', () => {
    @Component({
      selector: 'test-container-component',
      template: '',
    })
    class TestContainerComponent {
      items = [0];

      buttonDestroyed = false;

      listVisible = true;
    }

    TestBed.configureTestingModule({
      declarations: [TestContainerComponent],
      imports: [DxButtonModule, DxListModule],
    });

    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `
                    <dx-list *ngIf="listVisible" [items]="items">
                        <dx-button text="Test" (onDisposing)="buttonDestroyed = true" *dxTemplate="let item of 'item'"></dx-button>
                    </dx-list>
                `,
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    fixture.componentInstance.listVisible = false;
    fixture.detectChanges();

    expect(fixture.componentInstance.buttonDestroyed).toBe(true);
  });
});
