/**
 * Mutable facade for the package-root exporter module.
 * Tests stub clientExporter.export on the default api; production named
 * export keeps delegating through wrapCtor to the current api.export.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/exporter.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableExporter');

const exportFn = wrapCtor(api, 'export');

export { exportFn as export };
export const fileSaver = api.fileSaver;
export const image = api.image;
export const pdf = api.pdf;
export const svg = api.svg;
export default api;
