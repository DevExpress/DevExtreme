/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { getWindow } from '../../../../js/core/utils/window';

export default function getComponentOptions(): Promise<any> {
  const window = getWindow() as any;
  const count = 5;

  return Promise.race(new Array(count)
    .fill(null)
    .map((_, index) => new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (window.componentOptions) {
          resolve(window.componentOptions);
        }
        if (index === count - 1) {
          reject();
        }
      }, 200 * index);
    })));
}
