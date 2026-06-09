import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { value as viewPort } from '@js/core/utils/view_port';
import type { Properties } from '@js/ui/tooltip';
import Tooltip from '@js/ui/tooltip';

type CreateTooltipConfig = Properties & {
  content?: string;
};

let tooltip: Tooltip | null = null;
let clean: (() => void) | null = null;

const createTooltip = (configuration: CreateTooltipConfig): void => {
  const options = {
    position: 'top',
    ...configuration,
  };

  const { content } = options;

  delete options.content;

  let $tooltip: dxElementWrapper | null = $('<div>')
    .html(content)
    .appendTo(viewPort());

  tooltip = new Tooltip($tooltip?.get(0), options as Properties);

  clean = (): void => {
    $tooltip?.remove();
    $tooltip = null;
    tooltip = null;
  };
};

const removeTooltip = (): void => {
  if (!tooltip) {
    return;
  }

  clean?.();
};

export function show(options: CreateTooltipConfig): Promise<boolean> {
  removeTooltip();
  createTooltip(options);

  if (!tooltip) {
    return Deferred<boolean>()
      .resolve(false)
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
