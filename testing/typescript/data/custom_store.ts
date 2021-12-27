import $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import CustomStore from '../../../js/data/custom_store';

export class CustomStoreMaker {
  store: CustomStore;

  constructor() {
    this.store = new CustomStore();
  }

  loadByFetch(url: string): void {
    this.store = new CustomStore({
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      load: () => fetch(url).then((response) => response.json()),
      loadMode: 'raw',
    });
  }

  loadByFetchWithModification(url: string): void {
    this.store = new CustomStore({
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      load: () => fetch(url)
        .then((response) => response.json())
        .then((data) => ({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          data: data.data,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          totalCount: data.totalCount,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          summary: data.summary,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          groupCount: data.groupCount,
        })),
      loadMode: 'raw',
    });
  }

  loadByAjax(url: string, data: string): void {
    this.store = new CustomStore({
      load: (): JQueryXHR => $.ajax({
        url, cache: false, dataType: 'json', data,
      }),
      loadMode: 'raw',
    });
  }

  loadByHttpClientAngular(http: HttpClient, jsonUrl: string): void {
    this.store = new CustomStore({
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      load: () => http.get(jsonUrl)
        .toPromise()
        .catch((error) => { throw error; }),
      loadMode: 'raw',
    });
  }
}
