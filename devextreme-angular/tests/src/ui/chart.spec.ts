/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxChartModule, DxChartComponent, DxScrollViewModule
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    strips: any[] = [{
        label: 'label1'
    }];
    @ViewChild(DxChartComponent) chart: DxChartComponent;
    dataSource = [];
    disposed = false;
    commonSeriesSettings = {
        argumentField: undefined
    };
    seriesAsArray = [];
    seriesAsObject = {
        valueField: undefined
    };

    onDisposing() {
        this.disposed = true;
    }
}

describe('DxChart', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxChartModule, DxScrollViewModule]
            });
    });

    // spec
    it('visualizsation widgets should have display:"block" style', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-chart [dataSource]="[]"></dx-chart>`
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

         let outerComponent = fixture.componentInstance,
             chart = outerComponent.chart,
             element: any = chart.instance.element();

        expect(window.getComputedStyle(element).display).toBe('block');
    });

    it('should not repainting twice in change detection cycle after applying options directly', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-chart
                    [dataSource]="dataSource"
                    [series]="seriesAsArray"
                    [commonSeriesSettings]="{ argumentField: 'name' }"
                ></dx-chart>`
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            chart = testComponent.chart,
            spy = spyOn(chart.instance, '_applyChanges');

        testComponent.dataSource = [{
            name: 1,
            value: 2
        }];
        testComponent.seriesAsArray = [
            { valueField: 'value'}
        ];

        fixture.detectChanges();

        expect(spy.calls.count()).toBe(1);
    });

    it('should not repainting twice in change detection cycle after detect changes in arrays', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-chart
                    [dataSource]="dataSource"
                    [series]="seriesAsArray"
                    [commonSeriesSettings]="{ argumentField: 'name' }"
                ></dx-chart>`
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let testComponent = fixture.componentInstance,
            chart = testComponent.chart,
            spy = spyOn(chart.instance, '_applyChanges');

        testComponent.dataSource.push({
            name: 1,
            value: 2
        });
        testComponent.seriesAsArray.push({
            valueField: 'value'
        });

        fixture.detectChanges();

        expect(spy.calls.count()).toBe(1);
    });

    it('should change strip', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                <dx-chart [dataSource]="[]" >
                    <dxo-argument-axis>
                         <dxi-strip *ngFor="let strip of strips">
                             <dxo-label [text]="strip.label">
                             </dxo-label>
                         </dxi-strip>
                    </dxo-argument-axis>
                </dx-chart>`
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.chart.instance;

        expect(instance.option('argumentAxis.strips[0].label.text')).toBe('label1');

        fixture.componentInstance.strips[0].label = 'label2';
        fixture.detectChanges();

        expect(instance.option('argumentAxis.strips[0].label.text')).toBe('label2');
    });

    it('should remove component by dispose method', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                <dx-chart [dataSource]="[{ ID: 1, Text: 'A', Value: '2' }]" (onDisposing)='onDisposing()'>
                    <dxi-series argumentField='Text' valueField='Value' type='bar' color='#f9ce2d'>
                        <dxo-label [visible]='false'> </dxo-label>
                    </dxi-series>
                </dx-chart>`
            }
        });

        jasmine.clock().uninstall();
        jasmine.clock().install();
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        const testComponent = fixture.componentInstance;
        const instance = testComponent.chart.instance;
        instance.dispose();
        fixture.detectChanges();
        fixture.destroy();
        expect(testComponent.disposed);
        jasmine.clock().uninstall();

    });
});
