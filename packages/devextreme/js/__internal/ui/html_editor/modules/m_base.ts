import { isDefined, isObject } from '@js/core/utils/type';
import Quill from 'devextreme-quill';

import type {
  BaseModuleOptions,
  ConditionalModule,
  HTMLEditorModuleInstance,
} from '../types/html_editor_types';
import type { BaseQuillModuleConstructor, QuillInstance } from '../types/quill';
import EmptyModule from './empty';

const BaseModule = ((): ConditionalModule => {
  if (!Quill) return EmptyModule;

  const BaseQuillModule = Quill.import('core/module') as BaseQuillModuleConstructor;

  return class BaseHtmlEditorModule extends BaseQuillModule
    implements HTMLEditorModuleInstance {
    editorInstance: BaseModuleOptions['editorInstance'];

    constructor(quill: QuillInstance, options: BaseModuleOptions) {
      super(quill, options);
      this.editorInstance = options.editorInstance;
    }

    saveValueChangeEvent(event: unknown): void {
      this.editorInstance._saveValueChangeEvent(event);
    }

    addCleanCallback(callback: () => void): void {
      this.editorInstance.addCleanCallback(callback);
    }

    handleOptionChangeValue(changes: unknown): void {
      if (isObject(changes)) {
        Object.entries(changes).forEach(([name, value]) => {
          this.option?.(name, value as unknown);
        });
      } else if (!isDefined(changes)) {
        this.clean?.();
      }
    }
  };
})();

export default BaseModule;
