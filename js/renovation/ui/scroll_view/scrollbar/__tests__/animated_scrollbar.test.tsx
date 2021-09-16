import React from 'react';
import each from 'jest-each';

import { mount } from 'enzyme';
import {
  ACCELERATION,
  BOUNCE_ACCELERATION_SUM,
  OUT_BOUNDS_ACCELERATION,
  BOUNCE_MIN_VELOCITY_LIMIT,
  MIN_VELOCITY_LIMIT,
  AnimatedScrollbar,
  viewFunction as AnimatedScrollbarComponent,
} from '../animated_scrollbar';
import { inRange } from '../../../../../core/utils/math';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../../common/consts';
import { ScrollbarProps } from '../../common/scrollbar_props';
import {
  defaultEvent,
} from '../../../../test_utils/events_mock';
import { AnimatedScrollbarProps } from '../../common/animated_scrollbar_props';

interface Mock extends jest.Mock {}

jest.mock('../../../../../core/utils/math', () => ({
  ...jest.requireActual('../../../../../core/utils/math'),
  inRange: jest.fn(() => true),
}));

describe('AnimatedScrollbar', () => {
  it('render scrollbar with defaults', () => {
    const props = new AnimatedScrollbarProps();
    const viewModel = mount<AnimatedScrollbar>(<AnimatedScrollbar {...props} />);

    expect({ ...viewModel.props() }).toEqual({
      activeStateEnabled: false,
      bottomPocketSize: 0,
      containerHasSizes: false,
      containerSize: 0,
      contentPaddingBottom: 0,
      contentSize: 0,
      forceVisibility: false,
      isScrollableHovered: false,
      maxOffset: 0,
      minOffset: 0,
      scrollLocation: 0,
      pulledDown: false,
    });
  });

  each([
    { name: 'scrollStep', calledWith: ['arg1', 'arg2', 'arg3'] },
    { name: 'moveTo', calledWith: ['arg1'] },
    { name: 'isScrollbar', calledWith: ['arg1'] },
    { name: 'isThumb', calledWith: ['arg1'] },
    { name: 'show', calledWith: [] },
    { name: 'hide', calledWith: [] },
  ]).describe('Method: %o', (methodInfo) => {
    it(`${methodInfo.name}() method should call according scrollbar method`, () => {
      const viewModel = new AnimatedScrollbar({});
      const handlerMock = jest.fn();
      (viewModel as any).scrollbarRef = { current: { [`${methodInfo.name}`]: handlerMock } };

      viewModel[methodInfo.name](...methodInfo.calledWith);

      expect(handlerMock).toBeCalledTimes(1);
      expect(handlerMock).toHaveBeenCalledWith(...methodInfo.expected || methodInfo.calledWith);
    });
  });

  it('should call cancel() when disposeAnimationFrame() method was called', () => {
    const viewModel = new AnimatedScrollbar({ });

    viewModel.cancel = jest.fn();

    viewModel.disposeAnimationFrame()();

    expect(viewModel.cancel).toHaveBeenCalledTimes(1);
  });

  each([-1000, -700]).describe('scrollLocation: %o', (scrollLocation) => {
    each(['bounce', 'inertia']).describe('animator: %o', (animator) => {
      it('animator should call stopAnimator during step if was finished', () => {
        const scrollbarMoveToHandler = jest.fn();

        const viewModel = new AnimatedScrollbar({
          scrollLocation,
          maxOffset: -700,
          minOffset: 0,
        });
        (viewModel as any).scrollbarRef = {
          current: {
            moveTo: scrollbarMoveToHandler,
          },
        };

        viewModel.animator = animator;
        Object.defineProperties(viewModel, {
          isFinished: { get() { return true; } },
        });

        viewModel.stepCore();

        expect(viewModel.finished).toBe(true);
        if (animator === 'bounce') {
          expect(scrollbarMoveToHandler).toHaveBeenCalledTimes(1);
          expect(scrollbarMoveToHandler).toHaveBeenCalledWith(-700);
        }

        expect(viewModel.pendingBounceAnimator).toEqual(false);
        expect(viewModel.pendingInertiaAnimator).toEqual(false);
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
          minOffset,
        });
        const scrollStepHandler = jest.fn();

        viewModel.velocity = -5;
        const acceleration = 0.5;

        Object.defineProperties(viewModel, { acceleration: { get() { return acceleration; } } });

        (viewModel as any).scrollbarRef = {
          current: { scrollStep: scrollStepHandler },
        };
        viewModel.step();

        let expectedVelocity = -5;
        if (!bounceEnabled && (scrollLocation >= minOffset || scrollLocation <= maxOffset)) {
          expectedVelocity = 0;
        }

        expect(scrollStepHandler).toHaveBeenCalledTimes(1);
        expect(scrollStepHandler).toHaveBeenCalledWith(expectedVelocity, minOffset, maxOffset);

        expect(viewModel.velocity).toEqual(expectedVelocity * acceleration);
      });
    });
  });

  each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('direction: %o', (direction) => {
    each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
      each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
        each([0, 55]).describe('bottomPocketSize: %o', (bottomPocketSize) => {
          each([0, 8]).describe('contentPaddingBottom: %o', (contentPaddingBottom) => {
            each([0, -300]).describe('maxOffset: %o', (maxOffset) => {
              each([true, false]).describe('forceAnimationToBottomBound: %o', (forceAnimationToBottomBound) => {
                it('maxOffset()', () => {
                  const viewModel = new AnimatedScrollbar({
                    direction,
                    forceGeneratePockets,
                    reachBottomEnabled,
                    bottomPocketSize,
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

describe('Handlers', () => {
  each([true, false]).describe('isDxWheelEvent: %o', (isDxWheelEvent) => {
    each([true, false]).describe('crossThumbScrolling: %o', (crossThumbScrolling) => {
      each([true, false]).describe('scrollByThumb: %o', (scrollByThumb) => {
        each(['dx-scrollable-scroll', 'dx-scrollable-scrollbar']).describe('targetClass: %o', (targetClass) => {
          it('initHandler(event, crossThumbScrolling), isDxWheelEvent: %o, crossThumbScrolling: %o, scrollByThumb: %o, targetClass: %, showScrollbar: %o',
            () => {
              const event = { ...defaultEvent, originalEvent: {} } as any;
              if (isDxWheelEvent) {
                event.originalEvent.type = 'dxmousewheel';
              }

              const viewModel = new AnimatedScrollbar({
                direction: 'vertical',
                scrollByThumb,
              });

              const scrollbar = mount(AnimatedScrollbarComponent(viewModel as any));

              const initHandler = jest.fn();
              const hideHandler = jest.fn();
              (viewModel as any).scrollbarRef = {
                current: {
                  initHandler,
                  hide: hideHandler,
                  isScrollbar: jest.fn(() => targetClass === 'dx-scrollable-scrollbar'),
                  isThumb: jest.fn(() => targetClass === 'dx-scrollable-scroll'),
                },
              } as Partial<ScrollbarProps>;

              viewModel.thumbScrolling = false;

              event.originalEvent.target = scrollbar.find(`.${targetClass}`).getDOMNode();

              viewModel.initHandler(event, crossThumbScrolling, 30);

              expect(hideHandler).toHaveBeenCalledTimes(1);
              expect(viewModel.pendingBounceAnimator).toEqual(false);
              expect(viewModel.pendingInertiaAnimator).toEqual(false);
              expect(viewModel.stopped).toEqual(true);
              // TODO: check cancelAnimationFrame call

              expect(viewModel.refreshing).toEqual(false);
              expect(viewModel.loading).toEqual(false);

              let expectedThumbScrolling = false;
              let expectedCrossThumbScrolling = false;

              if (!isDxWheelEvent) {
                const isScrollbarClicked = targetClass !== 'dx-scrollable-scroll' && scrollByThumb;

                expectedThumbScrolling = isScrollbarClicked || (scrollByThumb && targetClass === 'dx-scrollable-scroll');
                expectedCrossThumbScrolling = !expectedThumbScrolling && crossThumbScrolling;
              }

              expect(viewModel.thumbScrolling).toEqual(expectedThumbScrolling);
              expect(viewModel.crossThumbScrolling).toEqual(expectedCrossThumbScrolling);

              expect(initHandler).toHaveBeenCalledTimes(1);
              expect(initHandler).toHaveBeenCalledWith(event, expectedThumbScrolling, 30);
            });
        });
      });
    });
  });

  each([true, false]).describe('crossThumbScrolling: %o', (crossThumbScrolling) => {
    it('moveHandler(delta), crossThumbScrolling: true', () => {
      const delta = 17;
      const viewModel = new AnimatedScrollbar({
        direction: 'vertical',
        minOffset: 0,
      });

      const moveHandler = jest.fn();
      (viewModel as any).scrollbarRef = {
        current: {
          moveHandler,
        },
      } as Partial<ScrollbarProps>;
      Object.defineProperties(viewModel, { maxOffset: { get() { return -100; } } });

      viewModel.crossThumbScrolling = crossThumbScrolling;
      viewModel.thumbScrolling = true;

      viewModel.moveHandler(delta);

      if (crossThumbScrolling) {
        expect(moveHandler).toBeCalledTimes(0);
      } else {
        expect(moveHandler).toHaveBeenCalled();
        expect(moveHandler).toHaveBeenCalledWith(delta, 0, -100, true);
      }
    });
  });

  each([true, false]).describe('ThumbScrolling: %o', (thumbScrolling) => {
    it('stopHandler()', () => {
      const viewModel = new AnimatedScrollbar({ direction: 'vertical' });

      viewModel.thumbScrolling = thumbScrolling;
      viewModel.crossThumbScrolling = true;
      viewModel.needRiseEnd = false;

      viewModel.stopHandler();

      expect(viewModel.needRiseEnd).toEqual(!!thumbScrolling);
      expect(viewModel.thumbScrolling).toEqual(false);
      expect(viewModel.crossThumbScrolling).toEqual(false);
    });

    each([true, false]).describe('needRiseEnd: %o', (needRiseEnd) => {
      it('endHandler(), should start inertia animator on end', () => {
        const velocityDelta = 10;
        const viewModel = new AnimatedScrollbar({ direction: 'vertical' });

        viewModel.start = jest.fn();

        viewModel.thumbScrolling = thumbScrolling;
        viewModel.crossThumbScrolling = true;
        viewModel.needRiseEnd = !needRiseEnd;

        viewModel.endHandler(velocityDelta, needRiseEnd);

        viewModel.needRiseEnd = needRiseEnd;
        viewModel.needRiseEnd = false;

        expect(viewModel.start).toHaveBeenCalledTimes(1);
        expect(viewModel.start).toHaveBeenCalledWith('inertia', velocityDelta, thumbScrolling, true);
        expect(viewModel.thumbScrolling).toEqual(false);
        expect(viewModel.crossThumbScrolling).toEqual(false);
      });
    });
  });
});

describe('Effects', () => {
  each([undefined, jest.fn()]).describe('lockHandler: %o', (lockHandler) => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    each([true, false]).describe('pendingBounceAnimator: %o', (pendingBounceAnimator) => {
      each([true, false]).describe('pendingRefreshing: %o', (pendingRefreshing) => {
        each([true, false]).describe('pendingLoading: %o', (pendingLoading) => {
          it('updateLockState()', () => {
            const viewModel = new AnimatedScrollbar({ direction: 'vertical', onLock: lockHandler });

            viewModel.pendingBounceAnimator = pendingBounceAnimator;
            viewModel.pendingRefreshing = pendingRefreshing;
            viewModel.pendingLoading = pendingLoading;

            viewModel.updateLockedState();

            if (lockHandler && (pendingBounceAnimator || pendingRefreshing || pendingLoading)) {
              expect(lockHandler).toBeCalled();
            }
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
      // eslint-disable-next-line jest/no-commented-out-tests
      // it('onEnd(direction)', () => {
      //   const viewModel = new AnimatedScrollbar({
      //     direction,
      //     onEnd: actionHandler,
      //   });

      //   viewModel.forceAnimationToBottomBound = true;

      //   viewModel.onEnd(direction);

      //   expect(viewModel.forceAnimationToBottomBound).toEqual(false);
      //   if (actionHandler) {
      //     expect(actionHandler).toHaveBeenCalledTimes(1);
      //     expect(actionHandler).toHaveBeenCalledWith(direction);
      //   }
      // });

      each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
        each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
          each([() => true, () => false]).describe('inRange: %o', (inRangeFn) => {
            it('releaseHandler()', () => {
              (inRange as Mock).mockImplementation(inRangeFn);

              const viewModel = new AnimatedScrollbar({
                direction,
                forceGeneratePockets,
                reachBottomEnabled,
                onRelease: actionHandler,
              });

              viewModel.forceAnimationToBottomBound = false;

              viewModel.releaseHandler();

              expect(viewModel.forceAnimationToBottomBound)
                .toEqual(inRangeFn() && forceGeneratePockets && reachBottomEnabled);

              if (actionHandler) {
                expect(actionHandler).toHaveBeenCalledTimes(1);
              }

              expect(viewModel.wasRelease).toEqual(true);
              expect(viewModel.pendingRefreshing).toEqual(false);
              expect(viewModel.pendingLoading).toEqual(false);
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
        minOffset: 0,
      });
      viewModel.stepCore = jest.fn();

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
        const minOffset = 80;
        const viewModel = new AnimatedScrollbar({ scrollLocation, minOffset });

        expect(viewModel.reachedMax()).toEqual(scrollLocation >= minOffset);
      });
    });

    each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
      each([true, false]).describe('pulledDown: %o', (pulledDown) => {
        each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
          each([true, false]).describe('isReachBottom: %o', (isReachBottom) => {
            each([true, false]).describe('wasRelease: %o', (wasRelease) => {
              it('pendingRelease()', () => {
                const viewModel = new AnimatedScrollbar({
                  direction: DIRECTION_VERTICAL,
                  reachBottomEnabled,
                  pullDownEnabled,
                  pulledDown,
                });

                viewModel.wasRelease = wasRelease;

                Object.defineProperties(viewModel, {
                  isReachBottom: { get() { return isReachBottom; } },
                });

                expect(viewModel.pendingRelease).toEqual(
                  ((pulledDown && pullDownEnabled)
                    || (isReachBottom && reachBottomEnabled)) && !wasRelease,
                );
              });
            });
          });
        });
      });
    });

    each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
      each([-300, -360, -600]).describe('maxOffset: %o', (maxOffset) => {
        each([-100, -300, -359.9, -360, -360.1, -500]).describe('scrollLocation: %o', (scrollLocation) => {
          it('isReachBottom()', () => {
            const bottomPocketSize = 55;

            const viewModel = new AnimatedScrollbar({
              direction: 'vertical',
              reachBottomEnabled,
              bottomPocketSize,
              scrollLocation,
              maxOffset,
            });

            if (reachBottomEnabled && scrollLocation <= maxOffset) {
              expect(viewModel.isReachBottom).toBe(true);
            } else {
              expect(viewModel.isReachBottom).toBe(false);
            }
          });
        });
      });
    });

    each([() => true, () => false]).describe('inRange: %o', (inRangeFn) => {
      each([true, false]).describe('isBounceAnimator: %o', (isBounceAnimator) => {
        it('acceleration', () => {
          const viewModel = new AnimatedScrollbar({ minOffset: 0 });
          (inRange as Mock).mockImplementation(inRangeFn);

          Object.defineProperties(viewModel, {
            isBounceAnimator: { get() { return isBounceAnimator; } },
          });

          if (inRange() || isBounceAnimator) {
            expect(viewModel.acceleration).toEqual(ACCELERATION);
          } else {
            expect(viewModel.acceleration).toEqual(OUT_BOUNDS_ACCELERATION);
          }
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
