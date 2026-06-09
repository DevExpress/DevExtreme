import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { value as viewPort } from '@js/core/utils/view_port';
import type { Properties } from '@js/ui/tooltip';
import Tooltip from '@js/ui/tooltip';

type CreateTooltipConfig = Properties & {
  content?: string;
};

let tooltip: Tooltip | null = null;
let removeTooltipElement: (() => void) | null = null;

const createTooltip = (configuration: CreateTooltipConfig): void => {
  // Note: The configuration object is mutated within the extend. This is expected behavior.
  // eslint-disable-next-line no-param-reassign
  configuration = extend({ position: 'top' }, configuration);
  const { content } = configuration;

  delete configuration.content;

  let $tooltip: dxElementWrapper | null = $('<div>')
    .html(content)
    .appendTo(viewPort());

  removeTooltipElement = (): void => {
    $tooltip?.remove();
    $tooltip = null;
  };

  tooltip = new Tooltip($tooltip.get(0), configuration as Properties);
};

const removeTooltip = (): void => {
  if (!tooltip) {
    return;
  }

  removeTooltipElement?.();
};

export function show(options: CreateTooltipConfig): Promise<boolean> {
  removeTooltip();
  createTooltip(options);

  if (!tooltip) {
    return Deferred<boolean>()
      .resolve()
      .promise();
  }

  return tooltip.show();
}

export function hide(): Promise<boolean> {
  if (!tooltip) {
    return Deferred<boolean>()
      .resolve(false)
      .promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return tooltip
    .hide()
    // @ts-expect-error Deferred.promise() typings
    .done(removeTooltip)
    .promise();
}
