import { isDefined, isObject } from '@js/core/utils/type';
import type { ValueChangedEvent } from '@js/ui/html_editor';
import Quill from 'devextreme-quill';

import type HtmlEditor from '../html_editor';
import type { BaseQuillModuleConstructor, QuillInstance } from '../types/quill';
import EmptyModule from './empty';

/** What `HtmlEditor._getBaseModuleConfig()` passes to every module */
export interface BaseModuleOptions {
  editorInstance: HtmlEditor;
}

export interface BaseHtmlEditorModule {
  quill: QuillInstance;
  options: BaseModuleOptions;
  editorInstance: HtmlEditor;
  saveValueChangeEvent: <TEvent = ValueChangedEvent>(event: TEvent | undefined) => void;
  addCleanCallback: (callback: () => unknown) => void;
  handleOptionChangeValue: (changes: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  option?(name: string, value: unknown): void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  clean?(): void;
}

export type BaseModuleClass = new (
  quill: QuillInstance,
  options: BaseModuleOptions,
) => BaseHtmlEditorModule;

// @ts-expect-error the no-Quill stand-in has no module members; subclasses only need a constructor
let BaseModule: BaseModuleClass = EmptyModule; // eslint-disable-line import/no-mutable-exports

if (Quill) {
  const BaseQuillModule: BaseQuillModuleConstructor = Quill.import('core/module');

  BaseModule = class BaseHtmlEditorModule extends BaseQuillModule {
    declare options: BaseModuleOptions;

    declare editorInstance: HtmlEditor;

    constructor(quill: QuillInstance, options: BaseModuleOptions) {
      super(quill, options);

      this.editorInstance = options.editorInstance;
    }

    saveValueChangeEvent<TEvent = ValueChangedEvent>(event: TEvent | undefined): void {
      this.editorInstance._saveValueChangeEvent(event);
    }

    addCleanCallback(callback: () => unknown): void {
      this.editorInstance.addCleanCallback(callback);
    }

    handleOptionChangeValue(changes: unknown): void {
      if (isObject(changes)) {
        Object.entries(changes).forEach(([name, value]) => this.option?.(name, value));
      } else if (!isDefined(changes)) {
        this.clean?.();
      }
    }
  };
}

export default BaseModule;
