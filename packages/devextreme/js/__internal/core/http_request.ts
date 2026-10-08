import { getWindow } from '@js/core/utils/window';
import { injector } from '@ts/core/utils/dependency_injector';

const window = getWindow();

const nativeXMLHttpRequest = {
  getXhr(): XMLHttpRequest {
    // @ts-expect-error no XMLHttpRequest on Window
    const xhr: XMLHttpRequest = new window.XMLHttpRequest();

    return xhr;
  },
};

const httpRequest = injector(nativeXMLHttpRequest);

export { httpRequest };
