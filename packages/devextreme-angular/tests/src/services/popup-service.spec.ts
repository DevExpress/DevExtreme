import { TestBed } from '@angular/core/testing';
import { DxPopupService } from 'devextreme-angular/ui/popup';
import { DxButtonModule } from 'devextreme-angular';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'stub-component',
  template: '<div class="stub"></div>',
})
class StubComponent {}

@Component({
  standalone: true,
  imports: [DxButtonModule],
  selector: '',
  template: `<div class="popup-content">
        <dx-button text="Test Button" (onClick)="onClick()"></dx-button>
    </div>`,
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
    const fixture = TestBed.createComponent(StubComponent);
    const popupRef = popupService.open(PopupContentComponent, { showTitle: true, showCloseButton: true });

    popupRef.onHidden.subscribe(() => {
      done();
    });

    popupRef.contentRef.instance.onClick = () => {
      popupRef.visible = false;
    };

    fixture.detectChanges();

    const popupEl = document.querySelector('.dx-overlay-wrapper.dx-popup-wrapper .dx-overlay-content.dx-popup-normal');
    const popupCloseEl = popupEl.querySelector('.dx-toolbar .dx-button .dx-icon-close');
    const popupContentComponentEl: HTMLButtonElement = popupEl.querySelector('.popup-content .dx-button');

    expect(popupEl).toBeTruthy();
    expect(popupCloseEl).toBeTruthy();
    expect(popupRef.contentRef).toBeTruthy();
    expect(popupContentComponentEl.textContent).toEqual('Test Button');

    popupContentComponentEl.click();
  });

  it('DxPopupService opens DxPopup and recalc size', (done) => {
    const fixture = TestBed.createComponent(StubComponent);
    const popupRef = popupService.open(
      PopupContentComponent,
      {
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
      },
    );

    popupRef.onHidden.subscribe(() => {
      done();
    });

    popupRef.contentRef.instance.onClick = () => {
      popupRef.visible = false;
    };

    fixture.detectChanges();

    const popupEl = document.querySelector('.dx-overlay-wrapper.dx-popup-wrapper .dx-overlay-content.dx-popup-normal');
    const popupElClientRect = popupEl.getBoundingClientRect();
    const popupCloseEl = popupEl.querySelector('.dx-toolbar .dx-button .dx-icon-close');
    const popupTitleEl = popupEl.querySelector('.dx-toolbar .dx-toolbar-label .dx-item-content.dx-toolbar-item-content');
    const popupContentComponentEl: HTMLButtonElement = popupEl.querySelector('.popup-content .dx-button');
    const popupBottomToolbarButtonEl: HTMLButtonElement = popupEl.querySelector('.dx-popup-bottom .dx-button');

    const popupBottomToolbarButtonElRect = popupBottomToolbarButtonEl.getBoundingClientRect();
    const popupBottomToolbarButtonBottom = popupBottomToolbarButtonElRect.y + popupBottomToolbarButtonElRect.height;

    const popupElBottom = popupElClientRect.y + popupElClientRect.height;

    expect(popupEl).toBeTruthy();
    expect(popupCloseEl).toBeTruthy();
    expect(popupTitleEl.clientWidth).toBeGreaterThan(150);
    expect(popupElBottom).toBeGreaterThan(popupBottomToolbarButtonBottom);
    expect(popupRef.contentRef).toBeTruthy();
    expect(popupContentComponentEl.textContent).toEqual('Test Button');

    popupContentComponentEl.click();
  });
});
