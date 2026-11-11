import 'reflect-metadata';
import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
import './jasmine-compat';

import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

@NgModule({
  providers: [provideZoneChangeDetection()],
})
class ZoneTestingModule {}

TestBed.initTestEnvironment(
  [BrowserDynamicTestingModule, ZoneTestingModule],
  platformBrowserDynamicTesting(),
);
