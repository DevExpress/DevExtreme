import type { Page, Locator } from '@playwright/test';

export async function getLocatorScrollClip(
  locator: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: el.scrollWidth,
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
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    function getClipRect(el: Element): DOMRect | null {
      let p = el.parentElement;
      while (p && p !== document.documentElement) {
        const s = window.getComputedStyle(p);
        const ov = s.overflow + s.overflowX + s.overflowY;
        if (ov.includes('hidden') || ov.includes('clip')) {
          return p.getBoundingClientRect();
        }
        p = p.parentElement;
      }
      return null;
    }

    const all = [root as Element, ...Array.from(root.querySelectorAll('*'))];
    let minX = Math.max(0, rootRect.left);
    let minY = Math.max(0, rootRect.top);
    let maxX = Math.min(vw, rootRect.right);
    let maxY = Math.min(vh, rootRect.bottom);

    all.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      const clip = getClipRect(el);
      const visL = clip ? Math.max(r.left, clip.left) : r.left;
      const visT = clip ? Math.max(r.top, clip.top) : r.top;
      const visR = clip ? Math.min(r.right, clip.right) : r.right;
      const visB = clip ? Math.min(r.bottom, clip.bottom) : r.bottom;
      if (visR <= visL || visB <= visT) return;
      maxX = Math.max(maxX, Math.min(vw, visR));
      maxY = Math.max(maxY, Math.min(vh, visB));
    });

    const overflowX = maxX - rootRect.right;
    const overflowY = maxY - rootRect.bottom;
    const shadowPx = (overflowX > 0 && overflowX <= 1.5) || (overflowY > 0 && overflowY <= 1.5) ? 1 : 0;

    return {
      x: Math.floor(minX),
      y: Math.floor(minY),
      width: Math.round(maxX - minX) + shadowPx,
      height: Math.round(maxY - minY) + shadowPx,
    };
  }, selector);
}
