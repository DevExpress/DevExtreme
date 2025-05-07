/* tslint:disable:component-selector */

import {
    Component
} from '@angular/core';
import {
    TestBed
} from '@angular/core/testing';

import {
    DevExtremeModule
} from 'devextreme-angular';

import renderer from 'devextreme/core/renderer';

import { DxServerModule } from 'devextreme-angular/server';

import {
    componentNames
} from './component-names';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
}

describe('Universal', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [
                DxServerModule,
                DevExtremeModule,
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

    it('should not throw error if core/renderer is called (T1255582)', async () => {
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
