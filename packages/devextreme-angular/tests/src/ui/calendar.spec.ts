/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import { BrowserTransferStateModule } from '@angular/platform-browser';

import {
    DxCalendarModule,
    DxCalendarComponent
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    @ViewChild(DxCalendarComponent) calendar: DxCalendarComponent;

    value: any = [];
    testMethod() {}
}

describe('DxCalendar', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxCalendarModule, BrowserTransferStateModule]
            });
    });

    // spec
    it('should take iterable and no-iterable values without exception', () => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-calendar [(value)]="value" selectionMode="multiple" (onValueChanged)="testMethod()">
                    </dx-calendar>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        expect(testSpy).toHaveBeenCalledTimes(0);

        let instance: any = fixture.componentInstance.calendar.instance;
        console.log('---------------1-instance.option(\'value\');', instance.option('value'))
        instance.option('selectionMode', 'single');
        fixture.detectChanges();
        console.log('---------------2-instance.option(\'value\');', instance.option('value'))
        instance.option('value', new Date());
        fixture.detectChanges();
        console.log('---------------3-instance.option(\'value\');', instance.option('value'));
    });
;
});
