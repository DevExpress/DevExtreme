import type { AnimationConfig } from '@js/common/core/animation';
import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import { getWidth } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';

import type { IToolbarButtonConfig } from './types';

export const POPUP_WIDTH = {
  DEFAULT: 485,
  RECURRENCE: 970,
  FULLSCREEN: 1000,

  MOBILE: {
    DEFAULT: 350,
    FULLSCREEN: 500,
  },
};

export const defaultAnimation: {
  show: AnimationConfig;
  hide: AnimationConfig;
} = {
  show: {
    type: 'pop',
    duration: 300,
    from: {
      scale: 0.55,
    },
  },
  hide: {
    type: 'pop',
    duration: 300,
    to: {
      opacity: 0,
      scale: 0.55,
    },
    from: {
      opacity: 1,
      scale: 1,
    },
  },
};

const isMobile = (): boolean => devices.current().deviceType !== 'desktop';
const isIOSPlatform = (): boolean => devices.current().platform === 'ios';

const TOOLBAR_LOCATION = {
  AFTER: 'after',
  BEFORE: 'before',
};

const getButtonsConfig = (): {
  doneButton: IToolbarButtonConfig;
  cancelButton: IToolbarButtonConfig;
} => ({
  doneButton: {
    shortcut: 'done',
    options: { text: messageLocalization.format('Done') },
    location: TOOLBAR_LOCATION.AFTER,
  },
  cancelButton: {
    shortcut: 'cancel',
    location: isIOSPlatform()
      ? TOOLBAR_LOCATION.BEFORE
      : TOOLBAR_LOCATION.AFTER,
  },
});

export const getPopupToolbarItems = (
  allowUpdating: boolean,
  doneClick?: (e: { cancel: boolean }) => void,
): IToolbarButtonConfig[] => {
  const result: IToolbarButtonConfig[] = [];
  const buttonsConfig = getButtonsConfig();

  if (allowUpdating) {
    result.push(
      {
        ...buttonsConfig.doneButton,
        onClick: doneClick,
      },
    );
  }

  result.push(buttonsConfig.cancelButton);

  return result;
};

export const isPopupFullScreenNeeded = (): boolean => {
  const window = getWindow();
  const width = window && getWidth(window);

  if (width) {
    return isMobile()
      ? width < POPUP_WIDTH.MOBILE.FULLSCREEN
      : width < POPUP_WIDTH.FULLSCREEN;
  }

  return false;
};

export const getMaxWidth = (
  isRecurrence?: boolean,
): number | string => {
  if (isMobile()) {
    return POPUP_WIDTH.MOBILE.DEFAULT;
  }

  return isRecurrence
    ? POPUP_WIDTH.RECURRENCE
    : POPUP_WIDTH.DEFAULT;
};

export const getPopupSize = (isRecurrence?: boolean): {
  fullScreen: boolean;
  maxWidth: number | string;
} => ({
  fullScreen: isPopupFullScreenNeeded(),
  maxWidth: getMaxWidth(isRecurrence),
});
