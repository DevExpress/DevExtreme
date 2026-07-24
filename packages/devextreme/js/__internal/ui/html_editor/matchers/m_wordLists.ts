import { isString } from '@js/core/utils/type';

function getListType(marker) {
  return marker.match(/\S+\./) ? 'ordered' : 'bullet';
}

function getIndent(node, msStyleAttributeName) {
  const style = node.getAttribute(msStyleAttributeName);

  if (style) {
    const level = style
      .replace(/\n+/g, '')
      .match(/level(\d+)/);

    return level ? level[1] - 1 : 0;
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

function removeNewLineChar(operations) {
  const newLineOperation = operations[operations.length - 1];
  newLineOperation.insert = newLineOperation.insert.trim();
}

const getMatcher = (quill) => {
  const Delta = quill.import('delta');
  const msStyleAttributeName = quill.MS_LIST_DATA_KEY;

  return (node, delta) => {
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

      if (content.indexOf(marker) !== 0) {
        return delta;
      }

      insertOperation.insert = content.substring(marker.length).replace(/^\s+/, '');
    } else {
      insertOperation.insert = insertOperation.insert.replace(/^\s+/, '');
      const listDecoratorMatches = insertOperation.insert.match(/^(\S+)\s+/);

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
