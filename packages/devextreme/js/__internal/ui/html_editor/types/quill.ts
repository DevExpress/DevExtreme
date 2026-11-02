/**
 * Quill TypeScript definitions
 * Based on Quill 2.0 API and DevExtreme usage patterns
 */

export interface DeltaOperation {
  insert?: string | Record<string, unknown>;
  delete?: number;
  retain?: number;
  attributes?: Record<string, unknown>;
}

export type DeltaConstructor = new (ops?: DeltaOperation[] | { ops: DeltaOperation[] }) => Delta;

export interface Delta {
  ops: DeltaOperation[];
  retain: (length: number, attributes?: Record<string, unknown>) => Delta;
  delete: (length: number) => Delta;
  insert: (
    content: string | Record<string, unknown>,
    attributes?: Record<string, unknown>,
  ) => Delta;
  length: () => number;
  slice: (start?: number, end?: number) => Delta;
  concat: (other: Delta) => Delta;
  diff: (other: Delta, cursor?: number) => Delta;
  transform: (other: Delta, priority?: boolean) => Delta;
  transformPosition: (index: number, priority?: boolean) => number;
  compose: (other: Delta) => Delta;
  reduce: <T>(
    callback: (accumulator: T, operation: DeltaOperation, index: number) => T,
    initialValue?: T,
  ) => T;
}

export interface RangeStatic {
  index: number;
  length: number;
}

export interface BoundsStatic {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
}

export interface BlotConstructor {
  blotName?: string;
  tagName?: string;
  className?: string;
  scope?: unknown;
  new (...args: unknown[]): unknown;
}

/** A table, row or cell blot of the table module */
export interface TableBlotInstance extends FormatBlotInstance {
  domNode: HTMLElement;
  childFormatName: string;
  children: { forEach: (callback: (child: TableBlotInstance) => void) => void };
}

/** devextreme-quill `modules/table`; `getTable()` yields nulls and -1 outside a table */
export interface TableModule {
  tableBlots: string[];
  tableFormats: () => string[];
  getTable: (range?: RangeStatic | null) =>
  [TableBlotInstance, TableBlotInstance, TableBlotInstance, number] | [null, null, null, -1];
  insertTable: (rows: number, columns: number) => void;
  insertHeaderRow: () => void;
  insertRowAbove: () => void;
  insertRowBelow: () => void;
  insertColumnLeft: () => void;
  insertColumnRight: () => void;
  deleteColumn: () => void;
  deleteRow: () => void;
  deleteTable: () => void;
}

/** devextreme-quill `modules/uploader` */
export interface UploaderModule {
  upload: (range: RangeStatic, files: File[] | FileList, force?: boolean) => void;
  preventImageUploading: (value: boolean) => void;
}

/** A leaf blot (text or embed) */
export interface LeafBlotInstance extends BlotInstance {
  domNode: Node;
}

export interface BlotInstance {
  offset: (scroll: ScrollInstance) => number;
  length: () => number;
  deleteAt: (index: number, length: number) => void;
  formatAt: (index: number, length: number, name: string, value: unknown) => void;
  insertAt: (index: number, value: string | unknown, def?: unknown) => void;
}

export interface FormatBlotInstance extends BlotInstance {
  format: (property: string, value: unknown) => void;
  statics: {
    blotName: string;
  };
  descendant?: (predicate: (blot: FormatBlotInstance) => boolean) => [FormatBlotInstance] | null;
}

export interface ScrollInstance {
  find: (node: Node) => FormatBlotInstance | BlotInstance | null;
  create: (name: string, value?: unknown) => BlotInstance;
  deleteAt: (index: number, length: number) => void;
  formatAt: (index: number, length: number, name: string, value: unknown) => void;
  insertAt: (index: number, value: string | unknown, def?: unknown) => void;
  length: () => number;
  descendant: (blotClass: BlotConstructor, index: number) => [BlotInstance | null, number];
}

export interface AttributorConstructor {
  attrName?: string;
  keyName?: string;
  scope?: unknown;
  whitelist?: string[] | null;
  new (...args: unknown[]): unknown;
}

export interface QuillOptions {
  bounds?: HTMLElement | string;
  debug?: string | boolean;
  formats?: string[];
  modules?: Record<string, unknown>;
  placeholder?: string;
  readOnly?: boolean;
  registry?: unknown;
  scrollingContainer?: HTMLElement | string;
  strict?: boolean;
  theme?: string;
}

/** `on`/`once`/`off`: the Quill events the editor subscribes to and their handler signatures */
export interface QuillEventSubscriber {
  (
    eventName: 'text-change',
    handler: (delta: Delta, oldDelta: Delta, source: string) => void,
  ): QuillInstance;
  (
    eventName: 'selection-change',
    handler: (range: RangeStatic | null, oldRange: RangeStatic | null, source: string) => void,
  ): QuillInstance;
  (eventName: string, handler: (...args: unknown[]) => void): QuillInstance;
}

