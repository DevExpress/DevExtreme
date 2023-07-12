/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import { PageSizeLarge } from '../large';
import messageLocalization from '../../../../../localization/message';

jest.mock('../../../../../localization/message', () => ({
  getFormatter: jest.fn(),
}));

describe('Pager size selector', () => {
  const pageSizes = [{ text: '5', value: 5 }, { text: '10', value: 10 }, { text: 'All', value: 0 }];

  it('render large page sizes', () => {
    pageSizes.forEach((pageSize) => (messageLocalization.getFormatter as jest.Mock).mockReturnValueOnce(() => `Items per page: ${pageSize.text}`));
    const tree = shallow(<PageSizeLarge pageSizes={pageSizes} pageSize={5} />);
    expect(tree.children()).toHaveLength(3);
    expect(tree.children().map((c) => c.props())).toEqual([
      {
        children: '5', className: 'dx-page-size dx-selection dx-first-child', label: 'Items per page: 5', onClick: expect.any(Function),
      },
      {
        children: '10', className: 'dx-page-size', label: 'Items per page: 10', onClick: expect.any(Function),
      },
      {
        children: 'All', className: 'dx-page-size', label: 'Items per page: All', onClick: expect.any(Function),
      },
    ]);
  });

  it('change pagesize in large selector', () => {
    pageSizes.forEach((pageSize) => (messageLocalization.getFormatter as jest.Mock).mockReturnValueOnce(() => `Items per page: ${pageSize.text}`));
    const component = new PageSizeLarge({
      pageSizes,
      pageSizeChange: jest.fn(),
    });
    component.pageSizesText[1].click();
    expect(component.props.pageSizeChange).toBeCalledWith(10);
  });
});
