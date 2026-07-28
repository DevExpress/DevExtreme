/* eslint-disable no-undef */

/**
 * Legacy SystemJS module replacement helper.
 *
 * Native ESM has no System.registry — use a mutable import-map facade and
 * assign onto its default export instead (see trackerMock.js /
 * esm-shims/viz_chart_tracker.js).
 */
exports.mock = function mock() {
    throw new Error(
        'mockModule.mock is not supported under native ESM; '
        + 'mutate the target module\'s mutable facade (default export) instead',
    );
};
