/**
 * Mutable facade for LDML date.parser — QUnit spies `getRegExpInfo`
 * (datebox.mask.tests.js). Default export is a plain api object (not the
 * frozen Module namespace from `import * as`).
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/core/localization/ldml/date.parser.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(original, '__dxMutableDateParser');

export const isPossibleForParsingFormat = wrapCtor(api, 'isPossibleForParsingFormat');
export const getPatternSetters = wrapCtor(api, 'getPatternSetters');
export const getParser = wrapCtor(api, 'getParser');
export const getRegExpInfo = wrapCtor(api, 'getRegExpInfo');

export default api;
