import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { camelize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';

import type {
  BaseQuillModuleInstance,
  FormatBlotInstance,
  QuillInstance,
  RangeStatic,
} from '../types/quill';

type TableOperationName = 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow'
  | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable';

type LineDirection = 'horizontal' | 'vertical';

interface LineElementsFormat {
  elements: dxElementWrapper;
  property: string;
  value: number;
}

/** The table blot to unfix, or the Quill instance that finds it from the table element. */
type UnfixTableWidthOptions = { tableBlot: FormatBlotInstance; quill?: QuillInstance }
  | { tableBlot?: undefined; quill: QuillInstance };

const TABLE_FORMATS = ['table', 'tableHeaderCell'];
const TABLE_OPERATIONS = [
  'insertTable',
  'insertHeaderRow',
  'insertRowAbove',
  'insertRowBelow',
  'insertColumnLeft',
  'insertColumnRight',
  'deleteColumn',
  'deleteRow',
  'deleteTable',
  'cellProperties',
  'tableProperties',
];

function getTableFormats(quill: QuillInstance): string[] {
  const tableModule = quill.getModule('table');

  // backward compatibility with an old devextreme-quill packages
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- tableFormats() is untyped
  return tableModule?.tableFormats ? tableModule.tableFormats() : TABLE_FORMATS;
}

function hasEmbedContent(
  module: BaseQuillModuleInstance,
  selection: RangeStatic | null,
): boolean {
  return !!selection && module.quill.getText(selection).length < selection.length;
}

function unfixTableWidth(
  $table: dxElementWrapper,
  { tableBlot, quill }: UnfixTableWidthOptions,
): void {
  const unfixValue = 'initial';

  // @ts-expect-error scroll.find is typed as any blot or null (types/quill.ts)
  const formatBlot: FormatBlotInstance = tableBlot ?? quill.scroll.find($table.get(0));

  formatBlot.format('tableWidth', unfixValue);
}

function getColumnElements($table: dxElementWrapper, index = 0): dxElementWrapper {
  return $table.find('tr').eq(index).find('th, td');
}

function getRowElements($table: dxElementWrapper, index = 0): dxElementWrapper {
  return $table.find(`th:nth-child(${1 + index}), td:nth-child(${1 + index})`);
}

function getAutoSizedElements(
  $table: dxElementWrapper,
  direction: LineDirection = 'horizontal',
): dxElementWrapper[] {
  const result: dxElementWrapper[] = [];
  const isHorizontal = direction === 'horizontal';
  const $lineElements = isHorizontal ? getColumnElements($table) : getRowElements($table);

  // @ts-expect-error each requires a boolean callback result (renderer.d.ts); none is returned
  $lineElements.each((index, element) => {
    const $element = $(element);
    // @ts-expect-error get(0) is typed Element (renderer.d.ts); the cells are HTMLElements
    if ($element.get(0).style[isHorizontal ? 'width' : 'height'] === '') {
      result.push($element);
    }
  });

  return result;
}

function setLineElementsFormat(
  module: BaseQuillModuleInstance,
  { elements, property, value }: LineElementsFormat,
): void {
  const tableBlotNames: string[] = module.quill.getModule('table').tableBlots;
  const fullPropertyName = `cell${camelize(property, true)}`;
  each(elements, (i: number, element: Element) => {
    // @ts-expect-error scroll.find is typed as any blot (types/quill.ts)
    let formatBlot: FormatBlotInstance | null = module.quill.scroll.find(element);
    // @ts-expect-error find does not return null for a table cell element
    if (!tableBlotNames.includes(formatBlot.statics.blotName)) {
      // @ts-expect-error see above; a cell blot is a container, so it has descendant
      const descendBlot = formatBlot.descendant(
        (blot) => tableBlotNames.includes(blot.statics.blotName),
      );
      formatBlot = descendBlot ? descendBlot[0] : null;
    }
    formatBlot?.format(fullPropertyName, `${value}px`);
  });
}

function getLineElements(
  $table: dxElementWrapper,
  index: number,
  direction: LineDirection = 'horizontal',
): dxElementWrapper {
  return direction === 'horizontal' ? getRowElements($table, index) : getColumnElements($table, index);
}

function getTableOperationHandler(
  quill: QuillInstance,
  operationName: TableOperationName,
): () => void {
  return (): void => {
    const table = quill.getModule('table');

    if (!table) {
      return;
    }
    quill.focus();
    table[operationName]();
  };
}

export {
  getAutoSizedElements,
  getColumnElements,
  getLineElements,
  getRowElements,
  getTableFormats,
  getTableOperationHandler,
  hasEmbedContent,
  setLineElementsFormat,
  TABLE_OPERATIONS,
  unfixTableWidth,
};
