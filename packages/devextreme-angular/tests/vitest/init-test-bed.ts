import {
  NgModule,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ServerTestingModule, platformServerTesting } from '@angular/platform-server/testing';
import { setWindow } from 'devextreme/core/utils/window';

const isZoneless = typeof (globalThis as any).Zone === 'undefined';

@NgModule({
  providers: [isZoneless ? provideZonelessChangeDetection() : provideZoneChangeDetection()],
})
class ChangeDetectionTestingModule {}

export const assertZoneless = (): void => {
  if (!isZoneless) {
    throw new Error('zone.js is loaded in the zoneless test environment');
  }
};

export const initBrowserTestBed = (): void => {
  TestBed.initTestEnvironment(
    [BrowserDynamicTestingModule, ChangeDetectionTestingModule],
    platformBrowserDynamicTesting(),
  );
};

export const initServerTestBed = (): void => {
  const windowMock: any = {};
  windowMock.window = windowMock;
  setWindow(windowMock);

  TestBed.initTestEnvironment(
    [ServerTestingModule, ChangeDetectionTestingModule],
    platformServerTesting(),
  );
};
