import { Semaphore } from './semaphore';

interface IPosition {
  left?: number;
  top?: number;
}

export class ScrollSemaphore {
  semaphore: Semaphore;

  position: IPosition;

  constructor() {
    this.semaphore = new Semaphore();
    this.position = {
      left: -1,
      top: -1,
    };
  }

  isFree(position: IPosition): boolean {
    if (this.isInitialPosition()) {
      this.setPosition(position);
      return this.semaphore.isFree();
    }

    return this.semaphore.isFree()
      && !this.comparePosition(position);
  }

  take(position: IPosition): void {
    this.semaphore.take();
    this.setPosition(position);
  }

  release(): void {
    this.semaphore.release();
  }

  private setPosition(source: IPosition): void {
    this.position.left = source.left ?? -1;
    this.position.top = source.top ?? -1;
  }

  private isInitialPosition(): boolean {
    return this.position.left === -1 && this.position.top === -1;
  }

  private comparePosition(target: IPosition): boolean {
    const left = target.left ?? -1;
    const top = target.top ?? -1;

    return this.position.left === left && this.position.top === top;
  }
}
