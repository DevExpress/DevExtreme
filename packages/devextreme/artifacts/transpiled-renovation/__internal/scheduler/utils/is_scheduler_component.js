"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSchedulerComponent = isSchedulerComponent;
const schedulerComponentName = 'dxScheduler';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function isSchedulerComponent(component) {
  return component.NAME === schedulerComponentName;
}