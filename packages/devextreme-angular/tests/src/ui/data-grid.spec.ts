/* tslint:disable:component-selector */
import {
    Component,
    ViewChildren,
    QueryList,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxDataGridModule,
    DxDataGridComponent
} from 'devextreme-angular';

import DxDataGrid from 'devextreme/ui/data_grid';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    showComponent = true;
    selectionCount = 0;
    dataSource = [{
        id: 1,
        string: 'String',
        date: new Date(),
        dateString: '1995/01/15',
        boolean: true,
        number: 10
    }];
    columns: { dataField: string; dataType?: string, visible?: boolean; }[] = [
        { dataField: 'string', visible: true },
        { dataField: 'date' },
        { dataField: 'dateString', dataType: 'date' },
        { dataField: 'boolean' },
        { dataField: 'number' }
    ];

    dataSourceWithUndefined = [{ obj: { field: undefined } }];

    columsChanged = 0;
    @ViewChildren(DxDataGridComponent) innerWidgets: QueryList<DxDataGridComponent>;

    testMethod() { }

    getCellValue() {
        return {};
    }
    onRowPrepared() { }

    onOptionChanged(e) {
        if (e.name === 'columns') {
            this.columsChanged++;
        }
    }

    selectionChanged() {
        this.selectionCount++;
    }
}


