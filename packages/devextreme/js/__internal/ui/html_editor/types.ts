import type { dxElementWrapper } from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import type { AICustomCommand, dxHtmlEditorVariables } from '@js/ui/html_editor';

import type {
  FormatBlotInstance,
  QuillInstance,
  QuillOptions,
  ScrollInstance,
} from './types/quill';
import type { CommandsMap } from './utils/ai';

/** A Quill-dependent export: the empty object stands in when devextreme-quill is not loaded */
export type QuillDependent<T> = T | Record<string, undefined>;

/** The class-level identity Parchment reads when a blot is registered */
export interface BlotStatics {
  blotName: string;
  tagName: string | string[];
  className?: string;
  scope: number;
}

/** A Parchment blot that carries formats, seen from inside a blot subclass */
export interface FormatBlot extends FormatBlotInstance {
  domNode: HTMLElement;
  scroll: ScrollInstance;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- class methods override it
  format(name: string, value: unknown): void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- class methods override it
  formats(): Record<string, unknown>;
}

/** devextreme-quill `blots/embed`: an EmbedBlot whose content lives in a guarded span */
export interface EmbedBlot extends FormatBlot {
  contentNode: HTMLElement;
}

/** Static side shared by the blot classes devextreme-quill exports */
export interface BlotConstructorBase<TInstance extends FormatBlot = FormatBlot>
  extends BlotStatics {
  value: (domNode: HTMLElement) => unknown;
  formats: (domNode: HTMLElement, scroll?: ScrollInstance) => unknown;
  new (scroll: ScrollInstance, node: HTMLElement): TInstance;
}

/** `Quill.import('blots/embed')` */
export interface EmbedBlotConstructor<TValue = unknown> extends BlotConstructorBase<EmbedBlot> {
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- subclasses narrow `value`
  create(value?: TValue): HTMLElement;
}

/** What `Image.formats()` reads from an `<img>`: the attributes that are present */
export interface ImageFormats {
  alt?: string;
  height?: string;
  width?: string;
}

/** `Quill.import('formats/image')` */
export interface ImageBlotConstructor<TValue = unknown> extends BlotConstructorBase {
  create: (value: TValue) => HTMLElement;
  formats: (domNode: HTMLElement) => ImageFormats;
  match: (url: string) => boolean;
  sanitize: (url: string) => string;
}

/** `Quill.import('formats/link')` */
export interface LinkBlotConstructor<TValue = unknown> extends BlotConstructorBase {
  create: (value: TValue) => HTMLElement;
  sanitize: (url: string) => string;
  PROTOCOL_WHITELIST: string[];
  SANITIZED_URL: string;
}

/** The `link` format value: the link dialog's form data, or what `ExtLink.formats()` reads */
export interface LinkData {
  href: string | null;
  text?: string;
  target?: boolean | string | null;
}

/** The `extendedImage` value: the image dialog's form data, or what `ExtImage.value()` reads */
export interface ImageAttributes {
  src?: string | null;
  alt?: string | null;
  width?: string | number | null;
  height?: string | number | null;
}

/** The `mention` value; `keyInTemplateStorage` is the editor number the mentions module sets */
export interface MentionData {
  marker?: string;
  id?: string;
  value?: string;
  keyInTemplateStorage?: number;
}

/** A mention template's key: the editor number (getMentionKeyInTemplateStorage) and the marker */
export interface MentionTemplateKey {
  editorKey: number;
  marker: string;
}

/** What a mention blot looks a template up with; both parts are missing when Quill renders it */
export interface MentionTemplateLookupKey {
  editorKey?: number;
  marker?: string;
}

/** Value of the `variable` embed */
export interface VariableData {
  value?: string;
  escapeChar: NonNullable<dxHtmlEditorVariables['escapeChar']>;
}

/** Quill's expanded configuration, as `Quill` passes it to the theme constructor */
export interface ThemeOptions
  extends Omit<QuillOptions, 'bounds' | 'modules' | 'scrollingContainer' | 'theme'> {
  bounds: HTMLElement | null;
  container: HTMLElement;
  modules: Record<string, unknown>;
  scrollingContainer: HTMLElement | null;
  theme: ThemeConstructor;
}

/** A `Quill.import('core/theme')` instance */
export interface ThemeInstance {
  quill: QuillInstance;
  options: ThemeOptions;
  modules: Record<string, unknown>;
  init: () => void;
  addModule: (name: string) => unknown;
}

/** `Quill.import('core/theme')` */
export interface ThemeConstructor {
  DEFAULTS: { modules: Record<string, unknown> };
  themes: Record<string, ThemeConstructor>;
  new (quill: QuillInstance, options: ThemeOptions): ThemeInstance;
}

/** What a dialog's show() returns: the Deferred's promise object (done/fail/always) */
export interface DialogPromise<TResult = unknown, TExtra = undefined> {
  done: (callback: (result: TResult, extra: TExtra) => void) => DialogPromise<TResult, TExtra>;
  fail: (callback: () => void) => DialogPromise<TResult, TExtra>;
  always: (callback: () => void) => DialogPromise<TResult, TExtra>;
}

/** What a toolbar button or a context menu item passes to a format handler. */
export interface FormatHandlerArgs {
  event?: DxEvent;
}

export type FormatHandler = (args: FormatHandlerArgs) => void;

/** A click on an AI toolbar menu item (modules/m_toolbar.ts). */
export interface AITextTransformOptions {
  command: string;
  commandsMap: CommandsMap;
  parentCommand?: string;
  prompt?: AICustomCommand['prompt'];
}

export interface FormatHandlers {
  clear: FormatHandler;
  link: () => void;
  image: () => void;
  color: () => void;
  background: () => void;
  orderedList: FormatHandler;
  bulletList: FormatHandler;
  alignLeft: FormatHandler;
  alignCenter: FormatHandler;
  alignRight: FormatHandler;
  alignJustify: FormatHandler;
  codeBlock: FormatHandler;
  undo: FormatHandler;
  redo: FormatHandler;
  increaseIndent: FormatHandler;
  decreaseIndent: FormatHandler;
  superscript: FormatHandler;
  subscript: FormatHandler;
  insertTable: () => void;
  insertHeaderRow: () => unknown;
  insertRowAbove: () => unknown;
  insertRowBelow: () => unknown;
  insertColumnLeft: () => unknown;
  insertColumnRight: () => unknown;
  deleteColumn: () => unknown;
  deleteRow: () => unknown;
  deleteTable: () => unknown;
  // the toolbar button passes its click event here, the context menu a cell or table element
  cellProperties: ($element?: dxElementWrapper | FormatHandlerArgs) => void;
  tableProperties: ($element?: dxElementWrapper | FormatHandlerArgs) => void;
  ai: (options: AITextTransformOptions) => void;
}
