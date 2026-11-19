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

const getCenterOffset = async (
  outer: Locator,
  inner: Locator,
): Promise<{ vertical: number; horizontal: number }> => {
  const outerRect = await getRect(outer);
  const innerRect = await getRect(inner);
  const centerOf = (rect: Rect): { x: number; y: number } => ({
    x: (rect.left + rect.right) / 2,
    y: (rect.top + rect.bottom) / 2,
  });
  const outerCenter = centerOf(outerRect);
  const innerCenter = centerOf(innerRect);

  return {
    vertical: Math.abs(outerCenter.y - innerCenter.y),
    horizontal: Math.abs(outerCenter.x - innerCenter.x),
  };
};

export const expectCentered = async (outer: Locator, inner: Locator): Promise<void> => {
  await expect.poll(async () => (await getCenterOffset(outer, inner)).vertical)
    .toBeLessThanOrEqual(0.5);
  await expect.poll(async () => (await getCenterOffset(outer, inner)).horizontal)
    .toBeLessThanOrEqual(0.5);
};
