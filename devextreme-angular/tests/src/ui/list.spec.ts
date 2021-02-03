/* tslint:disable:component-selector */

import {
    VERSION,
    Component,
    ViewChild,
    AfterViewChecked,
    OnDestroy
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import DxButton from 'devextreme/ui/button';

import {
    DxButtonModule,
    DxListModule,
    DxListComponent
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent implements AfterViewChecked {
    emptyItems = undefined;
    items = [1];
    complexItems = [{ text: 'Item 1' }];
    emptyDataSource = { items: [] };
    defaultTemplateItems = [{ text: 'test', disabled: false }];
    disabled = false;
    @ViewChild(DxListComponent) innerWidget: DxListComponent;

    ngAfterViewChecked() {}

}

describe('DxList', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxListModule]
            });
    });

    // spec
    it('should react to collection change', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-list [items]="items"></dx-list>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = testComponent.innerWidget.instance;

        let optionSpy = spyOn(instance, 'option').and.callThrough();

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
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = testComponent.innerWidget.instance;

        testComponent.emptyDataSource = { items: [] };
        fixture.detectChanges();

        testComponent.emptyDataSource.items.push({ id: 1 });
        fixture.detectChanges();

        expect(instance.option('items').length).toBe(1);
    });

    it('should not react if the same value is assigned to the collection', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-list [items]="items"></dx-list>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = testComponent.innerWidget.instance;

        let optionSpy = spyOn(instance, 'option').and.callThrough();

        testComponent.items = testComponent.items;
        fixture.detectChanges();

        expect(instance.option).toHaveBeenCalledTimes(1);
        optionSpy.calls.reset();
    });

    it('should be able to accept items as a static nested components list', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item>Item 1</dxi-item>
                        <dxi-item>Item 2</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.innerWidget.instance;
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('Item 1');
        expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('Item 2');
    });

    it('should have correct item template', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item>item</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.innerWidget.instance;
        let element = instance.element().querySelector('.dx-item-content');
        expect(element.innerHTML).toBe('item');
        expect(window.getComputedStyle(element).display).toBe('block');
    });

    it('should react to item option change', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-list [(items)]="defaultTemplateItems"></dx-list>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = testComponent.innerWidget.instance;

        testComponent.defaultTemplateItems[0].disabled = true;
        fixture.detectChanges();

        let listItems = instance.element().querySelectorAll('.dx-list-item');
        let listItemHasDisabledClass = listItems[0].classList.contains('dx-state-disabled');

        expect(listItems.length).toEqual(1);
        expect(listItemHasDisabledClass).toBeTruthy();
    });

    it('should use properties of the nested components', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item [disabled]="true">Item 1</dxi-item>
                        <dxi-item>Item 2</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.innerWidget.instance;
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item.dx-state-disabled').length).toBe(1);
    });

    it('nested component property bindings work', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item [disabled]="disabled">Item 1</dxi-item>
                        <dxi-item>Item 2</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = testComponent.innerWidget.instance;

        expect(instance.element().querySelectorAll('.dx-item.dx-state-disabled').length).toBe(0);

        testComponent.disabled = true;
        fixture.detectChanges();

        expect(instance.element().querySelectorAll('.dx-item.dx-state-disabled').length).toBe(1);
    });

    it('should be able to accept items as an *ngFor components list', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item *ngFor="let item of items">{{item}}</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = testComponent.innerWidget.instance;

        expect(instance.option('items').length).toBe(1);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(1);
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('1');

        testComponent.items.push(2);
        fixture.detectChanges();

        expect(instance.option('items').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('1');
        expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('2');
    });

    it('should be able to replace items by ng-for', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item *ngFor="let item of items" [badge]="10">{{item}}</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent),
            testComponent = fixture.componentInstance;

        testComponent.items = [1, 2];
        fixture.detectChanges();

        let instance = testComponent.innerWidget.instance;

        testComponent.items = [3, 4];
        fixture.detectChanges();

        expect(instance.option('items').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('3');
        expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('4');
    });

    it('should be able to clear items rendered with *ngFor', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item *ngFor="let item of items">{{item}}</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = testComponent.innerWidget.instance;

        expect(instance.option('items').length).toBe(1);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(1);
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('1');

        testComponent.items.pop();
        expect(testComponent.items.length).toBe(0);
        fixture.detectChanges();

        expect(instance.option('items').length).toBe(0);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(0);
    });

    it('should respond to items changes rendered with ngFor', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item *ngFor="let item of complexItems">{{item.text}}</dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            instance = testComponent.innerWidget.instance;

        expect(instance.option('items').length).toBe(1);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(1);
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('Item 1');

        let optionSpy = spyOn(instance, 'option').and.callThrough();
        fixture.detectChanges();
        expect(instance.option).not.toHaveBeenCalled;

        testComponent.complexItems.push({ text: 'Item 2' });
        fixture.detectChanges();

        expect(instance.option).toHaveBeenCalled;
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('Item 1');
        expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('Item 2');

        optionSpy.calls.reset();
        testComponent.complexItems[0].text = 'Changed';
        fixture.detectChanges();

        expect(optionSpy).toHaveBeenCalledTimes(1);
        expect(optionSpy.calls.allArgs().length).toBe(1);
        expect(instance.option('items').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content').length).toBe(2);
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('Changed');
        expect(instance.element().querySelectorAll('.dx-item-content')[1].textContent).toBe('Item 2');
        optionSpy.calls.reset();
    });

    it('should be able to set option "template" for each item', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item [template]="'testTemplate'"></dxi-item>

                        <div *dxTemplate="let item of 'testTemplate'">testTemplate</div>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.innerWidget.instance;
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('testTemplate');
    });

    it('should be able to define item without template', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item text="TestText"></dxi-item>
                    </dx-list>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.innerWidget.instance;
        expect(instance.element().querySelectorAll('.dx-item-content')[0].textContent).toBe('TestText');
    });

    it('should destroy angular components inside template', () => {
        let destroyed = false;
        @Component({
            selector: 'destroyable-component',
            template: ''
        })
        class DestroyableComponent implements OnDestroy {
            ngOnDestroy() {
                destroyed = true;
            }
        }

        TestBed.configureTestingModule({
            declarations: [DestroyableComponent, TestContainerComponent],
            imports: [DxListModule]
        });

        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list [items]="items">
                        <div *dxTemplate="let item of 'item'">
                            <destroyable-component></destroyable-component>
                        </div>
                    </dx-list>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        fixture.componentInstance.items = [];
        fixture.detectChanges();

        expect(destroyed).toBe(true);
    });

    it('should destroy devextreme components inside template', () => {
        @Component({
            selector: 'test-container-component',
            template: ''
        })
        class TestContainerComponent {
            items = [0];
            buttonDestroyed = false;
            listVisible = true;
        }

        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [DxButtonModule, DxListModule]
        });

        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list *ngIf="listVisible" [items]="items">
                        <div *dxTemplate="let item of 'item'">
                            <dx-button text="Test" (onDisposing)="buttonDestroyed = true"></dx-button>
                        </div>
                    </dx-list>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        fixture.componentInstance.listVisible = false;
        fixture.detectChanges();

        expect(fixture.componentInstance.buttonDestroyed).toBe(true);
    });

    it('should destroy devextreme components in template root correctly', () => {
        @Component({
            selector: 'test-container-component',
            template: ''
        })
        class TestContainerComponent {
            items = [0];
            buttonDestroyed = false;
            listVisible = true;
        }

        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [DxButtonModule, DxListModule]
        });

        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list *ngIf="listVisible" [items]="items">
                        <dx-button text="Test" (onDisposing)="buttonDestroyed = true" *dxTemplate="let item of 'item'"></dx-button>
                    </dx-list>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        fixture.componentInstance.listVisible = false;
        fixture.detectChanges();

        expect(fixture.componentInstance.buttonDestroyed).toBe(true);
    });

    it('should use item template to render/rerender an item with a template (T532675)', () => {
        const ngTemplateName = Number(VERSION.major) >= 4 ? 'ng-template' : 'template';

        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [DxButtonModule, DxListModule]
        });

        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-list>
                        <dxi-item>
                            <dx-button *dxTemplate></dx-button>
                        </dxi-item>
                        <dxi-item>
                            <${ngTemplateName} dxTemplate>
                                <dx-button></dx-button>
                            </${ngTemplateName}>
                        </dxi-item>
                    </dx-list>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.innerWidget.instance;
        let elements = instance.element().querySelectorAll('.dx-button');
        expect(DxButton['getInstance'](elements[0])).not.toBeUndefined();
        expect(DxButton['getInstance'](elements[1])).not.toBeUndefined();

        instance.repaint();
        fixture.detectChanges();
        elements = instance.element().querySelectorAll('.dx-button');
        expect(DxButton['getInstance'](elements[0])).not.toBeUndefined();
        expect(DxButton['getInstance'](elements[1])).not.toBeUndefined();
    });
});
