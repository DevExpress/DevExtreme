import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { value as viewPort } from '@js/core/utils/view_port';
import LoadPanel from '@js/ui/load_panel';

let loading: any = null;

const createLoadPanel = function (options) {
  return new LoadPanel(
    ($('<div>') as any)
      .appendTo(options && options.container || viewPort()),
    options,
  );
};

const removeLoadPanel = function () {
  if (!loading) {
    return;
  }

  loading.$element().remove();
  loading = null;
};

export function show(options) {
  removeLoadPanel();
  loading = createLoadPanel(options);
  return loading.show();
}

export function hide() {
  // hot fix for case without viewport
  if (!loading) {
    // @ts-expect-error
    return new Deferred().resolve();
  }
  return loading
    .hide()
    .done(removeLoadPanel)
    .promise();
}
