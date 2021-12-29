import { DxPromise } from './deferred';
import { DependencyInjector } from './dependency_injector';

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface JQueryXHR { }

interface Ajax extends DependencyInjector {
  sendRequest(any): DxPromise<any> | JQueryXHR;
}

declare const ajax: Ajax;
export default ajax;
