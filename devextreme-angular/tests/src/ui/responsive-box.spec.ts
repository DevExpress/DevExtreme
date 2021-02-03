/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxResponsiveBoxModule,
    DxResponsiveBoxComponent
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    @ViewChild(DxResponsiveBoxComponent) innerWidget: DxResponsiveBoxComponent;
    screenByWidth() {
        return 'sm';
    }
}

describe('DxResponsiveBox', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxResponsiveBoxModule]
            });
    });

    // spec
    it('should be able to accept item locations as dxi components', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-responsive-box
                        [rows]="[{ ratio: 1 }]"
                        [cols]="[{ ratio: 1 }]"
                        [height]="480"
                        singleColumnScreen="sm"
                        [(screenByWidth)]="screen">
                        <dxi-item>
                            <dxi-location
                                [row]="0"
                                [col]="0"
                                [colspan]="1"
                                screen="lg">
                            </dxi-location>
                            <p>Header</p>
                        </dxi-item>
                    </dx-responsive-box>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.innerWidget.instance;
        fixture.detectChanges();

        expect(instance.option('items')[0].location.length).toBe(1);
        expect(instance.option('items')[0].location[0].row).toBe(0);
        expect(instance.option('items')[0].location[0].col).toBe(0);
        expect(instance.option('items')[0].location[0].colspan).toBe(1);
        expect(instance.option('items')[0].location[0].screen).toBe('lg');
    });

});
