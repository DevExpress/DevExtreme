import { getWindow } from '@js/core/utils/window';
import { injector } from '@ts/core/utils/dependency_injector';

const window = getWindow();

const nativeXMLHttpRequest = {
  getXhr() {
    // @ts-expect-error no XMLHttpRequest on Window
    return new window.XMLHttpRequest();
  },
};

const httpRequest = injector(nativeXMLHttpRequest);

export { httpRequest };
