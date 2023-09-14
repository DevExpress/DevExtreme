import { Semaphore } from '../semaphore';

describe('Semaphore', () => {
  it('should be free by default', () => {
    const semaphore = new Semaphore();

    expect(semaphore.isFree())
      .toBe(true);
  });

  it('should not be free if it was taken', () => {
    const semaphore = new Semaphore();

    semaphore.take();

    expect(semaphore.isFree())
      .toBe(false);
  });

  it('should be released correctly', () => {
    const semaphore = new Semaphore();

    semaphore.take();
    semaphore.release();

    expect(semaphore.isFree())
      .toBe(true);
  });

  it('should be free after several consecutive releases', () => {
    const semaphore = new Semaphore();

    semaphore.take();
    semaphore.release();
    semaphore.release();
    semaphore.release();

    expect(semaphore.isFree())
      .toBe(true);
  });
});
