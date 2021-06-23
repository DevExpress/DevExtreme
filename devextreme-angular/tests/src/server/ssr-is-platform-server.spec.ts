/* tslint:disable:component-selector */

import {
    Component,
    PLATFORM_ID
} from '@angular/core';

import { isPlatformServer } from '@angular/common';

import { TransferState } from '@angular/platform-browser';

import {
    TestBed
} from '@angular/core/testing';

import {
    DxTextBoxModule,
    getServerStateKey
} from 'devextreme-angular';

@Component({
    selector: 'test-container-component',
    template: ''
})
class TestContainerComponent {
    renderedOnServer: false;
    initializedHandler(e) {
        this.renderedOnServer = e.component.option('integrationOptions.renderedOnServer');
    }
}

describe('Universal', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestContainerComponent],
            imports: [
                DxTextBoxModule
            ]
        });
    });

    // spec
    it('should set transfer state for rendererdOnServer option of integration', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-text-box></dx-text-box>`
            }
        });
        let platformID = TestBed.get(PLATFORM_ID);
        if (isPlatformServer(platformID)) {
            let fixture = TestBed.createComponent(TestContainerComponent);
            fixture.detectChanges();

            const transferState: TransferState = TestBed.get(TransferState);

            expect(transferState.hasKey(getServerStateKey())).toBe(true);
            expect(transferState.get(getServerStateKey(), null as any)).toEqual(true);
        }
    });

    it('should set rendererdOnServer option of integration', () => {
        TestBed.overrideComponent(TestContainerComponent, {
            set: {
                template: `<dx-text-box (onInitialized)="initializedHandler($event)"></dx-text-box>`
            }
        });

        let fixture = TestBed.createComponent(TestContainerComponent);
        const transferState: TransferState = TestBed.get(TransferState);

        transferState.set(getServerStateKey(), true as any);

        fixture.detectChanges();

        expect(fixture.componentInstance.renderedOnServer).toBe(true);
    });
});
