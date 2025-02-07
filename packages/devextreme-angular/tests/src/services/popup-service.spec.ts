import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { DxPopupService, type DxPopupTypes } from 'devextreme-angular/ui/popup';
import { DxButtonModule } from 'devextreme-angular/ui/button';

import 'devextreme/dist/css/dx.light.css';

@Component({
  standalone: true,
  imports: [DxButtonModule],
  selector: '',
  template: `<div class="popup-content" style="height:300px">
        <dx-button text="Test Button" (onClick)="onClick()"></dx-button>
    </div>`,
})
class PopupContentComponent {
  @Input() onClick = () => {};
}

describe('Using DxPopupService', () => {
  let popupService: DxPopupService;

  beforeEach(() => {
    popupService = TestBed.inject(DxPopupService);
  });

  it('DxPopupService opens DxPopup with component passed as argument', fakeAsync(() => {
    const TITLE_MIN_WIDTH = 150;
    const POPUP_CONTENT_MAX_HEIGHT = 240;
    const popupOptions: DxPopupTypes.Properties = {
      showTitle: true,
      showCloseButton: true,
      title: 'TEST-POPUP-TITLE',
      height: 400,
      width: 600,
      toolbarItems: [{
        location: 'after',
        toolbar: 'bottom',
        widget: 'dxButton',
        options: {
          text: 'Disable',
        },
      }],
      onShown() {
        isPopupHidden = false;
      },
    };

    let isPopupHidden = true;

    const popupRef = popupService.open(PopupContentComponent, popupOptions);

    popupRef.onHidden.subscribe(() => {
      isPopupHidden = true;
    });

    expect(popupRef.contentRef.instance).toBeTruthy();

    popupRef.contentRef.instance.onClick = () => {
      popupRef.visible = false;
    };

    const popupEl: HTMLElement = document.querySelector('.dx-overlay-wrapper.dx-popup-wrapper .dx-overlay-content.dx-popup-normal');
    const popupCloseEl = popupEl.querySelector('.dx-toolbar .dx-button .dx-icon-close');
    const popupContentButtonEl: HTMLButtonElement = popupEl.querySelector('.popup-content .dx-button');

    const popupTitleBarEl: HTMLElement = popupEl.querySelector('.dx-toolbar .dx-toolbar-before .dx-toolbar-label');
    const popupContentEl: HTMLElement = popupEl.querySelector('.dx-popup-content');

    tick(500);

    expect(isPopupHidden).toBeFalsy();
    expect(popupEl).toBeTruthy();
    expect(popupCloseEl).toBeTruthy();
    expect(Number.parseInt(popupTitleBarEl.style.maxWidth, 10)).toBeGreaterThan(TITLE_MIN_WIDTH);
    expect(Number.parseInt(popupContentEl.style.height, 10)).toBeLessThan(POPUP_CONTENT_MAX_HEIGHT);
    expect(popupContentButtonEl.textContent).toEqual('Test Button');

    popupContentButtonEl.click();

    tick(500);

    expect(isPopupHidden).toBeTruthy();
    expect(popupRef.contentRef.hostView.destroyed).toBeTruthy();
  }));
});
