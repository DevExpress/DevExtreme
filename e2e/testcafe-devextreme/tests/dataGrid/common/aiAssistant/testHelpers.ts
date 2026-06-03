/* eslint-disable no-underscore-dangle */
import { ClientFunction } from 'testcafe';
import type { WidgetName, WidgetOptions } from 'devextreme-testcafe-models/types';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

export const GRID_SELECTOR = '#container';

export const AI_INTEGRATION_PAGE = url(__dirname, '../../../container-ai-integration.html');

export const getRequestColumnNames = ClientFunction(
  (index: number) => (window as any).__aiRequests[index].data.context.columns
    .map((c: any) => c.dataField),
);

export const formatMessage = ClientFunction(
  (key: string) => (window as any).DevExpress.localization.formatMessage(key),
);

// `dx.ai-integration.js` is loaded by the container page; in CI the global can be defined a beat
// after navigation, so tests await this before instantiating AIIntegration.
export const aiIntegrationReady = ClientFunction(
  () => typeof (window as any).DevExpress?.aiIntegration?.AIIntegration === 'function',
);

// Waits for the AI integration global, then creates the widget. Use in `before` hooks instead of a
// bare createWidget so the AIIntegration constructor is guaranteed to exist when options are built.
export async function createWidgetWithAIIntegration<TName extends WidgetName>(
  t: TestController,
  widgetName: TName,
  options: TName extends keyof WidgetOptions ? () => WidgetOptions[TName] : () => unknown,
): Promise<void> {
  await t.expect(aiIntegrationReady()).ok();
  await createWidget(widgetName, options as never);
}
