import * as clientExporter from './__internal/exporter/exporter';

// Re-exported through local bindings on purpose: `export { … } from './…'` compiles to
// getter-only, non-configurable properties, while tests stub these members
// (see testing/tests/DevExpress.viz.core/export.tests.js).
const _export = clientExporter.export;

export const fileSaver = clientExporter.fileSaver;
export const image = clientExporter.image;
export const pdf = clientExporter.pdf;
export const svg = clientExporter.svg;

export { _export as export };
