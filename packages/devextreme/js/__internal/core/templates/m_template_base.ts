import { triggerShownEvent } from '../../events/visibility_change';
import domAdapter from '../dom_adapter';
import errors from '../errors';
import $ from '../renderer';
import Callbacks from '../utils/callbacks';
import { contains } from '../utils/dom';

export const renderedCallbacks = Callbacks({ syncStrategy: true });

export class TemplateBase {
  render(options) {
    options = options || {};

    const { onRendered } = options;
    delete options.onRendered;

    let $result;
    if (options.renovated && options.transclude && this._element) {
      $result = $('<div>').append(this._element).contents();
    } else {
      $result = this._renderCore(options);
    }

    this._ensureResultInContainer($result, options.container);
    renderedCallbacks.fire($result, options.container);

    onRendered && onRendered();
    return $result;
  }

  _ensureResultInContainer($result, container) {
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

  _renderCore() {
    throw errors.Error('E0001');
  }
}
