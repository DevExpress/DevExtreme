import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterWidth } from '@js/core/utils/size';
import type { Properties } from '@js/ui/drop_down_box';
import DropDownBox from '@js/ui/drop_down_box';

import { DropDownEditorModel } from './__mock__/model/drop_down_editor';

const FIELD_WIDTH = 200;

const createDropDownBox = (options: Partial<Properties> = {}): DropDownEditorModel => {
  const $element = $('<div>').appendTo(document.body);

  // eslint-disable-next-line no-new
  new DropDownBox($element.get(0) as HTMLElement, {
    dataSource: [{ id: 1, text: 'Item one' }],
    valueExpr: 'id',
    displayExpr: 'text',
    value: 1,
    contentTemplate: (): dxElementWrapper => $('<div>').text('Hello world'),
    ...options,
  });

  return new DropDownEditorModel($element.get(0) as HTMLElement);
};

describe('DropDownBox', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('drop-down popup width with deferRendering disabled (T1332185)', () => {
    it('should size the popup to the field when opened after the field gets its width', () => {
      const dropDownBox = createDropDownBox({ deferRendering: false });
      jest.runAllTimers();

      dropDownBox.getElement().style.width = `${FIELD_WIDTH}px`;

      dropDownBox.open();
      jest.runAllTimers();

      expect(getOuterWidth(dropDownBox.getOverlay().getElement())).toBe(FIELD_WIDTH);
    });
  });
});
