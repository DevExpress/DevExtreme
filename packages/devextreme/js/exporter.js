import * as clientExporter from './__internal/exporter/exporter';

let _export = clientExporter.export;

export const fileSaver = clientExporter.fileSaver;
export const image = clientExporter.image;
export const pdf = clientExporter.pdf;
export const svg = clientExporter.svg;

/// #DEBUG
export function DEBUG_set_export(value) {
    _export = value;
}
/// #ENDDEBUG

export { _export as export };
