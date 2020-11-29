import { fileSaver } from './exporter/file_saver';
import { ///#DEBUG
    __internals,
    ///#ENDDEBUG
    ExcelCreator,
    getData as getExcelData
} from './exporter/excel_creator';
import { imageCreator, testFormats, getData as getImageData, asyncEach } from './exporter/image_creator';
import { svgCreator, getData as getSvgData } from './exporter/svg_creator';
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

export {
    _export as export,
    fileSaver
};

export const excel = {
    ///#DEBUG
    __internals: __internals,
    ///#ENDDEBUG
    creator: ExcelCreator,
    getData: getExcelData,
    formatConverter: formatConverter
};

export const image = {
    ///#DEBUG
    asyncEach,
    ///#ENDDEBUG
    creator: imageCreator,
    getData: getImageData,
    testFormats: testFormats
};

export const pdf = {
    getData: getData
};

export const svg = {
    creator: svgCreator,
    getData: getSvgData
};
