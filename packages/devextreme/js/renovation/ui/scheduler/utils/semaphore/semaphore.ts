export class Semaphore {
  counter: number;

  constructor() {
    this.counter = 0;
  }

  isFree(): boolean {
    return this.counter === 0;
  }

  take(): void {
    this.counter += 1;
  }

  release(): void {
    this.counter -= 1;

    if (this.counter < 0) {
      this.counter = 0;
    }
  }
}
