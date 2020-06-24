/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from 'preact';
import { shallow } from 'enzyme';
import PageSizeSelector from '../../../../../js/renovation/pager/page-size-selector';

jest.mock('../../../../../js/renovation/pager/page-size-small', () => { });
jest.mock('../../../../../js/renovation/pager/page-size-large', () => { });

describe('Pager size selector', () => {
  it('View, default props', () => {
    const pageSizeChange = jest.fn();
    const tree = shallow(<PageSizeSelector pageSizeChange={pageSizeChange} />);
    expect(tree.props()).toEqual({ className: 'dx-page-sizes' });
    expect(tree.childAt(0).props()).toEqual({
      pageSize: 5,
      pageSizeChange,
      pageSizes: [
        {
          text: '5',
          value: 5,
        },
        {
          text: '10',
          value: 10,
        },
      ],
    });
  });
  it('View isLargeDisplayMode = false', () => {
    const pageSizeChange = jest.fn();
    const tree = shallow<PageSizeSelector>(<PageSizeSelector
      isLargeDisplayMode={false}
      pageSizeChange={pageSizeChange}
    />);
    expect(tree.childAt(0).props()).toEqual({
      pageSize: 5,
      pageSizeChange,
      pageSizes: [
        {
          text: '5',
          value: 5,
        },
        {
          text: '10',
          value: 10,
        },
      ],
      parentRef: tree.instance().getHtmlElementWorkAround,
      rtlEnabled: false,
    });
  });
});
