import type { Locator } from '@playwright/test';
import { expect } from '../../../fixtures';

export interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export const getRect = (locator: Locator): Promise<Rect> => locator.evaluate((element) => {
  const {
    top, right, bottom, left, width, height,
  } = element.getBoundingClientRect();

  return {
    top, right, bottom, left, width, height,
  };
});

interface CenterOffset {
  vertical: number;
  horizontal: number;
}

const centerOf = (rect: Rect): { x: number; y: number } => ({
  x: (rect.left + rect.right) / 2,
  y: (rect.top + rect.bottom) / 2,
});

const getCenterOffset = async (outer: Locator, inner: Locator): Promise<CenterOffset> => {
  const outerCenter = centerOf(await getRect(outer));
  const innerCenter = centerOf(await getRect(inner));

  return {
    vertical: Math.abs(outerCenter.y - innerCenter.y),
    horizontal: Math.abs(outerCenter.x - innerCenter.x),
  };
};

const getWindowCenterOffset = async (locator: Locator): Promise<CenterOffset> => {
  const center = centerOf(await getRect(locator));
  const { innerWidth, innerHeight } = await locator.page().evaluate(
    () => ({ innerWidth: window.innerWidth, innerHeight: window.innerHeight }),
  );

  return {
    vertical: Math.abs(innerHeight / 2 - center.y),
    horizontal: Math.abs(innerWidth / 2 - center.x),
  };
};

const expectCenterOffsetWithinHalfPixel = async (
  getOffset: () => Promise<CenterOffset>,
): Promise<void> => {
  await expect.poll(async () => (await getOffset()).vertical).toBeLessThanOrEqual(0.5);
  await expect.poll(async () => (await getOffset()).horizontal).toBeLessThanOrEqual(0.5);
};

export const expectCentered = (outer: Locator, inner: Locator): Promise<void> => (
  expectCenterOffsetWithinHalfPixel(() => getCenterOffset(outer, inner))
);

export const expectCenteredInWindow = (locator: Locator): Promise<void> => (
  expectCenterOffsetWithinHalfPixel(() => getWindowCenterOffset(locator))
);
