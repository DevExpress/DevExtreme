/**
 * CJS-interop shim: QUnit suites do `import dataUtils from 'core/element_data'`.
 * The ESM build only has named exports — re-export them and provide a default namespace.
 */
import * as elementData from '../../../artifacts/transpiled-esm-npm/esm/core/element_data.js';

export const {
    strategyChanging,
    getDataStrategy,
    setDataStrategy,
    data,
    beforeCleanData,
    afterCleanData,
    cleanData,
    removeData,
    cleanDataRecursive,
} = elementData;

export default elementData;
