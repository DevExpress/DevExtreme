/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { RefObject } from '@devextreme-generator/declarations';
import { PageSizeSmall, viewFunction as PageSizeSmallComponent } from '../small';
import getElementComputedStyle from '../../../../utils/get_computed_style';

jest.mock('../../../../utils/get_computed_style');
jest.mock('../../../drop_down_editors/select_box', () => ({ SelectBox: () => { } }));

describe('Pager size selector', () => {
  const pageSizes = [{ text: '5', value: 5 }, { text: '10', value: 10 }];

  it('View', () => {
    const props = {
      width: 30,
      props: {
        parentRef: { current: {} } as RefObject<HTMLElement>,
        rtlEnabled: true,
        pageSize: 5,
        pageSizeChange: jest.fn(),
        pageSizes,
      },
    } as Partial<PageSizeSmall>;
    const tree = shallow(<PageSizeSmallComponent {...props as any} /> as any);
    expect(tree.props()).toEqual({
      displayExpr: 'text',
      valueExpr: 'value',
      dataSource: [{ text: '5', value: 5 }, { text: '10', value: 10 }],
      valueChange: props.props?.pageSizeChange,
      value: 5,
      width: 30,
    });
  });

  describe('Behaviour', () => {
    it('Effect updateWidth', () => {
      (getElementComputedStyle as jest.Mock).mockReturnValue({ minWidth: '42px' });
      const parentRef = { current: { minWidth: '42px' } };
      const component = new PageSizeSmall({ parentRef, pageSizes: [...pageSizes, { text: '1000', value: 1000 }] } as any);
      component.updateWidth();
      expect(component.width).toBe(42 + 10 * 4);
      expect(getElementComputedStyle as jest.Mock).toBeCalledWith(parentRef.current);
    });

    it('Effect updateWidth, default width', () => {
      (getElementComputedStyle as jest.Mock).mockReturnValue(null);
      const component = new PageSizeSmall({
        pageSizes: [...pageSizes, { text: '1000', value: 1000 }],
        parentRef: { current: {} },
      } as any);
      component.updateWidth();
      expect(component.width).toBe(10 + 10 * 4);
    });
  });
});
