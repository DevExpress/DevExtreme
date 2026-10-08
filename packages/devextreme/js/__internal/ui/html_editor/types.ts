import type { dxHtmlEditorVariables } from '@js/ui/html_editor';

import type {
  FormatBlotInstance,
  QuillInstance,
  QuillOptions,
  ScrollInstance,
} from './types/quill';

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

/** The `mention` value; `keyInTemplateStorage` is set only by the mentions module */
export interface MentionData {
  marker?: string;
  id?: string;
  value?: string;
  keyInTemplateStorage?: string;
}

/** Key of a mention template; `editorKey` is undefined when Quill renders the blot */
export interface MentionTemplateKey {
  editorKey: string | undefined;
  marker: string | undefined;
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
