/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxSelectBoxModule,
    DxTextBoxModule,
    DxSelectBoxComponent
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    @ViewChild(DxSelectBoxComponent) selectBox: DxSelectBoxComponent;

    changeOption(e) {
        if (e.value === 2) {
            this.selectBox.value = 1;
        }
    }
}

describe('DxSelectBox', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxSelectBoxModule, DxTextBoxModule]
            });
    });

    // spec
    it('field template should work', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-select-box fieldTemplate="myTemplate">
                        <div *dxTemplate="let data of 'myTemplate'">
                            <dx-text-box [value]="data"></dx-text-box>
                        </div>
                    </dx-select-box>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.selectBox.instance;

        expect(instance.element().querySelectorAll('.dx-textbox').length).toBe(1);
    });

    // spec
    it('should update value on action', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-select-box [items]="[1, 2, 3]" (onOptionChanged)="changeOption($event)">
                    </dx-select-box>
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let selectBox = fixture.componentInstance.selectBox;
        let instance = selectBox.instance;

        instance.option('value', 2);
        expect(instance.option('text')).toBe(1);

        instance.option('value', 2);
        expect(instance.option('text')).toBe(1);
    });
});
