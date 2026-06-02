/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';

export const GRID_SELECTOR = '#container';

export const AI_INTEGRATION_PAGE = url(__dirname, '../../../container-ai-integration.html');

export const getRequestColumnNames = ClientFunction(
  (index: number) => (window as any).__aiRequests[index].data.context.columns
    .map((c: any) => c.dataField),
);

export const formatMessage = ClientFunction(
  (key: string) => (window as any).DevExpress.localization.formatMessage(key),
);
