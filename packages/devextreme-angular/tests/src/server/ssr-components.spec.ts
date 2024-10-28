/* tslint:disable:component-selector */

import {
    Component
} from '@angular/core';
import {
    TestBed
} from '@angular/core/testing';

import {
    DevExtremeModule, DxDataGridModule
} from 'devextreme-angular';

import renderer from 'devextreme/core/renderer';

import { DxServerModule } from 'devextreme-angular/server';

import {
    componentNames
} from './component-names';
import {DxoDataGridGroupPanelModule} from "devextreme-angular/ui/data-grid/nested";

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    dataSource = [{"FullName": "bob"}, {"FullName": "charlie"}, {"FullName": "cheryl"}];
    isVisible: true
}

describe('Universal', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [
                DxServerModule,
                DevExtremeModule,
                DxDataGridModule,
                DxoDataGridGroupPanelModule,
            ]
        });
    });

    // spec
    it('should render all components', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `
                    ${componentNames.map((name) => `<dx-${name}></dx-${name}>`).join('')}
                `
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        expect(fixture.detectChanges.bind(fixture)).not.toThrow();
    });

    fit('should no error if renderer is called (T1255582)', async () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<div></div>`
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);

        fixture.detectChanges();

        expect(() => renderer(fixture.nativeElement).filter(':visible')).not.toThrow();
    });
});
