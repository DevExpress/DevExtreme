import each from 'jest-each';

import {
  ACCELERATION,
  BOUNCE_ACCELERATION_SUM,
  OUT_BOUNDS_ACCELERATION,
  BOUNCE_MIN_VELOCITY_LIMIT,
  MIN_VELOCITY_LIMIT,
  AnimatedScrollbar,
} from '../animated_scrollbar';

import { isDefined } from '../../../../core/utils/type';

describe('Public methods', () => {
  each([
    { name: 'inBounds', argsCount: 0, defaultValue: false },
    { name: 'getMaxOffset', argsCount: 0 },
    { name: 'scrollStep', argsCount: 1 },
    { name: 'moveScrollbar', argsCount: 1 },
    { name: 'getScrollLocation', argsCount: 0 },
    { name: 'stopComplete', argsCount: 0 },
    { name: 'scrollComplete', argsCount: 0 },
    { name: 'boundLocation', argsCount: 1 },
    { name: 'getMinOffset', argsCount: 0 },
    { name: 'validateEvent', argsCount: 1 },
    { name: 'isThumb', argsCount: 1 },
    { name: 'reachedMin', argsCount: 0 },
    { name: 'reachedMax', argsCount: 0 },
    { name: 'initHandler', argsCount: 2 },
    { name: 'startHandler', argsCount: 0 },
    { name: 'moveHandler', argsCount: 1 },
    { name: 'endHandler', argsCount: 1 },
    { name: 'stopHandler', argsCount: 0 },
    { name: 'scrollByHandler', argsCount: 1 },
    { name: 'releaseHandler', argsCount: 0 },
  ]).describe('Method: %o', (methodInfo) => {
    each([{ [`${methodInfo.name}`]: jest.fn() }, null]).describe('ScrollbarRef.current: %o', (current) => {
      it(`${methodInfo.name}() method should call according method from scrollbar`, () => {
        const viewModel = new AnimatedScrollbar({ });
        (viewModel as any).scrollbarRef = { current };

        if (isDefined(viewModel.scrollbarRef.current)) {
          if (methodInfo.argsCount === 2) {
            viewModel[methodInfo.name]('arg1', 'arg2');
            expect(viewModel.scrollbarRef.current[`${methodInfo.name}`]).toHaveBeenCalledWith('arg1', 'arg2');
          } else if (methodInfo.argsCount === 1) {
            viewModel[methodInfo.name]('arg1');
            expect(viewModel.scrollbarRef.current[`${methodInfo.name}`]).toHaveBeenCalledWith('arg1');
          } else {
            viewModel[methodInfo.name]();
          }
          expect(viewModel.scrollbarRef.current[`${methodInfo.name}`]).toHaveBeenCalledTimes(1);
        } else if (isDefined(methodInfo.defaultValue)) {
          const returnValue = viewModel[methodInfo.name]();
          expect(returnValue).toEqual(methodInfo.defaultValue);
        }
      });
    });
  });

  it('animator should call stopComplete during step if was stopped', () => {
    const stopCompleteHandler = jest.fn();
    const viewModel = new AnimatedScrollbar({ });
    (viewModel as any).scrollbarRef = { current: { stopComplete: stopCompleteHandler } };
    viewModel.stopped = true;

    viewModel.stepCore();

    expect(stopCompleteHandler).toHaveBeenCalledTimes(1);
  });

  each([true, false]).describe('isBounceAnimator: %o', (isBounceAnimator) => {
    it('animator should call scrollComplete during step if was finished', () => {
      const scrollCompleteHandler = jest.fn();
      const scrollbarMoveHandler = jest.fn();

      const viewModel = new AnimatedScrollbar({ });
      (viewModel as any).scrollbarRef = {
        current: {
          scrollComplete: scrollCompleteHandler,
          moveScrollbar: scrollbarMoveHandler,
          boundLocation: () => -700,
        },
      };
      Object.defineProperties(viewModel, {
        isFinished: { get() { return true; } },
        isBounceAnimator: { get() { return isBounceAnimator; } },
      });

      viewModel.stepCore();

      expect(viewModel.finished).toBe(true);
      if (isBounceAnimator) {
        expect(scrollbarMoveHandler).toHaveBeenCalledTimes(1);
        expect(scrollbarMoveHandler).toHaveBeenCalledWith(-700);
      }

      expect(scrollCompleteHandler).toHaveBeenCalledTimes(1);
    });
  });

  it('animator should do the next step if it was not stopped or finished', () => {
    const viewModel = new AnimatedScrollbar({ }) as AnimatedScrollbar;
    viewModel.stopped = false;
    Object.defineProperties(viewModel, { isFinished: { get() { return false; } } });
    viewModel.getStepAnimationFrame = jest.fn();
    viewModel.step = jest.fn();

    viewModel.stepCore();

    expect(viewModel.step).toHaveBeenCalledTimes(1);
    expect(viewModel.getStepAnimationFrame).toHaveBeenCalledTimes(1);
  });

  each([true, false]).describe('BounceEnabled: %o', (bounceEnabled) => {
    each([() => true, () => false]).describe('inBounds: %o', (inBounds) => {
      it('animator on the step should scrolls scrollbar on correct value', () => {
        const viewModel = new AnimatedScrollbar({ bounceEnabled }) as AnimatedScrollbar;
        const scrollStepHandler = jest.fn();

        viewModel.velocity = -5;
        const acceleration = 0.5;
        Object.defineProperties(viewModel, { acceleration: { get() { return acceleration; } } });
        (viewModel as any).scrollbarRef = { current: { inBounds, scrollStep: scrollStepHandler } };

        viewModel.step();

        let expectedVelocity = -5;
        if (!bounceEnabled && !inBounds()) {
          expectedVelocity = 0;
        }

        expect(scrollStepHandler).toHaveBeenCalledTimes(1);
        expect(scrollStepHandler).toHaveBeenCalledWith(expectedVelocity);

        expect(viewModel.velocity).toEqual(expectedVelocity * acceleration);
      });
    });
  });
});

