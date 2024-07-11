"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Semaphore = void 0;
class Semaphore {
  constructor() {
    this.counter = 0;
  }
  isFree() {
    return this.counter === 0;
  }
  take() {
    this.counter += 1;
  }
  release() {
    this.counter -= 1;
    if (this.counter < 0) {
      this.counter = 0;
    }
  }
}
exports.Semaphore = Semaphore;