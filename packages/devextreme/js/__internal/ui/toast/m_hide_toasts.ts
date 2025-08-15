import $ from '@js/core/renderer';
import type Toast from '@ts/ui/toast/m_toast';
import { TOAST_CLASS } from '@ts/ui/toast/m_toast';

function hideAllToasts(container: Element): void {
  const toasts = $(`.${TOAST_CLASS}`).toArray();

  if (!arguments.length) {
    toasts.forEach((toast) => {
      // @ts-expect-error does not exist on type 'dxElementWrapper'
      $(toast).dxToast('hide');
    });

    return;
  }

  const containerElement = $(container).get(0);

  toasts
    .map((toast): Toast => {
      // @ts-expect-error does not exist on type 'dxElementWrapper'
      const instance = $(toast).dxToast('instance');

      return instance as Toast;
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

export default hideAllToasts;
