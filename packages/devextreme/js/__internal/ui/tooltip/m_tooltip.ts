import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { value as viewPort } from '@js/core/utils/view_port';
import type { Properties } from '@js/ui/tooltip';
import Tooltip from '@js/ui/tooltip';

type CreateTooltipConfig = Properties & {
  content?: string;
};

let tooltip: Tooltip | null = null;
let removeTooltipElement: (() => void) | null = null;

const createTooltip = (configuration: CreateTooltipConfig): void => {
  const { content } = configuration;

  const options = {
    position: 'top',
    ...configuration,
  };

  delete options.content;

  const $tooltip = $('<div>')
    .html(content)
    .appendTo(viewPort());

  removeTooltipElement = (): void => {
    $tooltip?.remove();
  };

  tooltip = new Tooltip($tooltip.get(0), options as Properties);
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
