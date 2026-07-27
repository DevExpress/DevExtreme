/**
 * CJS-interop shim: many QUnit suites do `import localization from 'localization'`.
 * The ESM build only has named exports — re-export them and provide a default namespace.
 */
import * as localization from '../../../artifacts/transpiled-esm-npm/esm/localization.js';

export const {
    formatDate,
    formatMessage,
    formatNumber,
    loadMessages,
    locale,
    parseDate,
    parseNumber,
} = localization;

export default localization;
