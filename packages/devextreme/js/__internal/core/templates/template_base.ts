import { triggerShownEvent } from '@js/common/core/events/visibility_change';
import domAdapter from '@js/core/dom_adapter';
import errors from '@js/core/errors';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import Callbacks from '@js/core/utils/callbacks';
import { contains } from '@js/core/utils/dom';

export type TemplateElement = Element | dxElementWrapper;

export interface TemplateRenderOptions {
  container?: TemplateElement;
  model?: unknown;
  index?: number;
  transclude?: boolean;
  renovated?: boolean;
  onRendered?: () => void;
}

type RenderedCallbackArgs = [dxElementWrapper, TemplateElement | undefined];

export const renderedCallbacks = Callbacks<RenderedCallbackArgs>({ syncStrategy: true });

export class TemplateBase {
  _element?: TemplateElement;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(options: unknown): any {
    const renderOptions: TemplateRenderOptions = options || {};

    const { onRendered } = renderOptions;
    delete renderOptions.onRendered;

    const $result = renderOptions.renovated && renderOptions.transclude && this._element
      ? $('<div>').append(this._element).contents()
      : this._renderCore(renderOptions);

    this._ensureResultInContainer($result, renderOptions.container);
    renderedCallbacks.fire($result, renderOptions.container);

    if (onRendered) {
      onRendered();
    }
    return $result;
  }

  _ensureResultInContainer($result: dxElementWrapper, container?: TemplateElement): void {
    if (!container) {
      return;
    }

    const $container = $(container);
    const resultInContainer = contains($container.get(0), $result.get(0));
    $container.append($result);
    if (resultInContainer) {
      return;
    }

    const resultInBody = contains(domAdapter.getBody(), $container.get(0));
    if (!resultInBody) {
      return;
    }

    triggerShownEvent($result);
  }

  _renderCore(options: TemplateRenderOptions): dxElementWrapper;
  _renderCore(): dxElementWrapper {
    throw errors.Error('E0001');
  }
}
