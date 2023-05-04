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

import { BrowserTransferStateModule } from '@angular/platform-browser';

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
                BrowserTransferStateModule
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
});
