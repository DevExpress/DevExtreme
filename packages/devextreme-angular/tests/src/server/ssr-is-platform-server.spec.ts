/* tslint:disable:component-selector */

import {
  Component,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';

import { isPlatformServer } from '@angular/common';

import { DxServerModule } from 'devextreme-angular/server';

import {
  TestBed,
} from '@angular/core/testing';

import {
  DxDataGridModule,
  getServerStateKey,
} from 'devextreme-angular';

@Component({
  selector: 'test-container-component',
  template: '',
  imports: [DxDataGridModule],
})
class TestContainerComponent {
  renderedOnServer = false;

  initializedHandler(e) {
    this.renderedOnServer = e.component.option('integrationOptions.renderedOnServer');
  }
}

describe('Universal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestContainerComponent,
        DxServerModule,
        DxDataGridModule,
      ],
    });
  });

  // spec
  it('should set transfer state for rendererdOnServer option of integration', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-data-grid></dx-data-grid>',
      },
    });
    const platformID = TestBed.inject(PLATFORM_ID);
    if (isPlatformServer(platformID)) {
      const fixture = TestBed.createComponent(TestContainerComponent);
      fixture.detectChanges();

      const transferState: TransferState = TestBed.inject(TransferState);

      expect(transferState.hasKey(getServerStateKey())).toBe(true);
      expect(transferState.get(getServerStateKey(), null as any)).toEqual(true);
    }
  });

  it('should set rendererdOnServer option of integration', () => {
    TestBed.overrideComponent(TestContainerComponent, {
      set: {
        template: '<dx-data-grid (onInitialized)="initializedHandler($event)"></dx-data-grid>',
      },
    });

    const fixture = TestBed.createComponent(TestContainerComponent);
    const transferState: TransferState = TestBed.inject(TransferState);

    transferState.set(getServerStateKey(), true as any);

    fixture.detectChanges();

    expect(fixture.componentInstance.renderedOnServer).toBe(true);
  });
});
