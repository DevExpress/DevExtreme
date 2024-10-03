import injector from '@js/core/utils/dependency_injector';
import { getWindow } from '@js/core/utils/window';

const window = getWindow();

const nativeXMLHttpRequest = {
  getXhr() {
    return new window.XMLHttpRequest();
  },
};

const httpRequest = injector(nativeXMLHttpRequest);

export { httpRequest };
