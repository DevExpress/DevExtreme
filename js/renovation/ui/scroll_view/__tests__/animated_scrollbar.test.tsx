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
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../common/consts';

interface Mock extends jest.Mock {}

jest.mock('../../../../core/utils/math', () => ({
  ...jest.requireActual('../../../../core/utils/math'),
  inRange: jest.fn(() => true),
}));

describe('Public methods', () => {
  each([
    { name: 'getMinOffset', calledWith: [] },
    { name: 'scrollStep', calledWith: ['arg1'] },
    { name: 'moveTo', calledWith: ['arg1'] },
    { name: 'stopAnimator', calledWith: ['arg1'] },
    { name: 'isScrollbar', calledWith: ['arg1'] },
    { name: 'isThumb', calledWith: ['arg1'] },
    { name: 'initHandler', calledWith: ['arg1', 'arg2'] },
    { name: 'startHandler', calledWith: [] },
    { name: 'moveHandler', calledWith: ['arg1'] },
    { name: 'endHandler', calledWith: ['arg1', 'arg2'] },
    { name: 'stopHandler', calledWith: [] },
    { name: 'scrollTo', calledWith: ['arg1'] },
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

  it('should call cancel() when disposeAnimationFrame() method was called', () => {
    const viewModel = new AnimatedScrollbar({ });

    viewModel.cancel = jest.fn();

    viewModel.disposeAnimationFrame()();

    expect(viewModel.cancel).toHaveBeenCalledTimes(1);
  });

  each([-1000, -700]).describe('scrollLocation: %o', (scrollLocation) => {
    each([true, false]).describe('isBounceAnimator: %o', (isBounceAnimator) => {
      it('animator should call stopAnimator during step if was finished', () => {
        const stopAnimatorHandler = jest.fn();
        const scrollbarMoveToHandler = jest.fn();

        const viewModel = new AnimatedScrollbar({
          scrollLocation,
          maxOffset: -700,
        });
        (viewModel as any).scrollbarRef = {
          current: {
            stopAnimator: stopAnimatorHandler,
            moveTo: scrollbarMoveToHandler,
          },
        };
        viewModel.getMinOffset = jest.fn(() => 0);

        Object.defineProperties(viewModel, {
          isFinished: { get() { return true; } },
          isBounceAnimator: { get() { return isBounceAnimator; } },
        });

        viewModel.stepCore();

        expect(viewModel.finished).toBe(true);
        if (isBounceAnimator) {
          expect(scrollbarMoveToHandler).toHaveBeenCalledTimes(1);
          expect(scrollbarMoveToHandler).toHaveBeenCalledWith(-700);

          expect(stopAnimatorHandler).toHaveBeenCalledTimes(1);
        } else {
          expect(stopAnimatorHandler).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  each([true, false]).describe('Stopped: %o', (stopped) => {
    each([true, false]).describe('Finished: %o', (isFinished) => {
      it('animator should do the next step if it was not stopped or finished', () => {
        const viewModel = new AnimatedScrollbar({ });
        viewModel.stopped = stopped;

        Object.defineProperties(viewModel, { isFinished: { get() { return isFinished; } } });
        viewModel.getStepAnimationFrame = jest.fn();
        viewModel.step = jest.fn();
        viewModel.complete = jest.fn();

        viewModel.stepCore();

        if (isFinished || stopped) {
          expect(viewModel.step).not.toBeCalled();
          expect(viewModel.getStepAnimationFrame).not.toBeCalled();
        } else {
          expect(viewModel.step).toHaveBeenCalledTimes(1);
          expect(viewModel.getStepAnimationFrame).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  each([true, false]).describe('BounceEnabled: %o', (bounceEnabled) => {
    const maxOffset = -100;
    const minOffset = 0;
    each([10, minOffset, 0, -1, -99, maxOffset, -101]).describe('scrollLocation: %o', (scrollLocation) => {
      it('animator on the step should scrolls scrollbar on correct value', () => {
        const viewModel = new AnimatedScrollbar({
          bounceEnabled,
          scrollLocation,
          maxOffset,
        });
        const scrollStepHandler = jest.fn();

        viewModel.velocity = -5;
        const acceleration = 0.5;

        Object.defineProperties(viewModel, { acceleration: { get() { return acceleration; } } });

        (viewModel as any).scrollbarRef = {
          current: {
            scrollStep: scrollStepHandler,
            getMinOffset: jest.fn(() => minOffset),
          },
        };
        viewModel.step();

        let expectedVelocity = -5;
        if (!bounceEnabled && (scrollLocation >= minOffset || scrollLocation <= maxOffset)) {
          expectedVelocity = 0;
        }

        expect(scrollStepHandler).toHaveBeenCalledTimes(1);
        expect(scrollStepHandler).toHaveBeenCalledWith(expectedVelocity);

        expect(viewModel.velocity).toEqual(expectedVelocity * acceleration);
      });
    });
  });

  each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('direction: %o', (direction) => {
    each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
      each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
        each([0, 55]).describe('bottomPocketSize: %o', (bottomPocketSize) => {
          each([0, 80]).describe('topPocketSize: %o', (topPocketSize) => {
            each([0, 8]).describe('contentPaddingBottom: %o', (contentPaddingBottom) => {
              each([0, -300]).describe('maxOffset: %o', (maxOffset) => {
                each([true, false]).describe('forceAnimationToBottomBound: %o', (forceAnimationToBottomBound) => {
                  it('maxOffset()', () => {
                    const viewModel = new AnimatedScrollbar({
                      direction,
                      forceGeneratePockets,
                      reachBottomEnabled,
                      bottomPocketSize,
                      topPocketSize,
                      contentPaddingBottom,
                      maxOffset,
                    });

                    viewModel.forceAnimationToBottomBound = forceAnimationToBottomBound;

                    let expectedMaxOffsetValue = 0;

                    if (
                      forceGeneratePockets
                        && reachBottomEnabled
                        && !forceAnimationToBottomBound
                    ) {
                      expectedMaxOffsetValue = (maxOffset as number)
                        - (bottomPocketSize as number) - (contentPaddingBottom as number);
                    } else {
                      expectedMaxOffsetValue = maxOffset;
                    }

                    expect(viewModel.maxOffset).toEqual(expectedMaxOffsetValue);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

describe('Action handlers', () => {
  each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('direction: %o', (direction) => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    each([undefined, jest.fn()]).describe('handler: %o', (actionHandler) => {
      it('inEnd(direction)', () => {
        const viewModel = new AnimatedScrollbar({
          direction,
          onEnd: actionHandler,
        });

        viewModel.forceAnimationToBottomBound = true;

        viewModel.onEnd(direction);

        expect(viewModel.forceAnimationToBottomBound).toEqual(false);
        if (actionHandler) {
          expect(actionHandler).toHaveBeenCalledTimes(1);
          expect(actionHandler).toHaveBeenCalledWith(direction);
        }
      });

      each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
        each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
          each([() => true, () => false]).describe('inRange: %o', (inRangeFn) => {
            it('onRelease()', () => {
              (inRange as Mock).mockImplementation(inRangeFn);

              const viewModel = new AnimatedScrollbar({
                direction,
                forceGeneratePockets,
                reachBottomEnabled,
                onRelease: actionHandler,
              });

              viewModel.forceAnimationToBottomBound = false;

              viewModel.onRelease();

              expect(viewModel.forceAnimationToBottomBound)
                .toEqual(inRangeFn() && forceGeneratePockets && reachBottomEnabled);
              if (actionHandler) {
                expect(actionHandler).toHaveBeenCalledTimes(1);
              }
            });
          });
        });
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
        maxOffset: -700,
      });
      viewModel.stepCore = jest.fn();
      viewModel.getMinOffset = jest.fn(() => 0);

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
    each([0, -99.9, -100, -100.1, -150]).describe('scrollLocation: %o', (scrollLocation) => {
      it('reachedMin', () => {
        const maxOffset = -100;
        const viewModel = new AnimatedScrollbar({ scrollLocation, maxOffset });

        expect(viewModel.reachedMin()).toEqual(scrollLocation <= maxOffset);
      });
    });

    each([100, 80.1, 80, 79.9, 0]).describe('scrollLocation: %o', (scrollLocation) => {
      it('reachedMax', () => {
        const viewModel = new AnimatedScrollbar({ scrollLocation });
        const minOffset = 80;

        viewModel.getMinOffset = jest.fn(() => minOffset);

        expect(viewModel.reachedMax()).toEqual(scrollLocation >= minOffset);
      });
    });

    each([() => true, () => false]).describe('inRange: %o', (inRangeFn) => {
      each([undefined, {
        current: {
          getMinOffset: jest.fn(),
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
