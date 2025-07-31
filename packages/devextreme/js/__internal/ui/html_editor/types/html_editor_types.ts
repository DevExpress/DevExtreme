/**
 * TypeScript helper types for HTML Editor modules
 */

import Quill from 'devextreme-quill';

import type EmptyModule from '../modules/empty';
import type { BaseQuillModuleInstance, QuillInstance } from './quill';

export interface BaseModuleOptions {
  editorInstance: {
    _saveValueChangeEvent: (event: unknown) => void;
    addCleanCallback: (callback: () => void) => void;
    NAME: string;
    _getQuillContainer: () => HTMLElement;
    _createComponent: (element: unknown, component: unknown, options: unknown) => unknown;
  };
}

export type EmptyModuleConstructor = new () => EmptyModule;

export interface HTMLEditorModuleInstance extends BaseQuillModuleInstance {
  editorInstance: BaseModuleOptions['editorInstance'];
  saveValueChangeEvent: (event: unknown) => void;
  addCleanCallback: (callback: () => void) => void;
  handleOptionChangeValue: (changes: unknown) => void;
}

export type ConditionalModule<T extends HTMLEditorModuleInstance = HTMLEditorModuleInstance> =
  | EmptyModuleConstructor
  | (new (quill: QuillInstance, options: BaseModuleOptions) => T);

export type HTMLEditorModuleConstructor = new (quill: QuillInstance, options: BaseModuleOptions)
=> HTMLEditorModuleInstance;

export function isUsableModule<T extends HTMLEditorModuleInstance>(
  ModuleClass: ConditionalModule<T>,
): ModuleClass is HTMLEditorModuleConstructor
& (new (quill: QuillInstance, options: BaseModuleOptions) => T) {
  return !!Quill;
}
