/* tslint:disable:component-selector */

import {
    Component,
    ViewChild
} from '@angular/core';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxToolbarModule,
    DxToolbarComponent
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    @ViewChild(DxToolbarComponent) innerWidget: DxToolbarComponent;
}

describe('DxToolbar', () => {

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                declarations: [TestContainerComponent],
                imports: [DxToolbarModule]
            });
    });

    // spec
    it('should not initialize the "items" property of an item if no children are declared inside the item (T472434)', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    <dx-toolbar>
                        <dxi-item>Item1</dxi-item>
                    </dx-toolbar>
                `
            }
        });
        let fixture = TestBed.createComponent(TestContainerComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance.innerWidget.instance;
        expect(instance.option('items')[0].items).toBe(undefined);
        expect(instance.element().querySelector('.dx-toolbar-item').textContent).toBe('Item1');
    });

});
