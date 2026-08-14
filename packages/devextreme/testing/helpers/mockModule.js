/* eslint-disable no-undef */

/**
 * Module replacement helper — not supported under native ESM
 * (no module registry). Mutate a mutable import-map facade instead
 * (see trackerMock.js / esm-shims/viz_chart_tracker.js).
 */
exports.mock = function mock() {
    throw new Error(
        'mockModule.mock is not supported under native ESM; '
        + 'mutate the target module\'s mutable facade (default export) instead',
    );
};
