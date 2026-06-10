import $ from '@js/core/renderer';
import { value as viewPort } from '@js/core/utils/view_port';
import type { Properties as LoadPanelProperties } from '@js/ui/load_panel';
import LoadPanel from '@js/ui/load_panel';

type LoadPanelInstance = InstanceType<typeof LoadPanel>;

let loading: LoadPanelInstance | null = null;

const createLoadPanel = (options?: LoadPanelProperties): LoadPanelInstance => {
  const $container = $('<div>').appendTo(options?.container ?? viewPort());
  return new LoadPanel($container.get(0), options);
};

const removeLoadPanel = (): void => {
  if (!loading) {
    return;
  }

  loading.$element().remove();
  loading = null;
};

export function show(options?: LoadPanelProperties): Promise<boolean> {
  removeLoadPanel();
  loading = createLoadPanel(options);
  return loading.show();
}

export function hide(): Promise<boolean | undefined> {
  if (!loading) {
    return Promise.resolve(undefined);
  }

  const instance = loading;
  return instance.hide().then((result) => {
    if (loading === instance) {
      removeLoadPanel();
    }
    return result;
  });
}
