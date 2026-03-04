import '@angular/compiler';
import 'reflect-metadata';
import 'zone.js/node';
import 'zone.js/testing';

import { TestBed } from '@angular/core/testing';
import { ServerTestingModule, platformServerTesting } from '@angular/platform-server/testing';

import { setWindow } from 'devextreme/core/utils/window';

const windowMock: { window?: unknown } = {};
windowMock.window = windowMock;
setWindow(windowMock);

TestBed.initTestEnvironment(
  ServerTestingModule,
  platformServerTesting(),
);