describe('Animator', () => {
  describe('Inertia', () => {
    each([true, false]).describe('ThumbScrolling: %o', (thumbScrolling) => {
      each([true, false]).describe('CrossThumbScrolling: %o', (crossThumbScrolling) => {
        each([true, false]).describe('InertiaEnabled: %o', (inertiaEnabled) => {
          each([undefined, -25]).describe('Recieved velocity: %o', (velocity) => {
            it('should suppress inertia on animator start()', () => {
              const viewModel = new AnimatedScrollbar({ inertiaEnabled });

              viewModel.stepCore = jest.fn();
              viewModel.start('inertia', velocity, thumbScrolling, crossThumbScrolling);

              if ((!inertiaEnabled || thumbScrolling) || (!thumbScrolling && crossThumbScrolling)
              || velocity === undefined) {
                expect(viewModel.velocity).toEqual(0);
              } else {
                expect(viewModel.velocity).toEqual(velocity);
              }

              expect(viewModel.stopped).toBe(false);
              expect(viewModel.finished).toBe(false);
            });
          });
        });
      });
    });
  });

  describe('Bounce', () => {
    it('should setup bounce on animator start()', () => {
      const viewModel = new AnimatedScrollbar({ });

      viewModel.stepCore = jest.fn();
      (viewModel as any).scrollbarRef = {
        current: {
          boundLocation: () => -700,
          getScrollLocation: () => -1500,
        },
      };

      viewModel.start('bounce');

      expect(viewModel.velocity).toEqual(800 / BOUNCE_ACCELERATION_SUM);

      expect(viewModel.stopped).toBe(false);
      expect(viewModel.finished).toBe(false);
    });

    each([undefined, jest.fn()]).describe('onBounce: %o', (onBounceHandler) => {
      it('should fire onBounce action on animator start()', () => {
        const viewModel = new AnimatedScrollbar({ onBounce: onBounceHandler });

        viewModel.setupBounce = jest.fn();
        viewModel.stepCore = jest.fn();

        viewModel.start('bounce');

        if (onBounceHandler) {
          expect(onBounceHandler).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  it('should set correct stopped state on animator cancel()', () => {
    const viewModel = new AnimatedScrollbar({ });

    viewModel.cancel();

    expect(viewModel.stopped).toBe(true);
  });

  describe('Getters', () => {
    each([() => true, () => false]).describe('inBounds: %o', (inBounds) => {
      each([undefined, { current: inBounds }]).describe('ScrollbarRef: %o', (scrollbarRef) => {
        each([true, false]).describe('isBounceAnimator: %o', (isBounceAnimator) => {
          it('acceleration', () => {
            const viewModel = new AnimatedScrollbar({ });
            (viewModel as any).inBounds = inBounds;
            (viewModel as any).scrollbarRef = scrollbarRef;

            Object.defineProperties(viewModel, {
              isBounceAnimator: { get() { return isBounceAnimator; } },
            });

            if (scrollbarRef === undefined) {
              expect(viewModel.acceleration).toEqual(0);
            } else if (inBounds() || isBounceAnimator) {
              expect(viewModel.acceleration).toEqual(ACCELERATION);
            } else {
              expect(viewModel.acceleration).toEqual(OUT_BOUNDS_ACCELERATION);
            }
          });
        });
      });
    });

    each([true, false]).describe('Stopped: %o', (stopped) => {
      each([true, false]).describe('Finished: %o', (finished) => {
        it('inProgress', () => {
          const viewModel = new AnimatedScrollbar({ });
          viewModel.stopped = stopped;
          viewModel.finished = finished;

          expect(viewModel.inProgress).toEqual(!(stopped || finished));
        });
      });
    });

    each([true, false]).describe('isBounceAnimator: %o', (isBounceAnimator) => {
      each([true, false]).describe('crossBoundOnNextStep: %o', (crossBoundOnNextStep) => {
        each([0.1, -0.2, -0.6, 1, 1.3, 5]).describe('Velocity: %o', (velocity) => {
          it('isFinished', () => {
            const viewModel = new AnimatedScrollbar({ });

            Object.defineProperties(viewModel, {
              isBounceAnimator: { get() { return isBounceAnimator; } },
            });
            viewModel.velocity = velocity;
            viewModel.crossBoundOnNextStep = () => crossBoundOnNextStep;

            if (isBounceAnimator) {
              expect(viewModel.isFinished)
                .toEqual(crossBoundOnNextStep || Math.abs(velocity) <= BOUNCE_MIN_VELOCITY_LIMIT);
            } else {
              expect(viewModel.isFinished).toEqual(Math.abs(velocity) <= MIN_VELOCITY_LIMIT);
            }
          });
        });
      });
    });
  });
});
