import domAdapter from '@js/core/dom_adapter';

interface TagWrapper {
  tagsCount: number;
  startTags: string;
  endTags: string;
}

const isTagName = (/<([a-z][^/\0>\x20\t\r\n\f]+)/i);

const tagWrappers: Record<string, TagWrapper> = {
  default: {
    tagsCount: 0,
    startTags: '',
    endTags: '',
  },
  thead: {
    tagsCount: 1,
    startTags: '<table>',
    endTags: '</table>',
  },
  td: {
    tagsCount: 3,
    startTags: '<table><tbody><tr>',
    endTags: '</tr></tbody></table>',
  },
  col: {
    tagsCount: 2,
    startTags: '<table><colgroup>',
    endTags: '</colgroup></table>',
  },
  tr: {
    tagsCount: 2,
    startTags: '<table><tbody>',
    endTags: '</tbody></table>',
  },
};

tagWrappers.tfoot = tagWrappers.thead;
tagWrappers.caption = tagWrappers.thead;
tagWrappers.colgroup = tagWrappers.thead;
tagWrappers.tbody = tagWrappers.thead;
tagWrappers.th = tagWrappers.td;

export const parseHTML = function (html: unknown): ChildNode[] | null {
  if (typeof html !== 'string') {
    return null;
  }

  const fragment = domAdapter.createDocumentFragment();
  let container: HTMLElement | ChildNode = fragment.appendChild(domAdapter.createElement('div'));
  const tags = isTagName.exec(html);
  const firstRootTag = tags?.[1].toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- no tag: default wrapper
  const tagWrapper = tagWrappers[firstRootTag!] || tagWrappers.default;

  (container as HTMLElement).innerHTML = tagWrapper.startTags + html + tagWrapper.endTags;

  for (let i = 0; i < tagWrapper.tagsCount; i += 1) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- the wrapper has a child
    container = container.lastChild!;
  }

  return [...container.childNodes];
};

export const isTablePart = function (html: string): boolean | null {
  const tags = isTagName.exec(html);
  return tags && tags[1] in tagWrappers;
};
