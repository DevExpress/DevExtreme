import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/viz/vector_map/map_layer.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableVizMapLayer');

export const getMaxBound = wrapCtor(api, 'getMaxBound');
export const MapLayerCollection = wrapCtor(api, 'MapLayerCollection');
export const _TESTS_MapLayer = wrapCtor(api, '_TESTS_MapLayer');
export const _TESTS_stub_MapLayer = wrapCtor(api, '_TESTS_stub_MapLayer');
export const _TESTS_selectStrategy = wrapCtor(api, '_TESTS_selectStrategy');
export const _TESTS_stub_selectStrategy = wrapCtor(api, '_TESTS_stub_selectStrategy');
export const _TESTS_MapLayerElement = wrapCtor(api, '_TESTS_MapLayerElement');
export const _TESTS_stub_MapLayerElement = wrapCtor(api, '_TESTS_stub_MapLayerElement');
export const _TESTS_createProxy = wrapCtor(api, '_TESTS_createProxy');
export const _TESTS_stub_performGrouping = wrapCtor(api, '_TESTS_stub_performGrouping');
export const _TESTS_performGrouping = wrapCtor(api, '_TESTS_performGrouping');
export const _TESTS_stub_groupByColor = wrapCtor(api, '_TESTS_stub_groupByColor');
export const _TESTS_groupByColor = wrapCtor(api, '_TESTS_groupByColor');
export const _TESTS_stub_groupBySize = wrapCtor(api, '_TESTS_stub_groupBySize');
export const _TESTS_groupBySize = wrapCtor(api, '_TESTS_groupBySize');
export const _TESTS_findGroupingIndex = wrapCtor(api, '_TESTS_findGroupingIndex');
export default api;
