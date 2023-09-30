import messageLocalization from '../../../../localization/message';
import devices from '../../../../core/devices';
import { getWidth } from '../../../../core/utils/size';
import { getWindow } from '../../../../core/utils/window';
import type { AnimationConfig } from '../../../../animation/fx';
import { ToolbarItemLocation } from '../../../../common';

interface IToolbarButtonOptions {
  text: string;
}

export interface IToolbarButtonConfig {
  shortcut: 'done' | 'cancel';
  location: ToolbarItemLocation;
  options?: IToolbarButtonOptions;
  onClick?: (e: { cancel: boolean }) => void;
}

export interface IAppointmentPopupSize {
  fullScreen: boolean;
  maxWidth: number | string;
}

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

export const createDoneButton = (
  location: ToolbarItemLocation, options?: IToolbarButtonOptions,
): IToolbarButtonConfig => ({
  shortcut: 'done',
  location,
  options,
});

export const createCancelButton = (
  location: ToolbarItemLocation, options?: IToolbarButtonOptions,
): IToolbarButtonConfig => ({
  shortcut: 'cancel',
  location,
  options,
});

const getButtonsConfig = (): {
  doneButton: IToolbarButtonConfig;
  cancelButton: IToolbarButtonConfig;
} => ({
  doneButton: createDoneButton('after', { text: messageLocalization.format('Done') }),
  cancelButton: createCancelButton(isIOSPlatform() ? 'before' : 'after'),
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
