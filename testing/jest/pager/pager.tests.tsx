/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from 'preact';
import { mount } from 'enzyme';
import type { PagerProps } from '../../../js/renovation/pager/pager.p';
import PagerComponent from '../../../js/renovation/pager/pager.p';
import PageSizeSelectorComponent from '../../../js/renovation/pager/page-size-selector.p';
import PageIndexSelectorComponent from '../../../js/renovation/pager/page-index-selector.p';
import InfoTextComponent from '../../../js/renovation/pager/info.p';
import { PAGER_CLASS, PAGER_PAGES_CLASS } from '../../../js/renovation/pager/pager';

const pageSizeRender = jest.fn();

jest.mock('../../../js/renovation/pager/page-size-selector.p', () => (props) => pageSizeRender(props));
jest.mock('../../../js/renovation/select-box', () => { });

const pageIndexSelectorRender = jest.fn();
jest.mock('../../../js/renovation/pager/page-index-selector.p', () => (...args) => pageIndexSelectorRender(args));

const InfoTextComp = jest.fn();
jest.mock('../../../js/renovation/pager/info.p', () => (...args) => InfoTextComp(args));
type PagerPropsType = Partial<typeof PagerProps>;

describe('Pager size selector', () => {
  const render = (props: PagerPropsType) => {
    const root = mount(<PagerComponent {...props as typeof PagerProps} />);
    // Vitik: Use function instead of property because property return old value after update
    return {
      root,
      // tslint:disable-next-line: object-literal-sort-keys
      container: root.childAt(0),
      pageSize: () => root.find(PageSizeSelectorComponent),
      pageSelectorContainer: () => root.childAt(0).childAt(1),
      pageIndexSelector: () => root.find(PageIndexSelectorComponent),
      infoText: () => root.find(InfoTextComponent),
    };
  };
  beforeEach(() => {
    pageSizeRender.mockClear();
    pageIndexSelectorRender.mockClear();
    InfoTextComp.mockClear();
  });
  it('render pager', () => {
    const {
      container, pageSize, pageSelectorContainer, pageIndexSelector, infoText,
    } = render({});
    // Vitik: Test real class instead of props for child component
    expect(container.getDOMNode().className).toBe(PAGER_CLASS);
    expect(pageSize().props())
      .toMatchObject({ isLargeDisplayMode: true, pageSize: 5, pageSizes: [5, 10] });
    expect(pageSelectorContainer().getDOMNode().className)
      .toBe(PAGER_PAGES_CLASS);
    expect(pageIndexSelector().props())
      .toMatchObject({ isLargeDisplayMode: true, pageIndex: 0, maxPagesCount: 10 });
    expect(infoText().props()).toMatchObject({
      infoTextMessageTemplate: 'Page {0} of {1} ({2} items)', pageCount: 10, pageIndex: 0, totalCount: 0,
    });
    expect(pageSizeRender).toHaveBeenCalledTimes(1);
    expect(pageIndexSelectorRender).toHaveBeenCalledTimes(1);
    expect(InfoTextComp).toHaveBeenCalledTimes(1);
  });
  it('change page size uncontrolled', async () => {
    const pageSizeChangeHandler = jest.fn();
    const { root, pageSize } = render({
      pageSizeChange: pageSizeChangeHandler,
      defaultPageSize: 5,
    });
    expect(pageSize().props()).toMatchObject({ pageSize: 5 });
    (pageSize().props()).pageSizeChanged(10);
    // Vitik: Update work only on the root component
    root.update();
    expect(pageSize().props()).toMatchObject({ pageSize: 10 });
  });
  it('change page size controlled', async () => {
    const pageSizeChangeHandler = jest.fn();
    const { root, pageSize } = render({ pageSizeChange: pageSizeChangeHandler, pageSize: 5 });
    expect(pageSize().props()).toMatchObject({ pageSize: 5 });
    (pageSize().props()).pageSizeChanged(10);
    // Vitik: Update work only on the root component
    root.update();
    // Vitik: no reaction because pageSize doesn't changed
    expect(pageSize().props()).toMatchObject({ pageSize: 5 });
    // Vitik: simulate pageSize changing in pageSizeChange
    root.setProps({ pageSizeChange: pageSizeChangeHandler, pageSize: 10 });
    expect(pageSize().props()).toMatchObject({ pageSize: 10 });
  });
});
