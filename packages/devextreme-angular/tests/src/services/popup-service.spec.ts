import { TestBed } from '@angular/core/testing';

import { DxPopupService } from 'devextreme-angular/services';
import {DxButtonModule} from 'devextreme-angular';
import {Component, Input} from '@angular/core';

const interceptors: Record<string, () => void> = {};

interceptors.interceptorFn = () => {};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

@Component({
    selector: 'stub-component',
    template: '<div class="stub"></div>'
})
class StubComponent {}

@Component({
    standalone: true,
    imports: [DxButtonModule],
    selector: '',
    template: `<div class="popup-content">
        <dx-button text="Test Button" (onClick)="onClick()"></dx-button>
    </div>`
})
class PopupContentComponent {
    @Input() onClick = () => {};
}

describe('Using DxPopupService', () => {
    let popupService: DxPopupService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StubComponent],
            imports: [],
            providers: [],
        });

        popupService = TestBed.inject(DxPopupService);
    });

    it('DxPopupService opens DxPopup with component passed as argument', (done) => {
        let fixture = TestBed.createComponent(StubComponent);

        const popupRef = popupService.open(PopupContentComponent, { showTitle: true, showCloseButton: true });

        popupRef.onHidden.subscribe(() => {
            done();
        });

        popupRef.contentComponentRef.instance.onClick = () => {
            popupRef.visible = false;
        };

        fixture.detectChanges();

        const popupEl = document.querySelector('.dx-overlay-wrapper.dx-popup-wrapper .dx-overlay-content.dx-popup-normal');
        const popupCloseEl = popupEl.querySelector('.dx-toolbar .dx-button .dx-icon-close');
        const popupContentComponentEl: HTMLButtonElement = popupEl.querySelector('.popup-content .dx-button');

        expect(popupEl).toBeTruthy();
        expect(popupCloseEl).toBeTruthy();
        expect(popupRef.contentComponentRef).toBeTruthy();
        expect(popupContentComponentEl.textContent).toEqual('Test Button');

        popupContentComponentEl.click();
    });
});
