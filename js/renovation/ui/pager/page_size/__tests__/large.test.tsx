/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { PageSizeLarge } from '../large';

describe('Pager size selector', () => {
  const pageSizes = [{ text: '5', value: 5 }, { text: '10', value: 10 }];

  it('render large page sizes', () => {
    const tree = shallow(<PageSizeLarge pageSizes={pageSizes} pageSize={5} />);
    expect(tree.children()).toHaveLength(2);
    expect(tree.children().map((c) => c.props())).toEqual([
      {
        children: '5', className: 'dx-page-size dx-selection', label: 'Display 5 items on page', onClick: expect.any(Function),
      },
      {
        children: '10', className: 'dx-page-size', label: 'Display 10 items on page', onClick: expect.any(Function),
      },
    ]);
  });

  it('change pagesize in large selector', () => {
    const component = new PageSizeLarge({ pageSizes });
    component.pageSizesText[1].click();
    expect(component.props.pageSize).toBe(10);
  });
});
