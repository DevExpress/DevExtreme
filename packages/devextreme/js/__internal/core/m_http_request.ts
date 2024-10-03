import injector from './utils/dependency_injector';
import { getWindow } from './utils/window';

const window = getWindow();

const nativeXMLHttpRequest = {
  getXhr() {
    return new window.XMLHttpRequest();
  },
};

const httpRequest = injector(nativeXMLHttpRequest);

export { httpRequest };
