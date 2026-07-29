/**
 * Mutable facade for viz/range_selector/series_data_source.
 * Public entry is `export default` of `import * as` (frozen Module).
 * RangeSelector QUnit: `sinon.spy(seriesDataSourceModule, 'SeriesDataSource')`.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/range_selector/series_data_source.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizRsSeriesDataSource');

export const SeriesDataSource = wrapCtor(api, 'SeriesDataSource');
export default api;
