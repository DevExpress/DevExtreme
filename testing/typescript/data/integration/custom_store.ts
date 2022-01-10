import $ from 'jquery';
import CustomStore from '../../../../js/data/custom_store';
import '../../../../js/integration/jquery';

export class CustomStoreMaker {
  store: CustomStore;

  constructor() {
    this.store = new CustomStore();
  }

  loadByAjax(url: string, data: string): void {
    this.store = new CustomStore({
      load: (): JQueryXHR => $.ajax({
        url, cache: false, dataType: 'json', data,
      }),
      loadMode: 'raw',
    });
  }
}
