// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface JQueryXHR { }
interface Ajax {
  inject(Object): void;
  resetInjection(): void;
  sendRequest(any): Promise<any>;
}

declare const ajax: Ajax;
export default ajax;
