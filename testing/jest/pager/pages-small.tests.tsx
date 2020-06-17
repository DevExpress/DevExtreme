import { h, createRef } from 'preact';
import { shallow } from 'enzyme';
import PagesSmall, { viewFunction as PagesSmallComponent } from '../../../js/renovation/pager/pages-small';
import getElementComputedStyle from '../../../js/renovation/pager/utils/get-computed-style';
import NumberBox from '../../../js/renovation/number-box';

jest.mock('../../../js/renovation/number-box', jest.fn());
jest.mock('../../../js/renovation/pager/page', jest.fn());
jest.mock('../../../js/renovation/pager/utils/get-computed-style');

describe('Small pager pages', () => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const render = (props) => {
    const tree = shallow<Element>(<PagesSmallComponent {...props} /> as any);
    const pageIndexNumberBox = tree.childAt(0);
    const span = tree.childAt(1);
    const maxPage = tree.childAt(2);

    return {
      tree,
      pageIndexNumberBox,
      span,
      maxPage,
    };
  };

  it('View', () => {
    const props = {
      valueChange: jest.fn(),
      width: 40,
      value: 3,
      pageIndexRef: createRef() as NumberBox,
      selectLastPageIndex: jest.fn(),
      props: { pageCount: 100, pagesCountText: 'of', rtlEnabled: true },
    } as Partial<PagesSmall>;
    const {
      tree, pageIndexNumberBox, span, maxPage,
    } = render(props);
    expect(tree.props().className).toBe('dx-light-pages');

    expect(pageIndexNumberBox.props()).toEqual({
      className: 'dx-page-index', max: 100, min: 1, value: 3, rtlEnabled: true, valueChange: props.valueChange, width: 40,
    });
    expect(span.html()).toBe('<span class="dx-info  dx-info-text">of</span>');
    expect(maxPage.props()).toEqual({
      children: [], index: 99, selected: false, className: 'dx-pages-count', onClick: props.selectLastPageIndex,
    });
  });
  it('updateWidth effect', () => {
    (getElementComputedStyle as jest.Mock).mockReturnValue({ minWidth: '19px' });
    const component = new PagesSmall({ pageCount: 100 });
    const numberBoxElement = {};
    component.pageIndexRef = { getHtmlElement: () => numberBoxElement }as any;
    component.updateWidth();
    expect(getElementComputedStyle).toBeCalledWith(numberBoxElement);
    expect(component.width).toBe(19 + 10 * 3);
  });
  it('selectLastPageIndex', () => {
    const pageIndexChangeHandler = jest.fn();
    const component = new PagesSmall({
      pageCount: 3,
      pageIndex: 2,
      pageIndexChange: pageIndexChangeHandler,
    });
    component.selectLastPageIndex();
    expect(pageIndexChangeHandler).toBeCalledWith(2);
  });
  it('setValue', () => {
    const pageIndexChangeHandler = jest.fn();
    const component = new PagesSmall({
      pageCount: 3,
      pageIndex: 2,
      pageIndexChange: pageIndexChangeHandler,
    });
    component.valueChange(1);
    expect(pageIndexChangeHandler).toBeCalledWith(0);
  });
});
