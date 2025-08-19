import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Toast, { TOAST_CLASS } from '@ts/ui/toast/m_toast';

function hideToasts(container?: Element | dxElementWrapper): void {
  const toasts = $(`.${TOAST_CLASS}`).toArray();

  if (arguments.length === 0) {
    toasts.forEach((toast) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Toast.getInstance<Toast>(toast).hide();
    });

    return;
  }

  if (!container) {
    return;
  }

  const containerElement = $(container).get(0);

  toasts
    .map((toast): Toast => {
      const instance = Toast.getInstance<Toast>(toast);

      return instance;
    })
    .filter((instance) => {
      const { container: toastContainer } = instance.option();

      const toastContainerElement = $(toastContainer).get(0);

      return containerElement === toastContainerElement && containerElement;
    })
    .forEach((instance) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      instance.hide();
    });
}

export default hideToasts;
