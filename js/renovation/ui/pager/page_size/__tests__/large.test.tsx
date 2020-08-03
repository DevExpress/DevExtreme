/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import {
  PageSizeLarge,
  PAGER_SELECTED_PAGE_SIZE_CLASS, PAGER_PAGE_SIZE_CLASS,
} from '../large';

describe('Pager size selector', () => {
  const pageSizes = [{ text: '5', value: 5 }, { text: '10', value: 10 }];

  it('render large page sizes', () => {
    const tree = shallow<PageSizeLarge>(<PageSizeLarge pageSizes={pageSizes} /> as any);
    expect(tree.children()).toHaveLength(2);
    expect(tree.children().map((c) => c.props())).toEqual([
      {
        children: '5', className: PAGER_SELECTED_PAGE_SIZE_CLASS, label: 'Display 5 items on page', onClick: expect.any(Function),
      },
      {
        children: '10', className: PAGER_PAGE_SIZE_CLASS, label: 'Display 10 items on page', onClick: expect.any(Function),
      },
    ]);
  });

  it('change pagesize in large selector', () => {
    const component = new PageSizeLarge({ pageSizes });
    component.pageSizesText[1].click();
    expect(component.props.pageSize).toBe(10);
  });
});
