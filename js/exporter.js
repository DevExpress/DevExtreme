import { fileSaver } from './exporter/file_saver';
import excelCreator from './exporter/excel_creator';
import imageCreator from './exporter/image_creator';
import svgCreator from './exporter/svg_creator';
import { isFunction as _isFunction } from './core/utils/type';
import { Deferred } from './core/utils/deferred';
import formatConverter from './exporter/excel_format_converter';
import { getData } from './exporter/pdf_creator';

function _export(data, options, getData) {
    if(!data) {
        return new Deferred().resolve();
    }

    // TODO: Can the following actions be not defined? (since they are provided by a widget not by a user)
    const exportingAction = options.exportingAction;
    const exportedAction = options.exportedAction;
    const fileSavingAction = options.fileSavingAction;
    const eventArgs = {
        fileName: options.fileName,
        format: options.format,
        cancel: false
    };

    _isFunction(exportingAction) && exportingAction(eventArgs);

    if(!eventArgs.cancel) {
        return getData(data, options).then(blob => {
            _isFunction(exportedAction) && exportedAction();

            if(_isFunction(fileSavingAction)) {
                eventArgs.data = blob;
                fileSavingAction(eventArgs);
            }

            if(!eventArgs.cancel) {
                fileSaver.saveAs(eventArgs.fileName, options.format, blob, options.proxyUrl, options.forceProxy);
            }
        });
    }

    return new Deferred().resolve();
}

export { _export as export };

export { fileSaver };

export const excel = {
    ///#DEBUG
    __internals: excelCreator.__internals,
    ///#ENDDEBUG
    creator: excelCreator.ExcelCreator,
    getData: excelCreator.getData,
    formatConverter: formatConverter
};

export const image = {
    creator: imageCreator.imageCreator,
    getData: imageCreator.getData,
    testFormats: imageCreator.testFormats
};

export const pdf = {
    getData: getData
};

export const svg = {
    creator: svgCreator.svgCreator,
    getData: svgCreator.getData
};
