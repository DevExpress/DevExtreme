import each from 'jest-each';

import {
  ACCELERATION,
  BOUNCE_ACCELERATION_SUM,
  OUT_BOUNDS_ACCELERATION,
  BOUNCE_MIN_VELOCITY_LIMIT,
  MIN_VELOCITY_LIMIT,
  AnimatedScrollbar,
} from '../animated_scrollbar';
import { inRange } from '../../../../core/utils/math';

interface Mock extends jest.Mock {}

jest.mock('../../../../core/utils/math', () => ({
  ...jest.requireActual('../../../../core/utils/math'),
  inRange: jest.fn(() => true),
}));

describe('Public methods', () => {
  each([
    { name: 'getMaxOffset', calledWith: [] },
    { name: 'scrollStep', calledWith: ['arg1'] },
    { name: 'moveTo', calledWith: ['arg1'] },
    { name: 'stopComplete', calledWith: [] },
    { name: 'scrollComplete', calledWith: [] },
    { name: 'getLocationWithinRange', calledWith: ['arg1'] },
    { name: 'getMinOffset', calledWith: [] },
    { name: 'validateEvent', calledWith: ['arg1'] },
    { name: 'isThumb', calledWith: ['arg1'] },
    { name: 'reachedMin', calledWith: [] },
    { name: 'reachedMax', calledWith: [] },
    { name: 'initHandler', calledWith: ['arg1', 'arg2'] },
    { name: 'startHandler', calledWith: [] },
    { name: 'moveHandler', calledWith: ['arg1'] },
    { name: 'endHandler', calledWith: ['arg1'] },
    { name: 'stopHandler', calledWith: [] },
    { name: 'scrollByHandler', calledWith: ['arg1'] },
    { name: 'releaseHandler', calledWith: [] },
  ]).describe('Method: %o', (methodInfo) => {
    it(`${methodInfo.name}() method should call according scrollbar method`, () => {
      const viewModel = new AnimatedScrollbar({ });
      const handlerMock = jest.fn();
      (viewModel as any).scrollbarRef = { current: { [`${methodInfo.name}`]: handlerMock } };

      viewModel[methodInfo.name](...methodInfo.calledWith);

      expect(handlerMock).toBeCalledTimes(1);
      expect(handlerMock).toHaveBeenCalledWith(...methodInfo.calledWith);
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
      const scrollbarMoveToHandler = jest.fn();

      const viewModel = new AnimatedScrollbar({ });
      (viewModel as any).scrollbarRef = {
        current: {
          scrollComplete: scrollCompleteHandler,
          moveTo: scrollbarMoveToHandler,
          getLocationWithinRange: () => -700,
        },
      };
      Object.defineProperties(viewModel, {
        isFinished: { get() { return true; } },
        isBounceAnimator: { get() { return isBounceAnimator; } },
      });

      viewModel.stepCore();

      expect(viewModel.finished).toBe(true);
      if (isBounceAnimator) {
        expect(scrollbarMoveToHandler).toHaveBeenCalledTimes(1);
        expect(scrollbarMoveToHandler).toHaveBeenCalledWith(-700);
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
    each([() => true, () => false]).describe('inRange: %o', (inRangeFn) => {
      it('animator on the step should scrolls scrollbar on correct value', () => {
        const viewModel = new AnimatedScrollbar({ bounceEnabled }) as AnimatedScrollbar;
        const scrollStepHandler = jest.fn();

        viewModel.velocity = -5;
        const acceleration = 0.5;
        Object.defineProperties(viewModel, { acceleration: { get() { return acceleration; } } });
        (inRange as Mock).mockImplementation(inRangeFn);
        (viewModel as any).scrollbarRef = {
          current: {
            scrollStep: scrollStepHandler,
            getMinOffset: jest.fn(),
            getMaxOffset: jest.fn(),
          },
        };
        viewModel.step();

        let expectedVelocity = -5;
        if (!bounceEnabled && !inRange()) {
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
      const viewModel = new AnimatedScrollbar({
        scrollLocation: -1500,
      });

      viewModel.stepCore = jest.fn();
      (viewModel as any).scrollbarRef = {
        current: {
          getLocationWithinRange: () => -700,
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
    each([() => true, () => false]).describe('inRange: %o', (inRangeFn) => {
      each([undefined, {
        current: {
          getMinOffset: jest.fn(),
          getMaxOffset: jest.fn(),
        },
      }]).describe('ScrollbarRef: %o', (scrollbarRef) => {
        each([true, false]).describe('isBounceAnimator: %o', (isBounceAnimator) => {
          it('acceleration', () => {
            const viewModel = new AnimatedScrollbar({ });
            (inRange as Mock).mockImplementation(inRangeFn);
            (viewModel as any).scrollbarRef = scrollbarRef;

            Object.defineProperties(viewModel, {
              isBounceAnimator: { get() { return isBounceAnimator; } },
            });

            if (scrollbarRef === undefined) {
              expect(viewModel.acceleration).toEqual(0);
            } else if (inRange() || isBounceAnimator) {
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
