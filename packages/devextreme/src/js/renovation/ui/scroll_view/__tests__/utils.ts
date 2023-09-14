import {
  TopPocketState,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
} from '../common/consts';

const permutations = (array1, array2) => {
  const result = [] as any;
  let counter = 0;

  if (array1.length === 0) {
    return array2;
  }

  array1.forEach((opt1) => {
    array2.forEach((opt2) => {
      if (Array.isArray(opt1)) {
        result[counter] = [...opt1, opt2];
      } else {
        result[counter] = [opt1, opt2];
      }
      counter += 1;
    });
  });

  return result;
};

export function getPermutations(sourceOptionArr: any[][]): any[] {
  return sourceOptionArr.reduce((arr1, arr2) => permutations(arr1, arr2), []);
}

export const optionValues = {
  direction: [DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH],
  allowedDirection: [DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH, undefined],
  pocketState: [
    TopPocketState.STATE_RELEASED, TopPocketState.STATE_READY, TopPocketState.STATE_PULLED,
    TopPocketState.STATE_LOADING, TopPocketState.STATE_TOUCHED,
    TopPocketState.STATE_REFRESHING,
  ],
  pullDownEnabled: [true, false],
  reachBottomEnabled: [true, false],
  nativeRefreshStrategy: ['swipeDown', 'pullDown'],
  forceGeneratePockets: [true, false],
  useSimulatedScrollbar: [true, false],
  isReachBottom: [true, false],
  isSwipeDown: [true, false],
  platforms: ['android', 'ios', 'generic'],
  showScrollbar: ['never', 'always', 'onScroll', 'onHover'],
  bounceEnabled: [true, false],
  inertiaEnabled: [true, false],
  isDxWheelEvent: [true, false],
  scrollByThumb: [true, false],
  scrollByContent: [true, false],
  rtlEnabled: [true, false],
};
