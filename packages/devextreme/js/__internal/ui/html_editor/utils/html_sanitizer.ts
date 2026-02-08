import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/html_editor';
import type { QuillInstance } from '@ts/ui/html_editor/html_editor';

export const createNoScriptFrame = (): dxElementWrapper => $('<iframe>')
  .css('display', 'none')
  // @ts-expect-error
  .attr({
    // eslint-disable-next-line spellcheck/spell-checker
    srcdoc: '', // NOTE: srcdoc is used to prevent an excess "Blocked script execution" error in Opera. See T1150911.
    id: 'xss-frame',
    sandbox: 'allow-same-origin',
  });

export const sanitizeHtml = (quill: QuillInstance, value: Properties['value']): string => {
  // NOTE: Script tags and inline handlers are removed to prevent XSS attacks.
  // "Blocked script execution in 'about:blank' because the document's frame is sandboxed
  // and the 'allow-scripts' permission is not set."
  // error can be logged to the console if the html value is XSS vulnerable.
  const $frame = createNoScriptFrame()
    // @ts-expect-error ts-error
    .appendTo('body');

  const frame = $frame.get(0);
  // @ts-expect-error ts-error
  const frameWindow = frame.contentWindow;
  const frameDocument = frameWindow.document;
  const frameDocumentBody = frameDocument.body;

  // NOTE: Operations with style attribute is required
  // to prevent a 'unsafe-inline' CSP error in DOMParser.
  const valueWithoutStyles = quill.replaceStyleAttribute(value);

  frameDocumentBody.innerHTML = valueWithoutStyles;

  const removeInlineHandlers = (element): void => {
    if (element.attributes) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of, no-plusplus
      for (let i = 0; i < element.attributes.length; i++) {
        const { name } = element.attributes[i];
        if (name.startsWith('on')) {
          element.removeAttribute(name);
        }
      }
    }
    if (element.childNodes) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of, no-plusplus
      for (let i = 0; i < element.childNodes.length; i++) {
        removeInlineHandlers(element.childNodes[i]);
      }
    }
  };

  removeInlineHandlers(frameDocumentBody);

  // NOTE: Do not use jQuery to prevent an excess "Blocked script execution" error in Safari.
  frameDocumentBody
    .querySelectorAll('script')
    .forEach((scriptNode) => { scriptNode.remove(); });

  const sanitizedHtml: string = frameDocumentBody.innerHTML;

  $frame.remove();

  return sanitizedHtml;
};

export default { createNoScriptFrame };
