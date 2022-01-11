/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line import/no-extraneous-dependencies
import $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import CustomStore from '../../../js/data/custom_store';

export function loadByFetch(url: string): CustomStore {
  return new CustomStore({
    load: () => fetch(url).then((response) => response.json()),
  });
}

export function loadByFetchWithModification(url: string): CustomStore {
  return new CustomStore({
    load: () => fetch(url)
      .then((response) => response.json())
      .then((data) => ({
        data: data.data,
        totalCount: data.totalCount,
        summary: data.summary,
        groupCount: data.groupCount,
      })),
  });
}

export function loadByAjax(url: string, data: string): CustomStore {
  return new CustomStore({
    load: (): JQueryXHR => $.ajax({
      url, cache: false, dataType: 'json', data,
    }),
  });
}

export function loadByHttpClientAngular(http: HttpClient, url: string): CustomStore {
  return new CustomStore({
    load: () => http.get(url).toPromise(),
  });
}
