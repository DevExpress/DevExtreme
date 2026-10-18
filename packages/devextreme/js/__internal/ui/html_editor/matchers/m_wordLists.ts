import { isString } from '@js/core/utils/type';

import type {
  Delta as QuillDelta,
  DeltaConstructor,
  DeltaOperation,
  QuillStatic,
} from '../types/quill';

type ListType = 'ordered' | 'bullet';
type ClipboardMatcher = (node: Element, delta: QuillDelta) => QuillDelta;

function getListType(marker: string): ListType {
  return /\S+\./.exec(marker) ? 'ordered' : 'bullet';
}

function getIndent(node: Element, msStyleAttributeName: string): number | false {
  const style = node.getAttribute(msStyleAttributeName);

  if (style) {
    const level = /level(\d+)/.exec(style.replace(/\n+/g, ''));

    return level ? Number(level[1]) - 1 : 0;
  }
  return false;
}

function getListMarker(node: Element, msStyleAttributeName: string): string {
  const markerNode = Array
    .from(node.querySelectorAll('*'))
    .find((element) => {
      const style = element.getAttribute(msStyleAttributeName);
      return style ? /mso-list\s*:\s*ignore/i.test(style) : false;
    });

  return markerNode ? (markerNode.textContent ?? '').replace(/\s+/g, '') : '';
}

function removeNewLineChar(operations: DeltaOperation[]): void {
  const newLineOperation = operations[operations.length - 1];
  // @ts-expect-error the trailing op is assumed to be the paragraph's text insert; insert is wider
  newLineOperation.insert = newLineOperation.insert.trim();
}

const getMatcher = (quill: QuillStatic): ClipboardMatcher => {
  const Delta: DeltaConstructor = quill.import('delta');
  const msStyleAttributeName = quill.MS_LIST_DATA_KEY;

  return (node: Element, delta: QuillDelta): QuillDelta => {
    const ops = delta.ops.slice();

    const insertOperation = ops[0];

    if (!isString(insertOperation.insert)) {
      return delta;
    }

    const indent = getIndent(node, msStyleAttributeName);

    if (indent === false) {
      return delta;
    }

    const marker = getListMarker(node, msStyleAttributeName);
    let listType = getListType(marker);

    if (marker) {
      const content = insertOperation.insert.replace(/^\s+/, '');

      if (!content.startsWith(marker)) {
        return delta;
      }

      insertOperation.insert = content.substring(marker.length).replace(/^\s+/, '');
    } else {
      insertOperation.insert = insertOperation.insert.replace(/^\s+/, '');
      const listDecoratorMatches = /^(\S+)\s+/.exec(insertOperation.insert);

      if (!listDecoratorMatches) {
        return delta;
      }

      insertOperation.insert = insertOperation.insert.substring(listDecoratorMatches[0].length);
      listType = getListType(listDecoratorMatches[1]);
    }

    removeNewLineChar(ops);

    ops.push({ insert: '\n', attributes: { list: listType, indent } });
    return new Delta(ops);
  };
};

export default getMatcher;
