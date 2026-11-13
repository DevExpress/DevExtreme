import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/html_editor';
import type { QuillStatic } from '@ts/ui/html_editor/types/quill';

export const createNoScriptFrame = (): dxElementWrapper => $('<iframe>')
  .css('display', 'none')
  .attr({
    // eslint-disable-next-line spellcheck/spell-checker
    srcdoc: '', // NOTE: srcdoc is used to prevent an excess "Blocked script execution" error in Opera. See T1150911.
    id: 'xss-frame',
    sandbox: 'allow-same-origin',
  });

const REMOVED_ELEMENTS_SELECTOR = 'script, meta, base';
const URL_ATTRIBUTES = ['href', 'src', 'action', 'formaction', 'data', 'xlink:href'];
// NOTE: browsers ignore whitespace and control characters in a URL scheme
// eslint-disable-next-line no-control-regex
const IGNORED_URL_CHARACTERS = /[\u0000-\u0020]/g;
const SCRIPT_URL = /^(?:javascript|vbscript):/i;
const DATA_URL = /^data:/i;

// NOTE: a data URL is kept only as an image source: an image does not run scripts,
// while an SVG or (X)HTML document in an object, embed or iframe can
const isUnsafeUrl = (element: Element, name: string, value: string): boolean => {
  const url = value.replace(IGNORED_URL_CHARACTERS, '');

  if (SCRIPT_URL.test(url)) {
    return true;
  }

  return DATA_URL.test(url) && !(element.tagName === 'IMG' && name === 'src');
};

const isRemovedAttribute = (element: Element, { name, value }: Attr): boolean => {
  const lowerName = name.toLowerCase();

  return lowerName.startsWith('on')
    || lowerName === 'srcdoc'
    || (URL_ATTRIBUTES.includes(lowerName) && isUnsafeUrl(element, lowerName, value));
};

export const sanitizeHtml = (quill: QuillStatic, value: Properties['value']): string => {
  // NOTE: Used for server-side rendering, where the markup goes into the page as is.
  // Script, meta and base tags, inline handlers, srcdoc, script URLs
  // and non-image data URLs are removed to prevent XSS attacks and redirects (meta refresh).
  // "Blocked script execution in 'about:blank' because the document's frame is sandboxed
  // and the 'allow-scripts' permission is not set."
  // error can be logged to the console if the html value is XSS vulnerable.
  const $frame = createNoScriptFrame()
    // @ts-expect-error appendTo() is typed for elements; 'body' is a selector
    .appendTo('body');

  const frame = $frame.get(0);
  // @ts-expect-error get(0) is typed as Element; the frame is an iframe
  const frameWindow = frame.contentWindow;
  const frameDocument = frameWindow.document;
  const frameDocumentBody = frameDocument.body;

  // NOTE: Operations with style attribute is required
  // to prevent a 'unsafe-inline' CSP error in DOMParser.
  const valueWithoutStyles = quill.replaceStyleAttribute(value);

  frameDocumentBody.innerHTML = valueWithoutStyles;

  const removeUnsafeAttributes = (element): void => {
    if (element.attributes) {
      Array.from<Attr>(element.attributes).forEach((attribute) => {
        if (isRemovedAttribute(element, attribute)) {
          element.removeAttribute(attribute.name);
        }
      });
    }
    if (element.childNodes) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of, no-plusplus
      for (let i = 0; i < element.childNodes.length; i++) {
        removeUnsafeAttributes(element.childNodes[i]);
      }
    }
  };

  removeUnsafeAttributes(frameDocumentBody);

  // NOTE: Do not use jQuery to prevent an excess "Blocked script execution" error in Safari.
  frameDocumentBody
    .querySelectorAll(REMOVED_ELEMENTS_SELECTOR)
    .forEach((node) => { node.remove(); });

  const sanitizedHtml: string = frameDocumentBody.innerHTML;

  $frame.remove();

  return sanitizedHtml;
};

export default { createNoScriptFrame };
