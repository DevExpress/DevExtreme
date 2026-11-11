/* tslint:disable:component-selector */
import {
  Component,
  ViewChild,
} from '@angular/core';

import {
  TestBed,
} from '@angular/core/testing';

import {
  DxChartModule, DxChartComponent, DxScrollViewModule,
} from 'devextreme-angular';

import dxChart from 'devextreme/viz/chart';
import { detectChanges } from '../helpers/change-detection';

@Component({
  standalone: false,
  selector: 'test-container-component',
  template: '',
})
class TestContainerComponent {
  strips: any[] = [{
    label: 'label1',
  }];

  @ViewChild(DxChartComponent) chart: DxChartComponent;

  dataSource: any[] = [];

  disposed = false;

  commonSeriesSettings = {
    argumentField: undefined,
  };

  seriesAsArray: any[] = [];

  seriesAsObject = {
    valueField: undefined,
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
        imports: [DxChartModule, DxScrollViewModule],
      },
    );
  });

  // spec
  it('visualizsation widgets should have display:"block" style', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-chart [dataSource]="[]"></dx-chart>',
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const outerComponent = fixture.componentInstance;
    const { chart } = outerComponent;
    const element: any = chart.instance.element();

    expect(window.getComputedStyle(element).display).toBe('block');
  });

  it('should not repainting twice in change detection cycle after applying options directly', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `<dx-chart
                    [dataSource]="dataSource"
                    [series]="seriesAsArray"
                    [commonSeriesSettings]="{ argumentField: 'name' }"
                ></dx-chart>`,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const { chart } = testComponent;
    const spy = vi.spyOn(chart.instance as dxChart & { _applyChanges: () => void }, '_applyChanges').mockImplementation(() => {});

    testComponent.dataSource = [{
      name: 1,
      value: 2,
    }];
    testComponent.seriesAsArray = [
      { valueField: 'value' },
    ];

    detectChanges(fixture);

    expect(spy.mock.calls.length).toBe(1);
  });

  it('should not repainting twice in change detection cycle after detect changes in arrays', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: `<dx-chart
                    [dataSource]="dataSource"
                    [series]="seriesAsArray"
                    [commonSeriesSettings]="{ argumentField: 'name' }"
                ></dx-chart>`,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const { chart } = testComponent;
    const spy = vi.spyOn(chart.instance as dxChart & { _applyChanges: () => void }, '_applyChanges').mockImplementation(() => {});

    testComponent.dataSource.push({
      name: 1,
      value: 2,
    });
    testComponent.seriesAsArray.push({
      valueField: 'value',
    });

    detectChanges(fixture);

    expect(spy.mock.calls.length).toBe(1);
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
                </dx-chart>`,
      },
    });
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const { instance } = fixture.componentInstance.chart;

    expect(instance.option('argumentAxis.strips[0].label.text')).toBe('label1');

    fixture.componentInstance.strips[0].label = 'label2';
    detectChanges(fixture);

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
                </dx-chart>`,
      },
    });

    vi.useRealTimers();
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(TestContainerComponent);
    fixture.detectChanges();

    const testComponent = fixture.componentInstance;
    const { instance } = testComponent.chart;
    instance.dispose();
    fixture.detectChanges();
    fixture.destroy();
    expect(testComponent.disposed);
    vi.useRealTimers();
  });
});
