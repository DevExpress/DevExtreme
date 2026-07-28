/**
 * Mutable facade for TemplateManager.
 * Default export is `{ TemplateManager }`; pieChart QUnit stubs `TemplateManager`.
 */
import * as original from '../../../artifacts/transpiled-esm-npm/esm/__internal/core/m_template_manager.js?dx-original=1';
import { createMutableApi, wrapCtor } from './mutable_facade.js';

const api = createMutableApi(
    original.default ?? { TemplateManager: original.TemplateManager },
    '__dxMutableTemplateManager',
);

export const TemplateManager = wrapCtor(api, 'TemplateManager');
export default api;
