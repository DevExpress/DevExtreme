import type { Page, Locator } from '@playwright/test';

export async function getLocatorScrollClip(
  locator: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: Math.max(el.scrollWidth, el.offsetWidth),
      height: Math.max(el.scrollHeight, el.offsetHeight),
    };
  });
}

export async function getVisualClip(
  page: Page,
  selector: string,
): Promise<{ x: number; y: number; width: number; height: number } | null> {
  return page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return null;
    const rootRect = root.getBoundingClientRect();
    const SHADOW_THRESHOLD = 4;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const isClippedByAncestor = (el: Element): boolean => {
      let ancestor = el.parentElement;
      while (ancestor && ancestor !== root) {
        const style = getComputedStyle(ancestor);
        if (style.overflow === 'hidden' || style.overflowX === 'hidden') return true;
        ancestor = ancestor.parentElement;
      }
      return false;
    };

    const all = [root as Element, ...Array.from(root.querySelectorAll('*'))];
    let maxX = rootRect.right;
    let maxY = rootRect.bottom;
    let hasOverflowX = false;
    let hasOverflowY = false;

    all.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      const overflowX = r.right - rootRect.right;
      const overflowY = r.bottom - rootRect.bottom;

      if (overflowX > 0 && overflowX <= SHADOW_THRESHOLD) maxX = Math.max(maxX, r.right);
      if (overflowX > SHADOW_THRESHOLD && r.right <= vw && !isClippedByAncestor(el)) {
        maxX = Math.max(maxX, r.right);
        hasOverflowX = true;
      }
      if (overflowY > 0 && r.bottom <= vh && r.left >= rootRect.left - 1 && !isClippedByAncestor(el)) {
        maxY = Math.max(maxY, r.bottom);
        hasOverflowY = true;
      }
    });

    const minX = Math.max(0, rootRect.left);
    const minY = Math.max(0, rootRect.top);

    const clampedMaxY = Math.min(maxY, vh);

    return {
      x: Math.floor(minX),
      y: Math.floor(minY),
      width: Math.round(maxX - minX),
      height: Math.round(clampedMaxY - minY),
    };
  }, selector);
}
