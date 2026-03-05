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

export interface Delta {
  ops?: DeltaOperation[];
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

export interface TableModule {
  getTable: () => [{ domNode: HTMLElement }, unknown, { domNode: HTMLElement }] | null;
  insertTable: (columns: number, rows: number) => void;
}

export interface BlotInstance {
  offset: (scroll: ScrollInstance) => number;
  length: () => number;
  deleteAt: (index: number, length: number) => void;
  formatAt: (index: number, length: number, name: string, value: unknown) => void;
  insertAt: (index: number, value: string | unknown, def?: unknown) => void;
}

export interface FormatBlotInstance extends BlotInstance {
  format: (property: string, value: string) => void;
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
  descendant: (blotClass: BlotConstructor, index: number) => [unknown, number];
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

  on: (eventName: string, handler: (...args: unknown[]) => void) => QuillInstance;
  once: (eventName: string, handler: (...args: unknown[]) => void) => QuillInstance;
  off: (eventName: string, handler: (...args: unknown[]) => void) => QuillInstance;

  getModule: {
    (name: 'table'): TableModule;
    (name: string): unknown;
  };

  history: {
    clear: () => void;
    redo: () => void;
    undo: () => void;
  };

  keyboard: unknown;
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
  clean?: () => void;
  option?: (name: string, value: unknown) => void;
}

export interface QuillStatic {
  // Static methods
  import: (path: string) => unknown;
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