export interface QuillInstance {
  deleteText: (index: number, length: number, source?: string) => Delta;
  getContents: (index?: number, length?: number) => Delta;
  getLength: () => number;
  getText: ((index?: number, length?: number) => string) & ((range: RangeStatic) => string);
  getSemanticHTML: (index?: number, length?: number) => string;
  insertEmbed: (index: number, type: string, value: unknown, source?: string) => Delta;
  insertText: (
    index: number,
    text: string,
    formatOrSource?: string,
    value?: unknown,
    source?: string,
  ) => Delta;
  setContents: (delta: Delta, source?: string) => Delta;
  setText: (text: string, source?: string) => Delta;
  updateContents: (delta: Delta, source?: string) => Delta;

  format: (name: string, value: unknown, source?: string) => Delta;
  formatLine: (
    index: number,
    length: number,
    formats: Record<string, unknown> | string,
    value?: unknown,
    source?: string,
  ) => Delta;
  formatText: (
    index: number,
    length: number,
    formats: Record<string, unknown> | string,
    value?: unknown,
    source?: string,
  ) => Delta;
  getFormat: (range?: RangeStatic | number, length?: number) => Record<string, unknown>;
  removeFormat: {
    (index: number, length: number, source?: string): Delta;
    (range: RangeStatic, source?: string): Delta;
  };

  blur: () => void;
  focus: () => void;
  getBounds: (index: number, length?: number) => BoundsStatic;
  getSelection: (focus?: boolean) => RangeStatic | null;
  setSelection: (index: number | RangeStatic, length?: number, source?: string) => void;

  on: QuillEventSubscriber;
  once: QuillEventSubscriber;
  off: QuillEventSubscriber;

  getLeaf: (index: number) => [LeafBlotInstance | null, number];
  getModule: {
    (name: 'table'): TableModule;
    (name: 'uploader'): UploaderModule;
    <T = unknown>(name: string): T;
  };

  history: {
    clear: () => void;
    redo: () => void;
    undo: () => void;
    stack: { undo: unknown[]; redo: unknown[] };
  };

  keyboard: KeyboardModule;
  root: HTMLElement;
  container: HTMLElement;
  scrollingContainer: HTMLElement;
  theme: unknown;
  scroll: ScrollInstance;
}

export interface QuillModule {
  constructor: (quill: QuillInstance, options?: unknown) => void;
}

export type BaseQuillModuleConstructor = new (
  quill: QuillInstance,
  options?: unknown
) => BaseQuillModuleInstance;

export interface BaseQuillModuleInstance {
  quill: QuillInstance;
  options?: unknown;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  clean?(): void;
  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  option?(name: string, value: unknown): void;
}

export interface QuillStatic {
  // Static methods
  import: {
    (path: 'delta'): DeltaConstructor;
    <T = unknown>(path: string): T;
  };
  MS_LIST_DATA_KEY: string;
  replaceStyleAttribute: (html: string) => string;
  register: (
    modules: Record<string, unknown> | string | BlotConstructor | AttributorConstructor,
    overwrite?: boolean,
  ) => void;
  find: (node: Node, bubble?: boolean) => unknown;

  imports: Record<string, unknown>;

  events: {
    EDITOR_CHANGE: string;
    SELECTION_CHANGE: string;
    TEXT_CHANGE: string;
  };

  sources: {
    API: string;
    SILENT: string;
    USER: string;
  };

  new (container: string | Element, options?: QuillOptions): QuillInstance;
}

export type Quill = QuillStatic;

export default Quill;

/** A Quill keyboard binding (`modules/keyboard`): the key(s), the modifier state and the handler */
export interface KeyboardBinding {
  key?: string | string[];
  which?: number;
  altKey?: boolean | null;
  ctrlKey?: boolean | null;
  metaKey?: boolean | null;
  shiftKey?: boolean | null;
  shortKey?: boolean | null;
  handler?: KeyboardBindingHandler;
}

/** What Quill's keyboard module passes to a binding handler after the selection range */
export interface KeyboardBindingContext {
  collapsed: boolean;
  empty: boolean;
  format: Record<string, unknown>;
  line: BlotInstance;
  offset: number;
  prefix: string;
  suffix: string;
  event: KeyboardEvent;
}

/** A binding handler; Quill lets the browser handle the key only when it returns `true` */
export type KeyboardBindingHandler = (
  range: RangeStatic,
  context: KeyboardBindingContext,
  binding: KeyboardBinding,
) => unknown;

/** devextreme-quill `modules/keyboard` (`quill.keyboard`), as far as the modules use it */
export interface KeyboardModule {
  bindings: Record<string, KeyboardBinding[]>;
  addBinding: (binding: KeyboardBinding, handler: KeyboardBindingHandler) => void;
}
