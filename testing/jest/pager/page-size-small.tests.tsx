/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from 'preact';
import { shallow } from 'enzyme';
import { PageSizeSmall, viewFunction as PageSizeSmallComponent } from '../../../js/renovation/pager/page_size/small';
import getElementComputedStyle from '../../../js/renovation/pager/utils/get_computed_style';

jest.mock('../../../js/renovation/pager/utils/get_computed_style');
jest.mock('../../../js/renovation/select_box', () => ({ SelectBox: () => { } }));

describe('Pager size selector', () => {
  const pageSizes = [{ text: '5', value: 5 }, { text: '10', value: 10 }];
  it('View', () => {
    const props = {
      width: 30,
      props: {
        parentRef: {} as HTMLElement,
        rtlEnabled: true,
        pageSize: 5,
        pageSizeChange: jest.fn(),
        pageSizes,
      },
    } as Partial<PageSizeSmall>;
    const tree = shallow(<PageSizeSmallComponent {...props as any} />as any);
    expect(tree.props()).toEqual({
      children: [],
      displayExpr: 'text',
      valueExpr: 'value',
      dataSource: [{ text: '5', value: 5 }, { text: '10', value: 10 }],
      rtlEnabled: true,
      valueChange: props.props?.pageSizeChange,
      value: 5,
      width: 30,
    });
  });
  it('Effect updateWidth selectBox width', () => {
    (getElementComputedStyle as jest.Mock).mockReturnValue({ minWidth: '42px' });
    const parentRef = { minWidth: '42px' };
    const component = new PageSizeSmall({ parentRef, pageSizes: [...pageSizes, { text: '1000', value: 1000 }] } as any);
    component.updateWidth();
    expect(component.width).toBe(42 + 10 * 4);
    expect((getElementComputedStyle as jest.Mock)).toBeCalledWith(parentRef);
  });
});
