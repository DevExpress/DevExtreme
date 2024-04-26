/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxTagBoxModule,
    DxTagBoxComponent
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    @ViewChild(DxTagBoxComponent) tagBox: DxTagBoxComponent;

    value: number[] = [];
    testMethod() {}
}

describe('DxTagBox', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxTagBoxModule]
            });
    });

    // spec
    it('value change should be fired once', () => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-tag-box [items]="[1, 2, 3]" [(value)]="value" (onValueChanged)="testMethod()">
                    </dx-tag-box>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        expect(testSpy).toHaveBeenCalledTimes(0);

        let instance: any = fixture.componentInstance.tagBox.instance;
        instance.option('value', [2]);

        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(1);
    });

    it('value change should be fired once after remove tag', () => {
        let testSpy = spyOn(TestContainerComponent.prototype, 'testMethod');
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-tag-box [items]="[1, 2, 3]" [value]="[1, 2]" (onValueChanged)="testMethod()">
                    </dx-tag-box>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(0);
        let instance: any = fixture.componentInstance.tagBox.instance,
            removeButton = instance.element().querySelector('.dx-tag-remove-button');
        removeButton.click();
        fixture.detectChanges();
        expect(testSpy).toHaveBeenCalledTimes(1);
    });
});
