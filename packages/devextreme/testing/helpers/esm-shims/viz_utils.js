/**
 * Mutable facade for viz/core/utils — QUnit stubs replace api.getNextDefsSvgId
 * (and other helpers) on the default export object.
 *
 * Named exports always forward to the current api.* implementation so
 * library `import { getNextDefsSvgId }` keeps working after stubs.
 *
 * api is stored on globalThis so import-map and static-redirect URLs
 * (cache-buster differences) still share one stubbable object.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/core/utils.js?dx-original=1';

const GLOBAL_KEY = '__dxMutableVizUtils';

const api = globalThis[GLOBAL_KEY] ?? (globalThis[GLOBAL_KEY] = { ...original });

function wrapExport(name) {
    const ExportWrapper = function(...args) {
        const Impl = api[name];
        if(new.target) {
            return new Impl(...args);
        }
        return Impl.apply(this, args);
    };
    Object.defineProperty(ExportWrapper, 'name', { value: name, configurable: true });
    return ExportWrapper;
}

export const PANE_PADDING = original.PANE_PADDING;
export const getLog = wrapExport('getLog');
export const getAdjustedLog10 = wrapExport('getAdjustedLog10');
export const raiseTo = wrapExport('raiseTo');
export const normalizeAngle = wrapExport('normalizeAngle');
export const convertAngleToRendererSpace = wrapExport('convertAngleToRendererSpace');
export const degreesToRadians = wrapExport('degreesToRadians');
export const getCosAndSin = wrapExport('getCosAndSin');
export const getDistance = wrapExport('getDistance');
export const getDecimalOrder = wrapExport('getDecimalOrder');
export const getAppropriateFormat = wrapExport('getAppropriateFormat');
export const roundValue = wrapExport('roundValue');
export const getPower = wrapExport('getPower');
export const map = wrapExport('map');
export const normalizeEnum = wrapExport('normalizeEnum');
export const setCanvasValues = wrapExport('setCanvasValues');
export const normalizeBBox = wrapExport('normalizeBBox');
export const rotateBBox = wrapExport('rotateBBox');
export const decreaseGaps = wrapExport('decreaseGaps');
export const parseScalar = wrapExport('parseScalar');
export const enumParser = wrapExport('enumParser');
export const patchFontOptions = wrapExport('patchFontOptions');
export const convertPolarToXY = wrapExport('convertPolarToXY');
export const convertXYToPolar = wrapExport('convertXYToPolar');
export const processSeriesTemplate = wrapExport('processSeriesTemplate');
export const getCategoriesInfo = wrapExport('getCategoriesInfo');
export const isRelativeHeightPane = wrapExport('isRelativeHeightPane');
export const normalizePanesHeight = wrapExport('normalizePanesHeight');
export const updatePanesCanvases = wrapExport('updatePanesCanvases');
export const unique = wrapExport('unique');
export const getVerticallyShiftedAngularCoords = wrapExport('getVerticallyShiftedAngularCoords');
export const mergeMarginOptions = wrapExport('mergeMarginOptions');
export const getVizRangeObject = wrapExport('getVizRangeObject');
export const normalizeArcParams = wrapExport('normalizeArcParams');
export const convertVisualRangeObject = wrapExport('convertVisualRangeObject');
export const getAddFunction = wrapExport('getAddFunction');
export const adjustVisualRange = wrapExport('adjustVisualRange');
export const getLogExt = wrapExport('getLogExt');
export const raiseToExt = wrapExport('raiseToExt');
export const rangesAreEqual = wrapExport('rangesAreEqual');
export const valueOf = wrapExport('valueOf');
export const pointInCanvas = wrapExport('pointInCanvas');
export const getNextDefsSvgId = wrapExport('getNextDefsSvgId');
export const extractColor = wrapExport('extractColor');

export default api;