describe('DxDataGrid', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxDataGridModule]
            });
    });

    // spec
    it('should not fall into infinite loop', (done) => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-data-grid [columns]="columns" [dataSource]="dataSource"></dx-data-grid>'
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        setTimeout(() => {
            fixture.detectChanges();

            done();
        }, 0);
    });

    it('should update columns', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-data-grid [(columns)]="columns" [dataSource]="dataSource"></dx-data-grid>'
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();

        const fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        jasmine.clock().tick(101);

        const component = fixture.componentInstance;
        expect(component.columns[0].visible).toBe(true);

        const instance = component.innerWidgets.first.instance;
        instance.option('columns[0].visible', false);

        fixture.detectChanges();
        expect(component.columns[0].visible).toBe(false);
    });

    it('should react to item option change from undefined', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                <dx-data-grid
                    [columns]="['obj.field']"
                    [dataSource]="dataSourceWithUndefined">
                </dx-data-grid>`
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        jasmine.clock().tick(101);

        let testComponent = fixture.componentInstance;

        testComponent.dataSourceWithUndefined[0].obj.field = true;
        fixture.detectChanges();

        let cells = fixture.nativeElement.querySelectorAll('.dx-data-row td');
        let firstCellContent = cells[0].innerText;

        expect(cells.length).toEqual(1);
        expect(firstCellContent).toBe('true');

        jasmine.clock().uninstall();
    });

    it('should fire onToolbarPreparing event', () => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: '<dx-data-grid (onToolbarPreparing)="testMethod()"></dx-data-grid>'
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(1);
    });

    it('should accept recursive columns defined by nested components', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                <dx-data-grid>
                    <dxi-column caption="Test">
                        <dxi-column dataField="Field"></dxi-column>
                    </dxi-column>
                </dx-data-grid>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        const column = fixture.componentInstance.innerWidgets.first.columns[0];

        if (typeof column === 'string') {
            fail();
        } else {
            expect(column?.columns?.length).toBe(1);
            expect(column?.columns?.[0]['dataField']).toBe('Field');
        }
    });

    it('should create rows only once when value of cells is an object', () => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'onRowPrepared');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-data-grid [dataSource]="[{text: 'text'}]" (onRowPrepared)="onRowPrepared()">
                    <dxo-editing mode="popup" [allowUpdating]="true"></dxo-editing>
                    <dxi-column dataField="text"></dxi-column>
                    <dxi-column [calculateCellValue]="getCellValue"></dxi-column>
                </dx-data-grid>`
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        jasmine.clock().tick(101);

        fixture.componentInstance.innerWidgets.last.instance.editRow(0);
        fixture.detectChanges();

        expect(testSpy).toHaveBeenCalledTimes(2);
        jasmine.clock().uninstall();
    });

    it('should reset nested option', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-data-grid [dataSource]="[{text: 'text'}]">
                    <dxo-column-chooser *ngIf="showComponent" [enabled]="true"></dxo-column-chooser>
                    <dxi-column dataField="text"></dxi-column>
                </dx-data-grid>`
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();

        let fixture = TestBed.createComponent(TestContainerComponent);

        fixture.detectChanges();

        jasmine.clock().tick(101);
        let testComponent = fixture.componentInstance;
        const instance = testComponent.innerWidgets.last.instance;
        expect(instance?.option('columnChooser')?.enabled).toBe(true);

        testComponent.showComponent = false;
        fixture.detectChanges();
        expect(instance?.option('columnChooser')?.enabled).toBe(false);
        jasmine.clock().uninstall();
    });

    it('should not call onSelectionChanged when selection is resetting', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-data-grid *ngIf="showComponent"
                    [dataSource]="[{id: 1, text: 'text'}, {id: 2, text: 'text2'}]"
                    keyExpr="id"
                    [selectedRowKeys]="[2]"
                    (onSelectionChanged)="selectionChanged()">
                    <dxo-selection mode="single"></dxo-selection>
                    <dxi-column dataField="text"></dxi-column>
                </dx-data-grid>`
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();

        let fixture = TestBed.createComponent(TestContainerComponent);

        fixture.detectChanges();

        jasmine.clock().tick(101);
        let testComponent = fixture.componentInstance;
        testComponent.showComponent = false;
        fixture.detectChanges();
        expect(testComponent.selectionCount).toBe(0);
        jasmine.clock().uninstall();
    });

    it('should destroy devextreme components in template correctly', () => {
        @Component({
            selector: 'test-container-component',
            template: ''
        })
        class TestGridComponent {
            isDestroyed = false;

            onCellPrepared(args) {
                new DxDataGrid(args.cellElement, {
                    onDisposing: () => {
                        this.isDestroyed = true;
                    }
                });
            }
        }

        TestBed.configureTestingModule({
            declarations: [TestGridComponent],
            imports: [DxDataGridModule]
        });

        TestBed.overrideComponent(TestGridComponent, {
            set: {
                template: `
                    <dx-data-grid [dataSource]="[{ text: 1 }]" (onCellPrepared)="onCellPrepared($event)">
                    </dx-data-grid>
                `
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();

        let fixture = TestBed.createComponent(TestGridComponent);
        fixture.detectChanges();
        jasmine.clock().tick(101);

        fixture.destroy();

        expect(fixture.componentInstance.isDestroyed).toBe(true);
        jasmine.clock().uninstall();
    });

    // https://supportcenter.devexpress.com/internal/ticket/details/T1124163
    it('should update template with dynamic name', () => {
        const columnsA = [
            { field: 'SomeFieldA', caption: 'FieldA', cellTemplateName: 'templateA' },
            { field: 'otherField', caption: 'Other field1', cellTemplateName: undefined }
        ];

        const columnsB = [
            { field: 'SomeFieldB', caption: 'FieldB', cellTemplateName: 'templateB' },
            { field: 'otherField', caption: 'Other field2', cellTemplateName: undefined }
        ];
        @Component({
            selector: 'test-container-component',
            template: ''
        })
        class TestGridComponent {
            @ViewChild('#gridContainer') grid: DxDataGridComponent;
            dataSource: any[];
            columns: any[];

            constructor() {
                this.dataSource = [{ ID: 0, SomeFieldA: 'a0', otherField: 'b0' }];
                this.columns = columnsA;
            }
            toggleData() {
                if (this.columns[0].field === 'SomeFieldA') {
                    this.columns = columnsB;
                } else {
                    this.columns = columnsA;
                }
            }
        }

        TestBed.configureTestingModule({
            declarations: [TestGridComponent],
            imports: [DxDataGridModule]
        });

        TestBed.overrideComponent(TestGridComponent, {
            set: {
                template: `
                <dx-data-grid id="gridContainer" [dataSource]="dataSource" [repaintChangesOnly]="true">
                  <dxo-sorting mode="none"></dxo-sorting>
                
                  <ng-container *ngFor="let col of columns">
                    <dxi-column [caption]="col.caption" [dataField]="col.field" [cellTemplate]="col.cellTemplateName">
                    </dxi-column>
                
                    <div *dxTemplate="let cell of col.cellTemplateName">
                      <div *ngIf="col.cellTemplateName === 'templateA'">
                        someTemplateA
                      </div>
                      <div *ngIf="col.cellTemplateName === 'templateB'">
                        <div class="templBClass">someTemplateB</div>
                      </div>
                    </div>
                
                  </ng-container>
                </dx-data-grid>`
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();

        let fixture = TestBed.createComponent(TestGridComponent);
        fixture.detectChanges();

        const component = fixture.componentInstance;
        component.toggleData();
        fixture.detectChanges();

        jasmine.clock().tick(101);
        expect(fixture.nativeElement.querySelector('.templBClass')).toBeTruthy();
        jasmine.clock().uninstall();
    });
});

describe('Nested DxDataGrid', () => {
    let originalTimeout;

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxDataGridModule]
            });

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    // NOTE: https://github.com/angular/angular/issues/18997
    it('should not update parent DxDataGrid with 30 dxi-column (T545977)', (done) => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-data-grid
                        [dataSource]="dataSource"
                        keyExpr="id"
                        [masterDetail]="{ enabled: true, template: 'detail' }"
                        (onOptionChanged)="onOptionChanged($event)">

                        <dxi-column dataField="string1"></dxi-column>
                        <dxi-column dataField="string2"></dxi-column>
                        <dxi-column dataField="string3"></dxi-column>
                        <dxi-column dataField="string4"></dxi-column>
                        <dxi-column dataField="string5"></dxi-column>
                        <dxi-column dataField="string6"></dxi-column>
                        <dxi-column dataField="string7"></dxi-column>
                        <dxi-column dataField="string8"></dxi-column>
                        <dxi-column dataField="string9"></dxi-column>
                        <dxi-column dataField="string10"></dxi-column>
                        <dxi-column dataField="string11"></dxi-column>
                        <dxi-column dataField="string12"></dxi-column>
                        <dxi-column dataField="string13"></dxi-column>
                        <dxi-column dataField="string14"></dxi-column>
                        <dxi-column dataField="string15"></dxi-column>

                        <div *dxTemplate="let data of 'detail'">
                            <dx-data-grid [dataSource]="dataSource">
                                <dxi-column dataField="number1"></dxi-column>
                                <dxi-column dataField="number2"></dxi-column>
                                <dxi-column dataField="number3"></dxi-column>
                                <dxi-column dataField="number4"></dxi-column>
                                <dxi-column dataField="number5"></dxi-column>
                                <dxi-column dataField="number6"></dxi-column>
                                <dxi-column dataField="number7"></dxi-column>
                                <dxi-column dataField="number8"></dxi-column>
                                <dxi-column dataField="number9"></dxi-column>
                                <dxi-column dataField="number10"></dxi-column>
                                <dxi-column dataField="number11"></dxi-column>
                                <dxi-column dataField="number12"></dxi-column>
                                <dxi-column dataField="number13"></dxi-column>
                                <dxi-column dataField="number14"></dxi-column>
                                <dxi-column dataField="number15"></dxi-column>
                            </dx-data-grid>
                        </div>
                    </dx-data-grid>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        setTimeout(() => {
            fixture.detectChanges();

            let testComponent = fixture.componentInstance,
                widgetComponent = testComponent.innerWidgets.first;

            widgetComponent.instance.expandRow(1);
            fixture.detectChanges();

            setTimeout(() => {
                fixture.detectChanges();

                expect(testComponent.columsChanged).toBe(0);
                testComponent.columsChanged = 0;

                done();
            }, 1000);
        }, 1000);
    });

    it('should render a template with data when zone is stable (T869744)', (done) => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-data-grid
                        [dataSource]="dataSource"
                        keyExpr="id">
                        <dxo-scrolling mode="virtual"></dxo-scrolling>
                        <dxi-column dataField="string" cellTemplate="cellTemplate"></dxi-column>

                        <div *dxTemplate="let data of 'cellTemplate'">
                            <div class="my-template">{{data.value}}</div>
                        </div>
                    </dx-data-grid>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        setTimeout(() => {
            let instance = fixture.componentInstance.innerWidgets.first.instance;
            let element = instance.element().querySelector('.my-template');
            expect(element?.textContent).toBe('String');
            done();
        }, 1000);
    });

    it('should render a template with dynamic content once (T1269950)', (done) => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-data-grid
                        [dataSource]="dataSource"
                        (onOptionChanged)="onOptionChanged($event)"
                        keyExpr="id">
                        <dxi-column dataField="string" cellTemplate="cellTemplate"></dxi-column>

                        <ng-container *dxTemplate="let data of 'cellTemplate'">
                            <ng-container *ngIf="true"><div class="my-template">test value</div></ng-container>
                        </ng-container>
                    </dx-data-grid>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        setTimeout(() => {
            fixture.detectChanges();
            let instance = fixture.componentInstance.innerWidgets.first.instance;
            let element = instance.element().querySelector('.my-template');
            expect(fixture.componentInstance.columsChanged).toBe(0);
            instance.focus(element);

            setTimeout(() => {
                expect(fixture.componentInstance.columsChanged).toBe(0);
                fixture.componentInstance.columsChanged = 0;

                done();
            }, 1000);
        }, 1000);
    });
});
