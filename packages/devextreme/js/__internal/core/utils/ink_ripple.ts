import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import type { DxEvent, PointerInteractionEvent } from '@js/events';

const INKRIPPLE_CLASS = 'dx-inkripple';
const INKRIPPLE_WAVE_CLASS = 'dx-inkripple-wave';
const INKRIPPLE_SHOWING_CLASS = 'dx-inkripple-showing';
const INKRIPPLE_HIDING_CLASS = 'dx-inkripple-hiding';

const DEFAULT_WAVE_SIZE_COEFFICIENT = 2;
const MAX_WAVE_SIZE = 4000; // NOTE: incorrect scaling of ink with big size (T310238)
const ANIMATION_DURATION = 300;
const HOLD_ANIMATION_DURATION = 1000;
const DEFAULT_WAVE_INDEX = 0;

export interface InkRippleDurations {
  showingScale: number;
  hidingScale: number;
  hidingOpacity: number;
}

export interface InkRippleInitConfig {
  useHoldAnimation?: boolean;
  waveSizeCoefficient?: number;
  isCentered?: boolean;
  wavesNumber?: number;
}

export interface InkRippleConfig {
  waveSizeCoefficient: number;
  isCentered: boolean;
  wavesNumber: number;
  durations: InkRippleDurations;
  showingTimeout?: ReturnType<typeof setTimeout>;
  hidingTimeout?: ReturnType<typeof setTimeout>;
}

export type InkRippleWaveEvent = DxEvent<PointerInteractionEvent> & {
  pageX?: number;
  pageY?: number;
};

export interface InkRippleWaveConfig {
  element?: dxElementWrapper | Element | null;
  event?: InkRippleWaveEvent;
  wave?: number;
  wavesNumber?: number;
}

export interface InkRipple {
  showWave: (config: InkRippleWaveConfig) => void;
  hideWave: (config: InkRippleWaveConfig) => void;
}

interface WaveStyleConfig {
  left: number;
  top: number;
  height: number;
  width: number;
}

const getDurations = (useHoldAnimation: boolean): InkRippleDurations => ({
  showingScale: useHoldAnimation ? HOLD_ANIMATION_DURATION : ANIMATION_DURATION,
  hidingScale: ANIMATION_DURATION,
  hidingOpacity: ANIMATION_DURATION,
});

export const initConfig = (config: InkRippleInitConfig = {}): InkRippleConfig => {
  const {
    useHoldAnimation, waveSizeCoefficient, isCentered, wavesNumber,
  } = config;

  return {
    waveSizeCoefficient: waveSizeCoefficient ?? DEFAULT_WAVE_SIZE_COEFFICIENT,
    isCentered: isCentered ?? false,
    wavesNumber: wavesNumber ?? 1,
    durations: getDurations(useHoldAnimation ?? true),
  };
};

const getInkRipple = (element: dxElementWrapper): dxElementWrapper => {
  let result = element.children(`.${INKRIPPLE_CLASS}`);

  if (result.length === 0) {
    result = $('<div>')
      .addClass(INKRIPPLE_CLASS)
      .appendTo(element);
  }

  return result;
};

const getWaves = (
  element: InkRippleWaveConfig['element'],
  wavesNumber: number | undefined,
): dxElementWrapper => {
  const inkRipple = getInkRipple($(element));
  const result = inkRipple.children(`.${INKRIPPLE_WAVE_CLASS}`).toArray();

  for (let i = result.length; i < (wavesNumber ?? 0); i += 1) {
    const $currentWave = $('<div>')
      .appendTo(inkRipple)
      .addClass(INKRIPPLE_WAVE_CLASS);

    result.push($currentWave[0]);
  }

  return $(result);
};

const getWaveStyleConfig = (
  args: InkRippleConfig,
  config: InkRippleWaveConfig,
): WaveStyleConfig => {
  const element = $(config.element);
  const elementWidth = getOuterWidth(element);
  const elementHeight = getOuterHeight(element);
  const elementDiagonal = Math.trunc(
    Math.sqrt(elementWidth * elementWidth + elementHeight * elementHeight),
  );
  const waveSize = Math.min(MAX_WAVE_SIZE, Math.trunc(elementDiagonal * args.waveSizeCoefficient));
  let left = 0;
  let top = 0;

  if (args.isCentered) {
    left = (elementWidth - waveSize) / 2;
    top = (elementHeight - waveSize) / 2;
  } else {
    const { event } = config;
    const position = element.offset();
    const x = (event?.pageX ?? 0) - (position?.left ?? 0);
    const y = (event?.pageY ?? 0) - (position?.top ?? 0);

    left = x - waveSize / 2;
    top = y - waveSize / 2;
  }

  return {
    left,
    top,
    height: waveSize,
    width: waveSize,
  };
};

const hideSelectedWave = ($wave: dxElementWrapper): void => {
  $wave
    .removeClass(INKRIPPLE_HIDING_CLASS)
    .css('transitionDuration', '');
};

const showingWaveHandler = (args: InkRippleConfig, $wave: dxElementWrapper): void => {
  const durationCss = `${args.durations.showingScale}ms`;

  $wave
    .addClass(INKRIPPLE_SHOWING_CLASS)
    .css('transitionDuration', durationCss);
};

export const showWave = (args: InkRippleConfig, config: InkRippleWaveConfig): void => {
  const $wave = getWaves(config.element, args.wavesNumber).eq(config.wave ?? DEFAULT_WAVE_INDEX);

  clearTimeout(args.hidingTimeout);
  hideSelectedWave($wave);
  $wave.css(getWaveStyleConfig(args, config));
  // NOTE: setTimeout is used to trigger the CSS transition of the applied wave styles.
  // eslint-disable-next-line no-restricted-globals
  args.showingTimeout = setTimeout(() => showingWaveHandler(args, $wave), 0);
};

export const hideWave = (args: InkRippleConfig, config: InkRippleWaveConfig): void => {
  clearTimeout(args.showingTimeout);

  const $wave = getWaves(config.element, config.wavesNumber).eq(config.wave ?? DEFAULT_WAVE_INDEX);
  const { durations } = args;
  const durationCss = `${durations.hidingScale}ms, ${durations.hidingOpacity}ms`;

  $wave
    .addClass(INKRIPPLE_HIDING_CLASS)
    .removeClass(INKRIPPLE_SHOWING_CLASS)
    .css('transitionDuration', durationCss);

  const animationDuration = Math.max(durations.hidingScale, durations.hidingOpacity);

  // NOTE: setTimeout is used to clean the wave up after the hiding animation is finished.
  // eslint-disable-next-line no-restricted-globals
  args.hidingTimeout = setTimeout(() => hideSelectedWave($wave), animationDuration);
};

export const render = (config?: InkRippleInitConfig): InkRipple => {
  const inkRippleConfig = initConfig(config);

  return {
    showWave: (waveConfig: InkRippleWaveConfig): void => showWave(inkRippleConfig, waveConfig),
    hideWave: (waveConfig: InkRippleWaveConfig): void => hideWave(inkRippleConfig, waveConfig),
  };
};
