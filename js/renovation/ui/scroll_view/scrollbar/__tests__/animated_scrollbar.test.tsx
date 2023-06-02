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
import * as AnimationFrameModule from '../../../../../animation/frame';

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
      direction: 'vertical',
      bottomPocketSize: 0,
      containerHasSizes: false,
      containerSize: 0,
      contentPaddingBottom: 0,
      contentSize: 0,
      visible: false,
      maxOffset: 0,
      minOffset: 0,
      scrollLocation: 0,
      pulledDown: false,
    });
  });

  each([
    { name: 'isScrollbar', calledWith: ['arg1'] },
    { name: 'isThumb', calledWith: ['arg1'] },
    { name: 'setActiveState', calledWith: [] },
  ]).describe('Method: %o', (methodInfo) => {
    it(`${methodInfo.name}() method should call according scrollbar method`, () => {
      const viewModel = new AnimatedScrollbar({});
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

  each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('direction: %o', (direction) => {
    it('axis()', () => {
      const viewModel = new AnimatedScrollbar({ direction });

      expect(viewModel.axis).toBe(direction === DIRECTION_HORIZONTAL ? 'x' : 'y');
    });

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

describe('Methods', () => {
  each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
    it('moveTo(), should not raise any errors when scrollLocationChange events not defined', () => {
      const viewModel = new AnimatedScrollbar({
        showScrollbar: 'always',
        direction,
        onScroll: undefined,
        scrollLocationChange: undefined,
      });

      viewModel.prevScrollLocation = -99;

      expect(() => { viewModel.moveTo(-100); }).not.toThrow();
    });

    test.each([
      { prevScrollLocation: -499, scrollLocation: -500.25, expected: { needFireScroll: true } },
      { prevScrollLocation: -399, scrollLocation: -400, expected: { needFireScroll: true } },
      { prevScrollLocation: -100, scrollLocation: -100.25, expected: { needFireScroll: true } },
      { prevScrollLocation: -55, scrollLocation: -55.75, expected: { needFireScroll: true } },
      { prevScrollLocation: 0, scrollLocation: 0.25, expected: { needFireScroll: true } },
      { prevScrollLocation: 100, scrollLocation: 100.25, expected: { needFireScroll: true } },
      { prevScrollLocation: 500.24, scrollLocation: 500.25, expected: { needFireScroll: true } },
      { prevScrollLocation: 480, scrollLocation: 480, expected: { needFireScroll: false } },
    ])('moveTo(location), pass correct arguments to scrollLocationChange event: %o', ({ prevScrollLocation, scrollLocation, expected }) => {
      const scrollLocationChange = jest.fn();
      const onScrollHandler = jest.fn();

      const viewModel = new AnimatedScrollbar({
        direction,
        scrollLocationChange,
        scrollLocation,
        onScroll: onScrollHandler,
      });

      viewModel.prevScrollLocation = prevScrollLocation;

      viewModel.moveTo(scrollLocation);

      expect(scrollLocationChange).toHaveBeenCalledTimes(1);
      expect(scrollLocationChange).toHaveBeenCalledWith(
        {
          fullScrollProp: viewModel.fullScrollProp,
          location: -scrollLocation,
        },
      );

      expect(onScrollHandler).toBeCalledTimes(expected.needFireScroll ? 1 : 0);
    });
  });
});

describe('Handlers', () => {
  each([true, false]).describe('isDxWheelEvent: %o', (isDxWheelEvent) => {
    each([true, false]).describe('crossThumbScrolling: %o', (crossThumbScrolling) => {
      each([true, false]).describe('scrollByThumb: %o', (scrollByThumb) => {
        each(['dx-scrollable-scroll', 'dx-scrollable-scrollbar']).describe('targetClass: %o', (targetClass) => {
          it('initHandler(event, crossThumbScrolling), isDxWheelEvent: %o, crossThumbScrolling: %o, scrollByThumb: %o, targetClass: %',
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
              (viewModel as any).scrollbarRef = {
                current: {
                  initHandler,
                  isScrollbar: jest.fn(() => targetClass === 'dx-scrollable-scrollbar'),
                  isThumb: jest.fn(() => targetClass === 'dx-scrollable-scroll'),
                },
              } as Partial<ScrollbarProps>;

              viewModel.moveToMouseLocation = jest.fn();
              viewModel.setActiveState = jest.fn();

              viewModel.thumbScrolling = false;

              event.originalEvent.target = scrollbar.find(`.${targetClass}`).getDOMNode();

              viewModel.initHandler(event, crossThumbScrolling, 30);

              expect(viewModel.pendingBounceAnimator).toEqual(false);
              expect(viewModel.pendingInertiaAnimator).toEqual(false);
              expect(viewModel.canceled).toEqual(true);
              expect(viewModel.refreshing).toEqual(false);
              expect(viewModel.loading).toEqual(false);

              let expectedThumbScrolling = false;
              let expectedCrossThumbScrolling = false;

              if (!isDxWheelEvent) {
                const isScrollbarClicked = targetClass !== 'dx-scrollable-scroll' && scrollByThumb;

                expectedThumbScrolling = isScrollbarClicked || (scrollByThumb && targetClass === 'dx-scrollable-scroll');
                expectedCrossThumbScrolling = !expectedThumbScrolling && crossThumbScrolling;

                if (isScrollbarClicked) {
                  expect(viewModel.moveToMouseLocation).toBeCalledTimes(1);
                  expect(viewModel.moveToMouseLocation).toHaveBeenCalledWith(event, 30);
                } else {
                  expect(viewModel.moveToMouseLocation).toBeCalledTimes(0);
                }

                if (expectedThumbScrolling) {
                  expect(viewModel.setActiveState).toBeCalledTimes(1);
                }
              } else {
                expect(viewModel.setActiveState).toBeCalledTimes(0);
                expect(viewModel.moveToMouseLocation).toBeCalledTimes(0);
              }

              expect(viewModel.setActiveState)
                .toHaveBeenCalledTimes(!isDxWheelEvent && expectedThumbScrolling ? 1 : 0);
              expect(viewModel.thumbScrolling).toEqual(expectedThumbScrolling);
              expect(viewModel.crossThumbScrolling).toEqual(expectedCrossThumbScrolling);
            });
        });
      });
    });
  });

  each([true, false]).describe('crossThumbScrolling: %o', (crossThumbScrolling) => {
    each([true, false]).describe('thumbScrolling: %o', (thumbScrolling) => {
      each([true, false]).describe('inRange: %o', (inRangeMockValue) => {
        each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
          each([80, 10, 0, -50, -90, -100, -140]).describe('scrollLocation: %o', (scrollLocation) => {
            each([10, 30, 40]).describe('Delta: %o', (delta) => {
              each([500, 100, 75]).describe('contentSize: %o', (contentSize) => {
                afterEach(() => {
                  jest.clearAllMocks();
                });

                it('moveHandler(delta)', () => {
                  (inRange as Mock).mockReturnValue(inRangeMockValue);
                  const containerSize = 100;
                  const viewModel = new AnimatedScrollbar({
                    direction: 'vertical',
                    minOffset: 0,
                    bounceEnabled,
                    scrollLocation,
                    containerSize,
                    contentSize,
                  });

                  viewModel.moveTo = jest.fn();

                  Object.defineProperties(viewModel, {
                    maxOffset: { get() { return -100; } },
                  });

                  viewModel.crossThumbScrolling = crossThumbScrolling;
                  viewModel.thumbScrolling = thumbScrolling;

                  viewModel.moveHandler(delta, false);

                  let resultDelta = delta;

                  if (thumbScrolling) {
                    resultDelta = -Math.round(delta / (containerSize / contentSize));
                  }

                  const isOutBounds = !inRangeMockValue;
                  if (isOutBounds) {
                    resultDelta *= OUT_BOUNDS_ACCELERATION;
                  }

                  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                  resultDelta += scrollLocation as number;

                  if (!bounceEnabled) {
                    if (resultDelta >= 0) {
                      resultDelta = 0;
                    } else if (resultDelta <= -100) {
                      resultDelta = -100;
                    }
                  }

                  if (crossThumbScrolling) {
                    expect(viewModel.moveTo).toBeCalledTimes(0);
                  } else {
                    expect(viewModel.moveTo).toBeCalledTimes(1);
                    expect(viewModel.moveTo).toHaveBeenCalledWith(resultDelta);
                  }
                });
              });
            });
          });
        });
      });
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

    it('scrollToNextStep()', () => {
      try {
        const cancelAnimationFrameHandler = jest.fn();
        const requestAnimationFrameHandler = jest.fn(() => 14);

        jest.spyOn(AnimationFrameModule, 'cancelAnimationFrame').mockImplementation(cancelAnimationFrameHandler);
        jest.spyOn(AnimationFrameModule, 'requestAnimationFrame').mockImplementation(requestAnimationFrameHandler);

        const viewModel = new AnimatedScrollbar({
          direction: 'vertical',
          scrollLocation: -100,
        });

        viewModel.velocity = -7;
        Object.defineProperties(viewModel, {
          acceleration: { get() { return 0.92; } },
        });
        viewModel.moveTo = jest.fn();

        viewModel.stepAnimationFrame = 13;

        viewModel.scrollToNextStep();

        expect(cancelAnimationFrameHandler).toBeCalledTimes(1);
        expect(cancelAnimationFrameHandler).toBeCalledWith(13);

        expect(requestAnimationFrameHandler).toBeCalledTimes(1);
        const requestHandler = requestAnimationFrameHandler.mock.calls[0];
        (requestHandler as any)[0]();

        expect(viewModel.stepAnimationFrame).toEqual(14);
        expect(viewModel.moveTo).toBeCalledTimes(1);
        expect(viewModel.moveTo).toBeCalledWith(-107);
        // expect(viewModel.newScrollLocation).toEqual(-107);
        expect(viewModel.velocity).toEqual(-6.44);
      } finally {
        jest.restoreAllMocks();
      }
    });

    each([
      {
        scrollLocation: 100, minOffset: 80, maxOffset: -200, velocity: -10, expectedVelocity: -10,
      },
      {
        scrollLocation: 89, minOffset: 80, maxOffset: -200, velocity: -10, expectedVelocity: -9,
      },
      {
        scrollLocation: 70.5, minOffset: 80, maxOffset: -200, velocity: 10, expectedVelocity: 9.5,
      },
      {
        scrollLocation: 69.9, minOffset: 80, maxOffset: -200, velocity: 10, expectedVelocity: 10,
      },
      {
        scrollLocation: 69.9, minOffset: 0, maxOffset: -200, velocity: -10, expectedVelocity: -10,
      },
      {
        scrollLocation: 9.8, minOffset: 0, maxOffset: -200, velocity: -10, expectedVelocity: -9.8,
      },
      {
        scrollLocation: 1, minOffset: 0, maxOffset: -200, velocity: -10, expectedVelocity: -1,
      },
      {
        scrollLocation: -1, minOffset: 0, maxOffset: -200, velocity: 10, expectedVelocity: 1,
      },
      {
        scrollLocation: -9, minOffset: 0, maxOffset: -200, velocity: 10, expectedVelocity: 9,
      },
      {
        scrollLocation: -11, minOffset: 0, maxOffset: -200, velocity: 10, expectedVelocity: 10,
      },
      {
        scrollLocation: -189, minOffset: 0, maxOffset: -200, velocity: -10, expectedVelocity: -10,
      },
      {
        scrollLocation: -190, minOffset: 0, maxOffset: -200, velocity: -10, expectedVelocity: -10,
      },
      {
        scrollLocation: -191, minOffset: 0, maxOffset: -200, velocity: -10, expectedVelocity: -9,
      },
      {
        scrollLocation: -199, minOffset: 0, maxOffset: -200, velocity: -10, expectedVelocity: -1,
      },
      {
        scrollLocation: -200, minOffset: 0, maxOffset: -200, velocity: -10, expectedVelocity: 0,
      },
      {
        scrollLocation: -201, minOffset: 0, maxOffset: -200, velocity: 10, expectedVelocity: 1,
      },
      {
        scrollLocation: -209, minOffset: 0, maxOffset: -200, velocity: 10, expectedVelocity: 9,
      },
      {
        scrollLocation: -210, minOffset: 0, maxOffset: -200, velocity: 10, expectedVelocity: 10,
      },
      {
        scrollLocation: -211, minOffset: 0, maxOffset: -200, velocity: 10, expectedVelocity: 10,
      },
    ]).describe('suppressVelocityBeforeBoundary', ({
      scrollLocation, minOffset, maxOffset, velocity, expectedVelocity,
    }) => {
      it(`scrollLocation: ${scrollLocation}, min: ${minOffset}, max: ${maxOffset}, velocity: ${velocity}`, () => {
        const viewModel = new AnimatedScrollbar({
          direction: 'vertical',
          scrollLocation,
          minOffset,
        });

        viewModel.velocity = velocity;

        Object.defineProperties(viewModel, {
          maxOffset: { get() { return maxOffset; } },
        });

        viewModel.suppressVelocityBeforeBoundary();

        expect(viewModel.velocity).toEqual(expectedVelocity);
      });
    });

    each([true, false]).describe('needRiseEnd: %o', (needRiseEnd) => {
      each([true, false]).describe('inertiaEnabled: %o', (inertiaEnabled) => {
        it('endHandler(), should start inertia animator on end', () => {
          const velocityDelta = 10;
          const viewModel = new AnimatedScrollbar({
            direction: 'vertical',
            inertiaEnabled,
          });

          viewModel.thumbScrolling = thumbScrolling;
          viewModel.crossThumbScrolling = true;
          viewModel.needRiseEnd = !needRiseEnd;

          viewModel.endHandler(velocityDelta, needRiseEnd);

          expect(viewModel.velocity).toEqual(inertiaEnabled && !thumbScrolling ? velocityDelta : 0);
          expect(viewModel.needRiseEnd).toEqual(needRiseEnd);
          expect(viewModel.thumbScrolling).toEqual(false);
          expect(viewModel.crossThumbScrolling).toEqual(false);
        });
      });
    });
  });
});

describe('Effects', () => {
  each([undefined, jest.fn()]).describe('lockHandler: %o', (lockHandler) => {
    each([undefined, jest.fn()]).describe('unLockHandler: %o', (unLockHandler) => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      each([true, false]).describe('pendingBounceAnimator: %o', (pendingBounceAnimator) => {
        each([true, false]).describe('pendingRefreshing: %o', (pendingRefreshing) => {
          each([true, false]).describe('pendingLoading: %o', (pendingLoading) => {
            it('updateLockState()', () => {
              const viewModel = new AnimatedScrollbar({
                direction: 'vertical',
                onLock: lockHandler,
                onUnlock: unLockHandler,
              });

              viewModel.pendingBounceAnimator = pendingBounceAnimator;
              viewModel.pendingRefreshing = pendingRefreshing;
              viewModel.pendingLoading = pendingLoading;

              viewModel.updateLockedState();

              if (pendingBounceAnimator || pendingRefreshing || pendingLoading) {
                if (lockHandler) {
                  expect(lockHandler).toBeCalled();
                }
              } else if (unLockHandler) {
                expect(unLockHandler).toBeCalled();
              }
            });
          });
        });
      });
    });
  });

  it('performAnimation(), pendingBounceAnimation: false, pendingInertiaAnimator: false', () => {
    const viewModel = new AnimatedScrollbar({
      direction: 'vertical',
    });

    viewModel.pendingBounceAnimator = false;
    viewModel.pendingBounceAnimator = false;
    viewModel.canceled = true;

    viewModel.stop = jest.fn();
    viewModel.suppressVelocityBeforeBoundary = jest.fn();
    viewModel.scrollToNextStep = jest.fn();

    Object.defineProperties(viewModel, {
      finished: { get() { return false; } },
    });

    viewModel.updateLockedState();

    expect(viewModel.stop).toBeCalledTimes(0);
    expect(viewModel.suppressVelocityBeforeBoundary).toBeCalledTimes(0);
    expect(viewModel.scrollToNextStep).toBeCalledTimes(0);
  });

  each([0, 10, -10]).describe('distanceToNearestBoundary: %o', (distanceToNearestBoundary) => {
    it('performAnimation(), pendingBounceAnimation: true, pendingInertiaAnimator: false', () => {
      const viewModel = new AnimatedScrollbar({
        direction: 'vertical',
      });

      viewModel.pendingBounceAnimator = true;
      viewModel.pendingInertiaAnimator = false;
      viewModel.canceled = true;

      viewModel.stop = jest.fn();
      viewModel.suppressVelocityBeforeBoundary = jest.fn();
      viewModel.scrollToNextStep = jest.fn();

      Object.defineProperties(viewModel, {
        finished: { get() { return false; } },
        distanceToNearestBoundary: { get() { return distanceToNearestBoundary; } },
      });

      viewModel.performAnimation();

      if (distanceToNearestBoundary === 0) {
        expect(viewModel.stop).toBeCalledTimes(1);
        expect(viewModel.suppressVelocityBeforeBoundary).toBeCalledTimes(0);
        expect(viewModel.scrollToNextStep).toBeCalledTimes(0);
      } else {
        expect(viewModel.stop).toBeCalledTimes(0);
        expect(viewModel.suppressVelocityBeforeBoundary).toBeCalledTimes(1);
        expect(viewModel.scrollToNextStep).toBeCalledTimes(1);
      }
    });
  });

  each([0, 10, -10]).describe('distanceToNearestBoundary: %o', (distanceToNearestBoundary) => {
    each([true, false]).describe('canceled: %o', (canceled) => {
      each([true, false]).describe('finished: %o', (finished) => {
        each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
          it('performAnimation(), pendingBounceAnimation: false, pendingInertiaAnimator: true', () => {
            const viewModel = new AnimatedScrollbar({
              direction: 'vertical',
              bounceEnabled,
            });

            viewModel.pendingBounceAnimator = false;
            viewModel.pendingInertiaAnimator = true;
            viewModel.canceled = canceled;
            viewModel.needRiseEnd = true;

            viewModel.stop = jest.fn();
            viewModel.suppressVelocityBeforeBoundary = jest.fn();
            viewModel.scrollToNextStep = jest.fn();

            Object.defineProperties(viewModel, {
              finished: { get() { return finished; } },
              distanceToNearestBoundary: { get() { return distanceToNearestBoundary; } },
            });

            viewModel.performAnimation();

            if (canceled) {
              expect(viewModel.needRiseEnd).toEqual(false);
              expect(viewModel.stop).toBeCalledTimes(1);
              expect(viewModel.suppressVelocityBeforeBoundary).toBeCalledTimes(0);
              expect(viewModel.scrollToNextStep).toBeCalledTimes(0);
              return;
            }

            if (finished || (!bounceEnabled && distanceToNearestBoundary === 0)) {
              expect(viewModel.needRiseEnd).toEqual(true);
              expect(viewModel.stop).toBeCalledTimes(1);
              expect(viewModel.suppressVelocityBeforeBoundary).toBeCalledTimes(0);
              expect(viewModel.scrollToNextStep).toBeCalledTimes(0);
              return;
            }

            if (!bounceEnabled) {
              expect(viewModel.suppressVelocityBeforeBoundary).toBeCalledTimes(1);
            } else {
              expect(viewModel.suppressVelocityBeforeBoundary).toBeCalledTimes(0);
            }

            expect(viewModel.needRiseEnd).toEqual(true);
            expect(viewModel.stop).toBeCalledTimes(0);
            expect(viewModel.scrollToNextStep).toBeCalledTimes(1);
          });
        });
      });
    });
  });

  each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL]).describe('direction: %o', (direction) => {
    each([
      { eventData: { pageX: 50, pageY: 50 }, scrollLocation: 0, expected: 10 },
      { eventData: { pageX: 50, pageY: 50 }, scrollLocation: -150, expected: 10 },
      { eventData: { pageX: 50, pageY: 50 }, scrollLocation: -300, expected: 10 },
      { eventData: { pageX: 65.5, pageY: 65.5 }, scrollLocation: 0, expected: -52 },
      { eventData: { pageX: 65.5, pageY: 65.5 }, scrollLocation: -150, expected: -52 },
      { eventData: { pageX: 65.5, pageY: 65.5 }, scrollLocation: -300, expected: -52 },
      { eventData: { pageX: 87, pageY: 87 }, scrollLocation: 0, expected: -138 },
      { eventData: { pageX: 87, pageY: 87 }, scrollLocation: -150, expected: -138 },
      { eventData: { pageX: 87, pageY: 87 }, scrollLocation: -300, expected: -138 },
      { eventData: { pageX: 139, pageY: 139 }, scrollLocation: 0, expected: -346 },
      { eventData: { pageX: 139, pageY: 139 }, scrollLocation: -150, expected: -346 },
      { eventData: { pageX: 139, pageY: 139 }, scrollLocation: -300, expected: -346 },
    ]).describe('testData: %o', (testData) => {
      it('moveToMouseLocation(event)', () => {
        const viewModel = new AnimatedScrollbar({
          direction,
          containerSize: 100,
          contentSize: 400,
          maxOffset: -300,
          scrollLocation: testData.scrollLocation,
        });

        viewModel.moveTo = jest.fn();

        viewModel.moveToMouseLocation(testData.eventData, 40);

        expect(viewModel.moveTo).toHaveBeenCalledTimes(1);
        expect(viewModel.moveTo).toHaveBeenCalledWith(testData.expected);
      });
    });

    each([true, false]).describe('containerHasSizes: %o', (containerHasSizes) => {
      each([true, false]).describe('rtlEnabled: %o', (rtlEnabled) => {
        each([-600, -500, -100, -50, 0, 50, 100]).describe('scrollLocation: %o', (scrollLocation) => {
          each([0, -300]).describe('maxOffset: %o', (maxOffset) => {
            it('updateScrollLocationInRTL() should call moveTo(location)', () => {
              const viewModel = new AnimatedScrollbar({
                showScrollbar: 'always',
                direction,
                scrollLocation,
                containerHasSizes,
                maxOffset,
                rtlEnabled,
              });

              // viewModel.config = ConfigContext;

              [0, -50, -100, -250, -400].forEach((initialRightScrollLocation) => {
                viewModel.moveTo = jest.fn();

                viewModel.rightScrollLocation = initialRightScrollLocation;

                viewModel.updateScrollLocationInRTL();

                let expectedRightScrollLocation = initialRightScrollLocation;
                if (containerHasSizes && direction === 'horizontal' && rtlEnabled) { // && ConfigContext?.rtlEnabled
                  if (maxOffset === 0 && scrollLocation) {
                    expectedRightScrollLocation = 0;
                  }

                  const newScrollLocation = maxOffset - expectedRightScrollLocation;

                  expect(viewModel.moveTo).toHaveBeenCalledTimes(1);
                  expect(viewModel.moveTo).toHaveBeenCalledWith(newScrollLocation);
                } else {
                  expect(viewModel.moveTo).not.toBeCalled();
                }
                expect(viewModel.rightScrollLocation).toEqual(expectedRightScrollLocation);
              });
            });
          });
        });
      });
    });
  });

  each([undefined, jest.fn()]).describe('eventHandler: %o', (eventHandler) => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    each([true, false]).describe('isReadyToStart: %o', (isReadyToStart) => {
      each([true, false]).describe('inRange: %o', (inRangeValue) => {
        each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
          each([true, false]).describe('pulledDown: %o', (pulledDown) => {
            each([true, false]).describe('refreshing: %o', (refreshing) => {
              it('risePullDown()', () => {
                const viewModel = new AnimatedScrollbar({
                  direction: 'vertical',
                  forceGeneratePockets,
                  pulledDown,
                  onPullDown: eventHandler,
                });

                viewModel.refreshing = refreshing;
                Object.defineProperties(viewModel, {
                  isReadyToStart: { get() { return isReadyToStart; } },
                  inRange: { get() { return inRangeValue; } },
                });

                viewModel.risePullDown();

                let expectedRefreshing = refreshing;
                let expectedPendingRefreshing = false;
                let needRisePullDown = false;

                if (forceGeneratePockets && isReadyToStart
                      && inRangeValue && pulledDown && !refreshing) {
                  expectedRefreshing = true;
                  expectedPendingRefreshing = true;
                  needRisePullDown = true;
                }

                expect(viewModel.refreshing).toEqual(expectedRefreshing);
                expect(viewModel.pendingRefreshing).toEqual(expectedPendingRefreshing);
                if (eventHandler) {
                  expect(eventHandler).toHaveBeenCalledTimes(needRisePullDown ? 1 : 0);
                }
              });
            });
          });
        });

        each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
          each([true, false]).describe('isReachBottom: %o', (isReachBottom) => {
            each([true, false]).describe('loading: %o', (loading) => {
              each([true, false]).describe('finished: %o', (finished) => {
                it('riseReachBottom()', () => {
                  const viewModel = new AnimatedScrollbar({
                    direction: 'vertical',
                    forceGeneratePockets,
                    onReachBottom: eventHandler,
                  });

                  viewModel.loading = loading;
                  Object.defineProperties(viewModel, {
                    isReadyToStart: { get() { return isReadyToStart; } },
                    inRange: { get() { return inRangeValue; } },
                    isReachBottom: { get() { return isReachBottom; } },
                    finished: { get() { return finished; } },
                  });

                  viewModel.riseReachBottom();

                  let expectedLoading = loading;
                  let expectedPendingLoading = false;
                  let needRiseReachBottom = false;

                  if (forceGeneratePockets && isReadyToStart
                      && inRangeValue && isReachBottom && !loading && finished) {
                    expectedLoading = true;
                    expectedPendingLoading = true;
                    needRiseReachBottom = true;
                  }

                  expect(viewModel.loading).toEqual(expectedLoading);
                  expect(viewModel.pendingLoading).toEqual(expectedPendingLoading);
                  if (eventHandler) {
                    expect(eventHandler).toHaveBeenCalledTimes(needRiseReachBottom ? 1 : 0);
                  }
                });
              });
            });
          });
        });

        each([true, false]).describe('finished: %o', (finished) => {
          each([true, false]).describe('pendingRelease: %o', (pendingRelease) => {
            it('riseEnd()', () => {
              (inRange as Mock).mockReturnValue(inRangeValue);
              const viewModel = new AnimatedScrollbar({
                direction: 'vertical',
                onEnd: eventHandler,
              });

              Object.defineProperties(viewModel, {
                isReadyToStart: { get() { return isReadyToStart; } },
                pendingRelease: { get() { return pendingRelease; } },
                finished: { get() { return finished; } },
              });

              viewModel.needRiseEnd = true;
              viewModel.wasRelease = true;
              viewModel.forceAnimationToBottomBound = true;

              viewModel.riseEnd();

              let expectedNeedRiseEnd = true;
              let expectedWasRelease = true;
              let expectedForceAnimationToBottomBound = true;
              let needRiseEnd = false;

              if (isReadyToStart && inRangeValue && finished && !pendingRelease) {
                expectedNeedRiseEnd = false;
                expectedWasRelease = false;
                expectedForceAnimationToBottomBound = false;
                needRiseEnd = true;
              }

              expect(viewModel.needRiseEnd).toEqual(expectedNeedRiseEnd);
              expect(viewModel.wasRelease).toEqual(expectedWasRelease);
              expect(viewModel.forceAnimationToBottomBound)
                .toEqual(expectedForceAnimationToBottomBound);

              if (eventHandler) {
                expect(eventHandler).toHaveBeenCalledTimes(needRiseEnd ? 1 : 0);
              }
            });
          });
        });

        each([true, false]).describe('inertiaEnabled: %o', (inertiaEnabled) => {
          each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
            each([true, false]).describe('thumbScrolling: %o', (thumbScrolling) => {
              each([true, false]).describe('crossThumbScrolling: %o', (crossThumbScrolling) => {
                each([true, false]).describe('pendingAnimator: %o', (pendingAnimator) => {
                  it('startAnimator()', () => {
                    (inRange as Mock).mockReturnValue(inRangeValue);
                    const viewModel = new AnimatedScrollbar({
                      direction: 'vertical',
                      inertiaEnabled,
                      bounceEnabled,
                      onBounce: eventHandler,
                      scrollLocation: -1500,
                      maxOffset: -700,
                      minOffset: 0,
                    });

                    viewModel.thumbScrolling = thumbScrolling;
                    viewModel.crossThumbScrolling = crossThumbScrolling;
                    viewModel.pendingBounceAnimator = pendingAnimator;
                    viewModel.pendingInertiaAnimator = pendingAnimator;
                    Object.defineProperties(viewModel, {
                      isReadyToStart: { get() { return isReadyToStart; } },
                    });
                    viewModel.canceled = true;
                    viewModel.velocity = -10;

                    viewModel.startAnimator();

                    let expectedCanceled = true;
                    let expectedVelocity = -10;
                    let expectedPendingInertiaAnimator = pendingAnimator;
                    let needRiseBounce = false;
                    let expectedPendingBounceAnimator = pendingAnimator;

                    if (isReadyToStart) {
                      expectedCanceled = false;

                      if (inRangeValue && inertiaEnabled && !pendingAnimator) {
                        if (thumbScrolling || (!thumbScrolling && crossThumbScrolling)) {
                          expectedVelocity = 0;
                        }
                        expectedPendingInertiaAnimator = true;
                      }

                      if (!inRangeValue && bounceEnabled && !pendingAnimator) {
                        expectedVelocity = 800 / BOUNCE_ACCELERATION_SUM;
                        expectedPendingBounceAnimator = true;
                        needRiseBounce = true;
                      }
                    }

                    expect(viewModel.canceled).toEqual(expectedCanceled);
                    expect(viewModel.velocity).toEqual(expectedVelocity);
                    expect(viewModel.pendingInertiaAnimator)
                      .toEqual(expectedPendingInertiaAnimator);
                    expect(viewModel.pendingBounceAnimator)
                      .toEqual(expectedPendingBounceAnimator);

                    if (eventHandler) {
                      expect(eventHandler).toHaveBeenCalledTimes(needRiseBounce ? 1 : 0);
                    }
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

    each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
      each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
        each([() => true, () => false]).describe('inRange: %o', (inRangeFn) => {
          it('releaseHandler()', () => {
            (inRange as Mock).mockImplementation(inRangeFn);

            const viewModel = new AnimatedScrollbar({
              direction,
              forceGeneratePockets,
              reachBottomEnabled,
            });

            viewModel.forceAnimationToBottomBound = false;

            viewModel.releaseHandler();

            expect(viewModel.forceAnimationToBottomBound)
              .toEqual(inRangeFn() && forceGeneratePockets && reachBottomEnabled);

            expect(viewModel.wasRelease).toEqual(true);
            expect(viewModel.pendingRefreshing).toEqual(false);
            expect(viewModel.pendingLoading).toEqual(false);
          });
        });
      });
    });
  });
});

describe('Animator', () => {
  it('should set correct stopped state on animator cancel()', () => {
    const viewModel = new AnimatedScrollbar({ });

    viewModel.cancel();

    expect(viewModel.canceled).toBe(true);
    expect(viewModel.pendingBounceAnimator).toBe(false);
    expect(viewModel.pendingBounceAnimator).toBe(false);
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

    each([
      {
        scrollLocation: 100, minOffset: 80, maxOffset: -200, expected: 20,
      },
      {
        scrollLocation: 90, minOffset: 80, maxOffset: -200, expected: 10,
      },
      {
        scrollLocation: 75, minOffset: 80, maxOffset: -200, expected: 5,
      },
      {
        scrollLocation: -20, minOffset: 0, maxOffset: -200, expected: 20,
      },
      {
        scrollLocation: -99, minOffset: 0, maxOffset: -200, expected: 99,
      },
      {
        scrollLocation: -130, minOffset: 0, maxOffset: -200, expected: 70,
      },
      {
        scrollLocation: -185, minOffset: 0, maxOffset: -200, expected: 15,
      },
      {
        scrollLocation: -210, minOffset: 0, maxOffset: -200, expected: 10,
      },
    ]).describe('distanceToNearestBoundary', ({
      scrollLocation, minOffset, maxOffset, expected,
    }) => {
      it(`scrollLocation: ${scrollLocation}, min: ${minOffset}, max: ${maxOffset}`, () => {
        const viewModel = new AnimatedScrollbar({
          direction: 'vertical',
          scrollLocation,
          minOffset,
        });

        Object.defineProperties(viewModel, {
          maxOffset: { get() { return maxOffset; } },
        });

        expect(viewModel.distanceToNearestBoundary).toEqual(expected);
      });
    });

    each([true, false]).describe('pendingBounceAnimator: %o', (pendingBounceAnimator) => {
      each([true, false]).describe('pendingInertiaAnimator: %o', (pendingInertiaAnimator) => {
        it('inProgress', () => {
          const viewModel = new AnimatedScrollbar({ direction: 'vertical' });

          viewModel.pendingBounceAnimator = pendingBounceAnimator;
          viewModel.pendingInertiaAnimator = pendingInertiaAnimator;

          expect(viewModel.inProgress).toEqual(pendingInertiaAnimator || pendingBounceAnimator);
        });
      });
    });

    each([true, false]).describe('needRiseEnd: %o', (needRiseEnd) => {
      each([true, false]).describe('inProgress: %o', (inProgress) => {
        each([true, false]).describe('pendingRefreshing: %o', (pendingRefreshing) => {
          each([true, false]).describe('pendingLoading: %o', (pendingLoading) => {
            each([0, -500]).describe('maxOffset: %o', (maxOffset) => {
              it('isReadyToStart', () => {
                const viewModel = new AnimatedScrollbar({
                  direction: 'vertical',
                  maxOffset,
                });

                viewModel.needRiseEnd = needRiseEnd;
                viewModel.pendingRefreshing = pendingRefreshing;
                viewModel.pendingLoading = pendingLoading;

                Object.defineProperties(viewModel, {
                  inProgress: { get() { return inProgress; } },
                });

                expect(viewModel.isReadyToStart).toEqual(needRiseEnd && !inProgress
                    && !(pendingRefreshing || pendingLoading) /* && maxOffset < 0 */);
              });
            });
          });
        });
      });
    });

    each([true, false]).describe('pendingBounceAnimator: %o', (pendingBounceAnimator) => {
      each([0.1, -0.2, -0.6, 1, 1.3, 5]).describe('Velocity: %o', (velocity) => {
        it('finished', () => {
          const viewModel = new AnimatedScrollbar({ });

          viewModel.velocity = velocity;
          viewModel.pendingBounceAnimator = pendingBounceAnimator;

          expect(viewModel.finished)
            .toEqual(pendingBounceAnimator
              ? Math.abs(velocity) <= BOUNCE_MIN_VELOCITY_LIMIT
              : Math.abs(velocity) <= MIN_VELOCITY_LIMIT);
        });
      });
    });

    each([true, false]).describe('pulledDown: %o', (pulledDown) => {
      each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
        each([true, false]).describe('isReachBottom: %o', (isReachBottom) => {
          each([true, false]).describe('wasRelease: %o', (wasRelease) => {
            it('pendingRelease()', () => {
              const viewModel = new AnimatedScrollbar({
                direction: DIRECTION_VERTICAL,
                forceGeneratePockets,
                pulledDown,
              });

              viewModel.wasRelease = wasRelease;

              Object.defineProperties(viewModel, {
                isReachBottom: { get() { return isReachBottom; } },
              });

              expect(viewModel.pendingRelease).toEqual(
                forceGeneratePockets
                  && (pulledDown || isReachBottom)
                  && !wasRelease,
              );
            });
          });
        });
      });
    });

    each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
      each([-300, -360, -600]).describe('maxOffset: %o', (maxOffset: number) => {
        each([-100, -300, -357.99, -358.1, -358.49, -358.50, -358.51, -358.99, -359, -359.01, -359.9, -360, -360.1, -500]).describe('scrollLocation: %o', (scrollLocation) => {
          it('isReachBottom()', () => {
            const bottomPocketSize = 55;

            const viewModel = new AnimatedScrollbar({
              direction: 'vertical',
              reachBottomEnabled,
              bottomPocketSize,
              scrollLocation,
              maxOffset,
            });

            if (reachBottomEnabled && scrollLocation < maxOffset + 2) {
              expect(viewModel.isReachBottom).toBe(true);
            } else {
              expect(viewModel.isReachBottom).toBe(false);
            }
          });
        });
      });
    });

    each([() => true, () => false]).describe('inRange: %o', (inRangeFn) => {
      each([true, false]).describe('pendingBounceAnimator: %o', (pendingBounceAnimator) => {
        it('acceleration', () => {
          const viewModel = new AnimatedScrollbar({ minOffset: 0 });
          (inRange as Mock).mockImplementation(inRangeFn);
          viewModel.pendingBounceAnimator = pendingBounceAnimator;

          expect(viewModel.acceleration).toEqual(inRange() || pendingBounceAnimator
            ? ACCELERATION
            : OUT_BOUNDS_ACCELERATION);
        });
      });
    });
  });
});
