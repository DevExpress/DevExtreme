/**
 * Mutable facade for format_helper.
 *
 * Tests stub `formatHelper.format`; this keeps a single shared object across
 * import-map and artifact-relative URLs (including cache-buster differences).
 */
import original from '../../../artifacts/transpiled-esm-npm/esm/format_helper.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableFormatHelper';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = original);

export default api;
