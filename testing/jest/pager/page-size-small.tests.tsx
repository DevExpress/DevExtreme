/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from 'preact';
import { shallow } from 'enzyme';
import PageSizeSmall from '../../../js/renovation/pager/page-size-small';
import getElementComputedStyle from '../../../js/renovation/pager/utils/get-computed-style';

jest.mock('../../../js/renovation/pager/utils/get-computed-style');
jest.mock('../../../js/renovation/select-box', () => { });

describe('Pager size selector', () => {
  const pageSizes = [{ text: '5', value: 5 }, { text: '10', value: 10 }];
  it('View', () => {
    const pageSizeChange = jest.fn();
    const tree = shallow(<PageSizeSmall
      pageSizeChange={pageSizeChange}
      pageSizes={[{ text: '5', value: 5 }, { text: '10', value: 10 }]}
    />);
    expect(tree.props()).toEqual({
      displayExpr: 'text',
      valueExpr: 'value',
      dataSource: [{ text: '5', value: 5 }, { text: '10', value: 10 }],
      rtlEnabled: false,
      valueChange: pageSizeChange,
      value: 5,
      width: 30,
    });
  });
  it('View rtlEnabled', () => {
    const tree = shallow(<PageSizeSmall
      rtlEnabled
      pageSizes={pageSizes}
    />);
    expect(tree.props()).toMatchObject({ rtlEnabled: true });
  });
  it('Effect updateWidth selectBox width', () => {
    (getElementComputedStyle as jest.Mock).mockReturnValue({ minWidth: '42px' });
    const parentRef = jest.fn().mockReturnValue({ minWidth: '42px' });
    const component = new PageSizeSmall({ parentRef, pageSizes: [...pageSizes, { text: '1000', value: 1000 }] } as any);
    component.updateWidth();
    expect(component.width).toBe(42 + 10 * 4);
    expect((getElementComputedStyle as jest.Mock)).toBeCalledWith(parentRef());
  });
});
