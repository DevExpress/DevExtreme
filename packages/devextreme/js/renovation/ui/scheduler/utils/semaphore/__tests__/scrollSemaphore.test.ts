import { ScrollSemaphore } from '../scrollSemaphore';

describe('Scroll Semaphore', () => {
  describe('API', () => {
    const defaultPosition = { left: 100, top: 1 };

    describe('isFree', () => {
      it('should should be free in initial state', () => {
        const semaphore = new ScrollSemaphore();

        expect(semaphore.isFree(defaultPosition))
          .toBe(true);

        expect(semaphore.position)
          .toEqual(defaultPosition);
      });

      it('should return correct value in different positions', () => {
        const semaphore = new ScrollSemaphore();

        expect(semaphore.isFree(defaultPosition))
          .toBe(true);

        expect(semaphore.isFree(defaultPosition))
          .toBe(false);

        expect(semaphore.isFree({ left: 101, top: 201 }))
          .toBe(true);

        expect(semaphore.position)
          .toEqual(defaultPosition);
      });

      it('should return correct value after release', () => {
        const semaphore = new ScrollSemaphore();

        semaphore.take(defaultPosition);

        expect(semaphore.isFree(defaultPosition))
          .toBe(false);

        expect(semaphore.isFree({ left: 101, top: 201 }))
          .toBe(false);

        semaphore.release();

        expect(semaphore.isFree(defaultPosition))
          .toBe(false);

        expect(semaphore.isFree({ left: 101, top: 201 }))
          .toBe(true);

        expect(semaphore.position)
          .toEqual(defaultPosition);
      });

      it('should return correct value for incorrect position', () => {
        const semaphore = new ScrollSemaphore();

        semaphore.take(defaultPosition);
        semaphore.release();

        semaphore.isFree({
          left: undefined,
          top: undefined,
        });

        expect(semaphore.position)
          .toEqual(defaultPosition);
      });
    });

    describe('take', () => {
      it('should correctly set position if position is incorrect', () => {
        const semaphore = new ScrollSemaphore();

        semaphore.take(defaultPosition);

        semaphore.take({
          left: undefined,
          top: undefined,
        } as any);

        expect(semaphore.position)
          .toEqual({ left: -1, top: -1 });
      });
    });

    describe('release', () => {
      it('should call Semaphore release', () => {
        const scrollSemaphore = new ScrollSemaphore();

        jest.spyOn(scrollSemaphore.semaphore, 'release');

        scrollSemaphore.release();

        expect(scrollSemaphore.semaphore.release)
          .toBeCalledTimes(1);
      });
    });
  });
});
